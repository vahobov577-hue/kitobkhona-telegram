/* =========================================================
   Родничок · анимации
   GSAP + ScrollTrigger + Lenis + WebGL + Canvas
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  gsap.registerPlugin(ScrollTrigger);
  $('.year').textContent = new Date().getFullYear();

  /* ---------- разбивка текста на буквы / слова / строки ---------- */
  $$('.split-chars').forEach(el => {
    const txt = el.textContent; el.textContent = '';
    [...txt].forEach(c => {
      const s = document.createElement('span'); s.className = 'ch'; s.textContent = c === ' ' ? ' ' : c; el.appendChild(s);
    });
  });
  $$('.reveal-words').forEach(el => {
    [...el.childNodes].forEach(node => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span'); s.className = 'wd'; s.textContent = w; frag.appendChild(s);
        });
        node.replaceWith(frag);
      } else if (node.nodeName === 'EM') node.classList.add('wd');
    });
  });
  $$('.split-lines').forEach(el => {
    el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map(l => `<span class="ln"><span>${l}</span></span>`).join('');
  });

  /* ---------- плавный скролл ---------- */
  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ lerp: .085, wheelMultiplier: .95, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollTo = target => lenis ? lenis.scrollTo(target, { duration: 1.6, offset: 0 }) : $(target)?.scrollIntoView({ behavior: 'smooth' });
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    e.preventDefault(); closeMenu(); scrollTo(id);
  }));

  /* ---------- WebGL-вода в hero ---------- */
  const water = window.WaterScene($('.hero__water'));
  if (water) water.running = false; // пока идёт прелоадер, GPU не тратим

  /* ---------- шапка: прячется вниз, появляется вверх ---------- */
  const header = $('.header'); let lastY = 0;
  const onScroll = y => {
    header.classList.toggle('is-solid', y > 60);
    header.classList.toggle('is-hidden', y > lastY && y > 400 && !menu.classList.contains('is-open'));
    lastY = y;
    if (water) water.scroll = y / innerHeight;
  };
  lenis ? lenis.on('scroll', e => onScroll(e.scroll)) : addEventListener('scroll', () => onScroll(scrollY), { passive: true });

  /* ---------- мобильное меню ---------- */
  const burger = $('.header__burger'), menu = $('.mobile-menu');
  function closeMenu() { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-hidden', 'true'); lenis?.start(); }
  burger.addEventListener('click', () => {
    const open = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open);
    open ? lenis?.stop() : lenis?.start();
    if (open) gsap.from($$('a', menu), { y: 60, opacity: 0, stagger: .06, duration: .8, ease: 'expo.out', delay: .2 });
  });

  /* ---------- бутылка-прогресс ---------- */
  const bp = $('.bottle-progress'), bw = $('.bottle-progress__water');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: s => { bp.classList.toggle('is-on', s.progress > .02); gsap.set(bw, { y: 88 - s.progress * 86 }); }
  });

  /* =========================================================
     PRELOADER → HERO INTRO
     ========================================================= */
  const loader = $('.loader'), fill = $('.loader__fill'), count = $('.loader__count span');
  const imgs = $$('img').filter(i => !i.loading || i.loading !== 'lazy');
  let loaded = 0;
  const prog = { v: 0 }; let forced = false;
  const target = () => (imgs.length ? loaded / imgs.length : 1) * 100;
  imgs.forEach(i => {
    const done = () => { loaded++; };
    i.complete ? done() : (i.addEventListener('load', done, { once: true }), i.addEventListener('error', done, { once: true }));
  });
  // прогресс зависит от времени, а не от количества кадров
  const minTime = reduce ? 0 : 1.6, start = performance.now();
  let lastT = start;
  (function tick() {
    const nowT = performance.now(), dt = (nowT - lastT) / 1000; lastT = nowT;
    const elapsed = (nowT - start) / 1000;
    const cap = forced ? 100 : Math.min(target(), minTime ? (elapsed / minTime) * 100 : 100);
    prog.v = Math.min(cap, prog.v + Math.max(4, (cap - prog.v) * 6) * dt * 10);
    count.textContent = Math.round(prog.v);
    fill.style.height = prog.v + '%';
    if (prog.v >= 100) return intro();
    requestAnimationFrame(tick);
  })();
  setTimeout(() => { forced = true; }, 6000);

  let introDone = false;
  function intro() {
    if (introDone) return; introDone = true;
    const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });
    if (water) { water.running = true; if (reduce) setTimeout(() => (water.running = false), 400); }
    tl.to('.loader__count, .loader__hint', { y: -30, opacity: 0, duration: .5, ease: 'power2.in' })
      .to('.loader__logo', { scale: 1.15, opacity: 0, duration: .7, ease: 'power2.in' }, '<.1')
      .to(loader, { clipPath: 'circle(0% at 50% 50%)', duration: 1.1 }, '-=.2')
      .add(() => { loader.remove(); document.body.classList.remove('is-loading'); lenis?.start(); ScrollTrigger.refresh(); })
      .from('.hero__blob', { scale: .4, opacity: 0, rotate: -12, duration: 1.6, ease: 'expo.out' }, '-=.75')
      .from('.hero__title .ch', {
        yPercent: 120, rotate: (i) => (i % 2 ? 14 : -14), opacity: 0, duration: 1.3, stagger: { each: .055, from: 'center' }, ease: 'back.out(1.6)'
      }, '<.15')
      .from('.hero__kicker, .hero__lead, .hero__scroll, .header > *', { y: 30, opacity: 0, duration: 1, stagger: .06, ease: 'expo.out' }, '<.4')
      .add(floatLetters);
    gsap.set(loader, { clipPath: 'circle(75% at 50% 50%)' });
  }

  // буквы «плавают» на воде
  function floatLetters() {
    if (reduce) return;
    $$('.hero__title .ch').forEach((c, i) => {
      gsap.to(c, { y: '+=' + (6 + (i % 3) * 3), rotation: (i % 2 ? 2 : -2), duration: 2.2 + (i % 4) * .3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .12 });
    });
  }

  if (reduce) return finishStatic();

  /* =========================================================
     HERO: параллакс при прокрутке
     ========================================================= */
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__blob', { yPercent: 28, scale: 1.18, ease: 'none' }, 0)
    .to('.hero__blob img', { scale: 1.35, ease: 'none' }, 0)
    .to('.hero__title', { yPercent: -40, letterSpacing: '0.06em', opacity: .2, ease: 'none' }, 0)
    .to('.hero__bottom, .hero__kicker', { yPercent: -120, opacity: 0, ease: 'none' }, 0);

  // буквы заголовка отталкиваются от курсора
  if (finePointer) {
    const chars = $$('.hero__title .ch');
    const qs = chars.map(c => ({ el: c, x: gsap.quickTo(c, 'x', { duration: .6, ease: 'power3' }), sy: gsap.quickTo(c, 'scaleY', { duration: .6, ease: 'power3' }) }));
    $('.hero').addEventListener('pointermove', e => {
      qs.forEach(q => {
        const r = q.el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy), f = Math.max(0, 1 - d / 320);
        q.x(-dx * f * .25); q.sy(1 + f * .25);
      });
    });
    $('.hero').addEventListener('pointerleave', () => qs.forEach(q => { q.x(0); q.sy(1); }));
  }

  /* =========================================================
     ЛЕНТЫ: скорость и направление зависят от скролла
     ========================================================= */
  $$('.ribbon__track').forEach((track, idx) => {
    track.innerHTML += track.innerHTML + track.innerHTML;
    let x = 0, dir = idx ? 1 : -1, boost = 0;
    const third = () => track.scrollWidth / 3;
    ScrollTrigger.create({
      trigger: '.ribbons', start: 'top bottom', end: 'bottom top',
      onUpdate: s => { boost = Math.min(Math.abs(s.getVelocity()) / 120, 18); dir = (s.direction === 1 ? -1 : 1) * (idx ? -1 : 1); }
    });
    gsap.ticker.add(() => {
      boost *= .94;
      x += (1.1 + boost) * dir;
      const w = third();
      if (x <= -w) x += w; if (x > 0) x -= w;
      gsap.set(track, { x });
    });
  });
  gsap.from('.ribbon--a', { rotate: 0, scrollTrigger: { trigger: '.ribbons', start: 'top bottom', end: 'center center', scrub: true } });
  gsap.from('.ribbon--b', { rotate: 0, scrollTrigger: { trigger: '.ribbons', start: 'top bottom', end: 'center center', scrub: true } });

  /* =========================================================
     МАНИФЕСТ: слова проявляются, картинки-пилюли раскрываются
     ========================================================= */
  gsap.timeline({ scrollTrigger: { trigger: '.manifest__text', start: 'top 80%', end: 'bottom 45%', scrub: true } })
    .to('.manifest__text .wd', { opacity: 1, stagger: .1, ease: 'none' })
    .to('.manifest__text .pill', { width: '2.2em', stagger: .7, ease: 'none', duration: .6 }, 0.2);

  /* =========================================================
     ЛИНЕЙКИ ПРОДУКЦИИ
     ========================================================= */
  const linesEl = $('.lines');
  const panels = $$('.line');
  panels.forEach(p => {
    p.style.setProperty('--bg', p.dataset.bg); p.style.setProperty('--fg', p.dataset.fg); p.style.setProperty('--acc', p.dataset.accent);
  });
  const setTheme = p => gsap.to(linesEl, { '--lbg': p.dataset.bg, '--lfg': p.dataset.fg, '--lacc': p.dataset.accent, duration: .9, ease: 'power2.out', overwrite: 'auto' });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const track = $('.lines__track');
    const dist = () => track.scrollWidth - innerWidth;
    let lastVel = 0;
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: linesEl, pin: true, scrub: 1, end: () => '+=' + dist(), invalidateOnRefresh: true,
        onUpdate: s => {
          gsap.set('.lines__progress i', { scaleX: s.progress });
          const v = gsap.utils.clamp(-12, 12, s.getVelocity() / -300);
          if (Math.abs(v - lastVel) > .3) { lastVel = v; gsap.to('.line__media', { skewX: v, duration: .6, ease: 'power3', overwrite: 'auto' }); }
        },
        onScrubComplete: () => { lastVel = 0; gsap.to('.line__media', { skewX: 0, duration: .8, ease: 'elastic.out(1,.5)' }); }
      }
    });

    panels.forEach((p, i) => {
      ScrollTrigger.create({ trigger: p, containerAnimation: tween, start: 'left 55%', end: 'right 55%', onToggle: s => s.isActive && setTheme(p) });
      gsap.fromTo($('.line__img img', p), { xPercent: -9 }, { xPercent: 9, ease: 'none',
        scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      if (i === 0) return;
      gsap.from($$('.line__num, .line__title, .line__sub, .line__desc, .chips li', p), {
        x: 120, opacity: 0, stagger: .04, ease: 'power3.out',
        scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 85%', end: 'left 30%', scrub: 1 }
      });
      gsap.from($('.line__media', p), { rotate: 8, scale: .7, ease: 'power2.out',
        scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'left 20%', scrub: 1 } });
    });
    return () => gsap.set(linesEl, { clearProps: '--lbg,--lfg,--lacc' });
  });
  mm.add('(max-width: 899px)', () => {
    panels.forEach(p => {
      gsap.from($('.line__media', p), { clipPath: 'inset(30% 20% 30% 20% round 28px)', scale: 1.1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 80%' } });
      gsap.from($$('.line__num, .line__title, .line__sub, .line__desc, .chips li', p), { y: 40, opacity: 0, stagger: .05, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 55%' } });
    });
  });

  // 3D-наклон фото продуктов
  if (finePointer) tilt($$('.line__media'), 8);

  /* =========================================================
     ЗАГОЛОВКИ: строки выезжают из-под маски
     ========================================================= */
  $$('.split-lines').forEach(el => {
    gsap.from($$('.ln > span', el), { yPercent: 110, rotate: 3, duration: 1.3, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  /* =========================================================
     ПУТЬ КАПЛИ: линия рисуется, капля следует по ней
     ========================================================= */
  const jBody = $('.journey__body'), jSvg = $('.journey__svg'), jPath = $('.journey__line'), jTrack = $('.journey__track'), drop = $('.journey__drop');
  let jLen = 1;
  // путь строится в пикселях под реальный размер блока: змейка между карточками
  const buildPath = () => {
    const W = jSvg.clientWidth, H = jSvg.clientHeight, n = 5, cx = W / 2, amp = W * (W < 100 ? .36 : .34);
    jSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    let d = `M${cx} 0`;
    for (let i = 0; i < n; i++) {
      const y0 = (H / n) * i, y1 = (H / n) * (i + 1), side = i % 2 ? -1 : 1;
      d += ` C${cx + amp * side} ${y0 + (y1 - y0) * .25}, ${cx + amp * side} ${y0 + (y1 - y0) * .75}, ${cx} ${y1}`;
    }
    jPath.setAttribute('d', d); jTrack.setAttribute('d', d);
    jLen = jPath.getTotalLength();
    jPath.style.strokeDasharray = jLen;
  };
  const placeDrop = p => {
    const pt = jPath.getPointAtLength(jLen * p), pt2 = jPath.getPointAtLength(Math.min(jLen, jLen * p + 4));
    const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI - 90;
    jPath.style.strokeDashoffset = jLen * (1 - p);
    gsap.set(drop, { x: pt.x + (jSvg.getBoundingClientRect().left - jBody.getBoundingClientRect().left), y: pt.y, rotation: ang * .35 });
  };
  buildPath(); placeDrop(0);
  ScrollTrigger.create({
    trigger: jBody, start: 'top 60%', end: 'bottom 60%', scrub: .6,
    onUpdate: s => placeDrop(s.progress),
    onRefreshInit: buildPath,
    onRefresh: s => placeDrop(s.progress)
  });
  $$('.step').forEach((st, i) => {
    gsap.from(st, { x: i % 2 ? 120 : -120, rotate: i % 2 ? 4 : -4, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: st, start: 'top 82%' } });
    gsap.from($('.step__n', st), { scale: .3, duration: 1.4, ease: 'elastic.out(1,.5)', scrollTrigger: { trigger: st, start: 'top 75%' } });
  });

  /* =========================================================
     ОДОМЕТР
     ========================================================= */
  $$('.odo').forEach(el => {
    const digits = String(el.dataset.to).split('');
    el.innerHTML = '';
    const strips = digits.map(d => {
      const col = document.createElement('span'); col.className = 'odo__col';
      const strip = document.createElement('span'); strip.className = 'odo__strip';
      strip.innerHTML = Array.from({ length: 20 }, (_, k) => `<span>${k % 10}</span>`).join('');
      col.appendChild(strip); el.appendChild(col);
      // ширина колонки = ширина итоговой цифры, чтобы «100» не разъезжалось
      const fit = () => { const m = document.createElement('span'); m.textContent = d; m.style.cssText = 'position:absolute;visibility:hidden';
        el.appendChild(m); col.style.width = m.getBoundingClientRect().width / parseFloat(getComputedStyle(el).fontSize) + 'em'; m.remove(); };
      fit(); document.fonts?.ready.then(fit);
      return { strip, d: +d };
    });
    if (el.dataset.suffix) { const s = document.createElement('span'); s.className = 'odo__suf'; s.textContent = el.dataset.suffix; el.appendChild(s); }
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => strips.forEach((o, i) => gsap.fromTo(o.strip, { yPercent: 0 }, { yPercent: -((10 + o.d) / 20) * 100, duration: 2.2 + i * .35, ease: 'expo.out', delay: i * .08 }))
    });
  });

  /* =========================================================
     НАГРАДЫ: колода → веер
     ========================================================= */
  mm.add('(min-width: 801px)', () => {
    const cards = $$('.award');
    const off = () => cards[0].offsetWidth + parseFloat(getComputedStyle($('.awards__deck')).columnGap || 30);
    gsap.fromTo(cards,
      { x: i => (1 - i) * off(), y: i => (i === 1 ? -20 : 40), rotate: i => (i - 1) * -9, scale: .82 },
      { x: 0, y: 0, rotate: 0, scale: 1, ease: 'power2.out', immediateRender: true,
        scrollTrigger: { trigger: '.awards__deck', start: 'top 85%', end: 'center 55%', scrub: 1, invalidateOnRefresh: true } });
    gsap.from('.award figcaption', { opacity: 0, y: 20, stagger: .1, scrollTrigger: { trigger: '.awards__deck', start: 'center 60%', end: 'center 45%', scrub: 1 } });
  });
  mm.add('(max-width: 800px)', () => {
    $$('.award').forEach(a => gsap.from(a, { y: 80, rotate: 6, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: a, start: 'top 85%' } }));
  });
  if (finePointer) tilt($$('.award__card'), 14, true);

  /* =========================================================
     ПРОИЗВОДСТВО: окно раскрывается
     ========================================================= */
  gsap.timeline({ scrollTrigger: { trigger: '.factory__stage', start: 'top top', end: '+=120%', pin: true, scrub: 1 } })
    .fromTo('.factory__media', { clipPath: 'inset(22% 30% 22% 30% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut' }, 0)
    .to('.factory__media img', { scale: 1, ease: 'power2.inOut' }, 0)
    .to('.factory__copy', { opacity: 1, duration: .3 }, .55)
    .from('.factory__title', { yPercent: 60, duration: .4 }, .55)
    .from('.factory__text', { y: 40, opacity: 0, duration: .3 }, .7);

  /* =========================================================
     КОНТАКТЫ: буквы волной
     ========================================================= */
  gsap.from('.contact__title .ch', {
    yPercent: 110, rotateX: -80, opacity: 0, transformOrigin: '50% 100%', stagger: .03, duration: 1.2, ease: 'expo.out',
    scrollTrigger: { trigger: '.contact__title', start: 'top 80%' }
  });
  gsap.from('.contact__phone, .contact__actions > *, .contact__info > div', { y: 50, opacity: 0, stagger: .08, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.contact__grid', start: 'top 85%' } });

  /* =========================================================
     ВОЛНЫ В ПОДВАЛЕ
     ========================================================= */
  const waves = $$('.footer__waves .w');
  let wavesOn = false;
  new IntersectionObserver(([e]) => { wavesOn = e.isIntersecting; }).observe($('.footer__waves'));
  gsap.ticker.add(time => {
    if (!wavesOn) return;
    waves.forEach((w, k) => {
      const amp = 18 + k * 8, base = 110 - k * 26, ph = time * (0.9 + k * .35) + k * 1.7;
      let d = 'M0 0 L0 ' + base;
      for (let x = 0; x <= 1440; x += 40) {
        const y = base + Math.sin(x / 180 + ph) * amp + Math.sin(x / 70 - ph * 1.3) * amp * .3;
        d += ` L${x} ${y.toFixed(1)}`;
      }
      w.setAttribute('d', d + ' L1440 0 Z');
    });
  });

  /* =========================================================
     МАГНИТНЫЕ КНОПКИ + жидкая заливка от точки входа
     ========================================================= */
  $$('.btn-liquid').forEach(b => {
    const set = e => { const r = b.getBoundingClientRect(); b.style.setProperty('--x', e.clientX - r.left + 'px'); b.style.setProperty('--y', e.clientY - r.top + 'px'); };
    b.addEventListener('pointerenter', set); b.addEventListener('pointerleave', set);
  });
  if (finePointer) $$('.magnetic').forEach(el => {
    const xT = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1,.4)' }), yT = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1,.4)' });
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); xT((e.clientX - r.left - r.width / 2) * .35); yT((e.clientY - r.top - r.height / 2) * .35); });
    el.addEventListener('pointerleave', () => { xT(0); yT(0); });
  });

  /* =========================================================
     КУРСОР-КАПЛЯ + ПУЗЫРЬКИ
     ========================================================= */
  if (finePointer) {
    const cur = $('.cursor'), label = $('.cursor__label');
    const cx = gsap.quickTo(cur, 'x', { duration: .25, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: .25, ease: 'power3' });
    const cv = $('.bubbles'), ctx = cv.getContext('2d');
    let W, H; const dpr = Math.min(devicePixelRatio || 1, 2);
    const size = () => { W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr; };
    size(); addEventListener('resize', size);
    const bubbles = []; let px = 0, py = 0;
    addEventListener('pointermove', e => {
      cx(e.clientX); cy(e.clientY);
      const d = Math.hypot(e.clientX - px, e.clientY - py);
      if (d > 14 && bubbles.length < 120) {
        px = e.clientX; py = e.clientY;
        bubbles.push({ x: px * dpr, y: py * dpr, r: (2 + Math.random() * 5) * dpr, vy: -(0.4 + Math.random() * 1.2) * dpr, ph: Math.random() * 6, life: 1 });
      }
    });
    addEventListener('pointerdown', e => {
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2, s = (2 + Math.random() * 3) * dpr;
        bubbles.push({ x: e.clientX * dpr, y: e.clientY * dpr, r: (1.5 + Math.random() * 3.5) * dpr, vx: Math.cos(a) * s, vy: Math.sin(a) * s, ph: 0, life: 1, splash: 1 });
      }
    });
    gsap.ticker.add(() => {
      ctx.clearRect(0, 0, W, H);
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        if (b.splash) { b.x += b.vx; b.y += b.vy; b.vx *= .92; b.vy = b.vy * .92 + .15 * dpr; b.life -= .025; }
        else { b.ph += .08; b.x += Math.sin(b.ph) * .6 * dpr; b.y += b.vy; b.life -= .012; }
        if (b.life <= 0) { bubbles.splice(i, 1); continue; }
        ctx.globalAlpha = b.life;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(127,216,255,.95)'; ctx.lineWidth = 1.2 * dpr; ctx.stroke();
        ctx.fillStyle = 'rgba(127,216,255,.12)'; ctx.fill();
        ctx.beginPath(); ctx.arc(b.x - b.r * .35, b.y - b.r * .35, b.r * .25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor]');
      cur.classList.toggle('is-big', !!t); label.textContent = t ? t.dataset.cursor : '';
    });
    document.addEventListener('pointerleave', () => gsap.to(cur, { opacity: 0 }));
    document.addEventListener('pointerenter', () => gsap.to(cur, { opacity: 1 }));
  }

  /* ---------- общий 3D-наклон ---------- */
  function tilt(els, max, sheen) {
    els.forEach(el => {
      const rx = gsap.quickTo(el, 'rotationX', { duration: .6, ease: 'power3' }), ry = gsap.quickTo(el, 'rotationY', { duration: .6, ease: 'power3' });
      gsap.set(el, { transformPerspective: 900 });
      const sh = sheen && $('.award__sheen', el);
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        rx((.5 - y) * max); ry((x - .5) * max);
        if (sh) { sh.style.setProperty('--mx', x * 100 + '%'); sh.style.setProperty('--my', y * 100 + '%'); }
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  function finishStatic() {
    $$('.wd').forEach(w => (w.style.opacity = 1));
    $$('.pill').forEach(p => (p.style.width = '2.2em'));
    $$('.line').forEach(p => { p.style.setProperty('--bg', p.dataset.bg); p.style.setProperty('--fg', p.dataset.fg); p.style.setProperty('--acc', p.dataset.accent); });
    $$('.odo').forEach(o => (o.textContent = o.dataset.to + (o.dataset.suffix || '')));
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
