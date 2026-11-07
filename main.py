"""Китобхона: сервер Telegram Mini App + бот + ИИ-прокси + синхронизация + оплата Stars.
Запуск: uvicorn main:app --host 0.0.0.0 --port 8000
"""
import os, hmac, hashlib, json, time, sqlite3, asyncio
from urllib.parse import parse_qsl
from contextlib import asynccontextmanager
from datetime import date

from fastapi import FastAPI, Header
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from anthropic import AsyncAnthropic
from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart, Command
from aiogram.types import (Message, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton,
                           MenuButtonWebApp, LabeledPrice, PreCheckoutQuery)

BOT_TOKEN = os.environ["BOT_TOKEN"]
WEBAPP_URL = os.environ["WEBAPP_URL"].rstrip("/")        # https://ваш-сайт.example
API_KEY = os.environ["ANTHROPIC_API_KEY"]
MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-5-5")
MODEL_QUICK = os.getenv("ANTHROPIC_MODEL_QUICK", "claude-haiku-5-5")
FREE_AI = int(os.getenv("FREE_AI_PER_DAY", "15"))        # бесплатных запросов ИИ в день
PRO_AI = int(os.getenv("PRO_AI_PER_DAY", "300"))         # лимит для Pro
PRO_STARS = int(os.getenv("PRO_STARS", "150"))           # цена Pro за 30 дней в Telegram Stars
PRO_DAYS = 30
DB_PATH = os.getenv("DB_PATH", "data.db")

bot = Bot(BOT_TOKEN)
dp = Dispatcher()
client = AsyncAnthropic(api_key=API_KEY)


# ---------------- база данных ----------------
def db():
    c = sqlite3.connect(DB_PATH, check_same_thread=False)
    c.row_factory = sqlite3.Row
    return c

def init_db():
    with db() as c:
        c.executescript("""
        CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, pro_until INTEGER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS usage(uid INTEGER, day TEXT, n INTEGER DEFAULT 0, PRIMARY KEY(uid, day));
        CREATE TABLE IF NOT EXISTS state(uid INTEGER PRIMARY KEY, ts INTEGER, j TEXT);
        """)

def pro_until(uid: int) -> int:
    with db() as c:
        r = c.execute("SELECT pro_until FROM users WHERE id=?", (uid,)).fetchone()
    return int(r["pro_until"]) if r else 0

def is_pro(uid: int) -> bool:
    return pro_until(uid) > time.time()

def add_pro(uid: int, days: int = PRO_DAYS):
    base = max(int(time.time()), pro_until(uid))
    with db() as c:
        c.execute("INSERT INTO users(id, pro_until) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET pro_until=excluded.pro_until",
                  (uid, base + days * 86400))

def used_today(uid: int) -> int:
    with db() as c:
        r = c.execute("SELECT n FROM usage WHERE uid=? AND day=?", (uid, str(date.today()))).fetchone()
    return int(r["n"]) if r else 0

def bump(uid: int):
    with db() as c:
        c.execute("INSERT INTO usage(uid, day, n) VALUES(?,?,1) ON CONFLICT(uid, day) DO UPDATE SET n=n+1",
                  (uid, str(date.today())))

def left_today(uid: int) -> int:
    return (PRO_AI if is_pro(uid) else FREE_AI) - used_today(uid)


# ---------------- проверка Telegram initData ----------------
class AuthError(Exception):
    pass

def verify_init_data(init_data: str, token: str = None, max_age: int = 86400) -> int:
    token = token or BOT_TOKEN
    if not init_data:
        raise AuthError("no init data")
    pairs = dict(parse_qsl(init_data, keep_blank_values=True))
    got = pairs.pop("hash", None)
    if not got:
        raise AuthError("no hash")
    check = "\n".join(f"{k}={v}" for k, v in sorted(pairs.items()))
    secret = hmac.new(b"WebAppData", token.encode(), hashlib.sha256).digest()
    calc = hmac.new(secret, check.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(calc, got):
        raise AuthError("bad hash")
    if time.time() - int(pairs.get("auth_date", "0")) > max_age:
        raise AuthError("expired")
    return int(json.loads(pairs["user"])["id"])

def err(status: int, code: str, detail: str):
    return JSONResponse({"code": code, "detail": detail}, status_code=status)


# ---------------- ИИ-прокси ----------------
class AIReq(BaseModel):
    messages: list
    images: list[str] = []
    tier: str = "default"
    max_tokens: int = 1800

def normalize(messages, images):
    out = []
    for m in messages[-12:]:
        role = "assistant" if m.get("role") == "assistant" else "user"
        text = str(m.get("content", ""))[:30000]
        if out and out[-1]["role"] == role:
            out[-1]["content"] += "\n\n" + text
        else:
            out.append({"role": role, "content": text})
    while out and out[0]["role"] != "user":
        out.pop(0)
    if not out:
        return []
    if images:
        blocks = [{"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": im}}
                  for im in images[:3] if len(im) < 3_000_000]
        for i in range(len(out) - 1, -1, -1):
            if out[i]["role"] == "user":
                out[i]["content"] = blocks + [{"type": "text", "text": out[i]["content"]}]
                break
    return out


@asynccontextmanager
async def lifespan(app):
    init_db()
    try:
        await bot.set_chat_menu_button(menu_button=MenuButtonWebApp(text="📖 Китобхона", web_app=WebAppInfo(url=WEBAPP_URL)))
    except Exception as e:
        print("menu button:", e)
    task = asyncio.create_task(dp.start_polling(bot))
    yield
    task.cancel()
    await bot.session.close()

app = FastAPI(lifespan=lifespan)

@app.post("/api/ai")
async def api_ai(req: AIReq, x_init_data: str = Header(default="")):
    try:
        uid = verify_init_data(x_init_data)
    except AuthError as e:
        return err(401, "not_granted", str(e))
    if left_today(uid) <= 0:
        return err(429, "rate_limited", "Лимити имрӯза тамом шуд. Pro-ро фаъол кунед.")
    msgs = normalize(req.messages, req.images)
    if not msgs:
        return err(400, "bad", "empty")
    try:
        r = await client.messages.create(model=MODEL_QUICK if req.tier == "quick" else MODEL,
                                         max_tokens=min(req.max_tokens, 2500), messages=msgs)
    except Exception as e:
        print("anthropic:", e)
        return err(502, "error", "ИИ ҷавоб надод")
    bump(uid)
    return {"text": "".join(b.text for b in r.content if getattr(b, "type", "") == "text"),
            "left": left_today(uid)}

@app.get("/api/me")
async def api_me(x_init_data: str = Header(default="")):
    try:
        uid = verify_init_data(x_init_data)
    except AuthError as e:
        return err(401, "not_granted", str(e))
    return {"pro": is_pro(uid), "until": pro_until(uid), "left": left_today(uid)}

@app.get("/api/state")
async def api_state_get(x_init_data: str = Header(default="")):
    try:
        uid = verify_init_data(x_init_data)
    except AuthError as e:
        return err(401, "not_granted", str(e))
    with db() as c:
        r = c.execute("SELECT ts, j FROM state WHERE uid=?", (uid,)).fetchone()
    return {"ts": r["ts"], "j": r["j"]} if r else {"ts": 0, "j": ""}

class StateReq(BaseModel):
    ts: int
    j: str

@app.post("/api/state")
async def api_state_set(req: StateReq, x_init_data: str = Header(default="")):
    try:
        uid = verify_init_data(x_init_data)
    except AuthError as e:
        return err(401, "not_granted", str(e))
    if len(req.j) > 600_000:
        return err(413, "too_big", "state too big")
    with db() as c:
        c.execute("INSERT INTO state(uid, ts, j) VALUES(?,?,?) ON CONFLICT(uid) DO UPDATE SET ts=excluded.ts, j=excluded.j",
                  (uid, req.ts, req.j))
    return {"ok": True}

@app.post("/api/invoice")
async def api_invoice(x_init_data: str = Header(default="")):
    try:
        uid = verify_init_data(x_init_data)
    except AuthError as e:
        return err(401, "not_granted", str(e))
    link = await bot.create_invoice_link(
        title="Китобхона Pro", description=f"ИИ-репетитор, карточкаҳо, имтиҳонҳо · {PRO_DAYS} рӯз",
        payload=f"pro_{uid}", provider_token="", currency="XTR",
        prices=[LabeledPrice(label=f"Pro {PRO_DAYS} рӯз", amount=PRO_STARS)])
    return {"link": link}


# ---------------- бот ----------------
def open_kb():
    return InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="📖 Китобхонаро кушодан", web_app=WebAppInfo(url=WEBAPP_URL))]])

@dp.message(CommandStart())
async def cmd_start(m: Message):
    await m.answer("Салом! Ин Китобхона аст: китобҳо бо забони тоҷикӣ, ИИ-репетитор, карточкаҳо ва имтиҳонҳо.\n\nТугмаро пахш кунед.", reply_markup=open_kb())

@dp.message(Command("pro"))
async def cmd_pro(m: Message):
    await m.answer_invoice(title="Китобхона Pro", description=f"ИИ-репетитор, карточкаҳо, имтиҳонҳо · {PRO_DAYS} рӯз",
                           payload=f"pro_{m.from_user.id}", currency="XTR", provider_token="",
                           prices=[LabeledPrice(label=f"Pro {PRO_DAYS} рӯз", amount=PRO_STARS)])

@dp.pre_checkout_query()
async def pre_checkout(q: PreCheckoutQuery):
    await q.answer(ok=True)

@dp.message(F.successful_payment)
async def paid(m: Message):
    add_pro(m.from_user.id)
    await m.answer("Ташаккур! Pro фаъол шуд ✅", reply_markup=open_kb())


# ---------------- файлы приложения ----------------
os.makedirs("books", exist_ok=True)
app.mount("/books", StaticFiles(directory="books"), name="books")

@app.get("/")
async def index():
    return FileResponse("index.html")
