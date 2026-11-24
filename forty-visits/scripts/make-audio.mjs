// 40 VISITS soundtrack + SFX synthesiser (pure Node, 16-bit WAV).
//   node scripts/make-audio.mjs
// → public/audio/music.wav (150 s) and public/audio/sfx/*.wav
// If public/audio/music.mp3 exists, the video uses it instead of music.wav.
import fs from 'node:fs';
import path from 'node:path';

const SR = 44100;
const OUT = path.resolve('public/audio');
fs.mkdirSync(path.join(OUT, 'sfx'), {recursive: true});

/* ---------------- helpers ---------------- */
let seed = 12345;
const rand = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296);
const noise = () => rand() * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);
const env = (x, pts) => {
  // piecewise-linear envelope: pts = [[t, v], ...]
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (x <= pts[i][0]) {
      const [t0, v0] = pts[i - 1];
      const [t1, v1] = pts[i];
      return v0 + (v1 - v0) * smooth((x - t0) / (t1 - t0 || 1));
    }
  }
  return pts[pts.length - 1][1];
};

const stereo = (sec) => [new Float32Array(Math.ceil(sec * SR)), new Float32Array(Math.ceil(sec * SR))];

const writeWav = (file, L, R) => {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 4, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(clamp(L[i], -1, 1) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(clamp(R[i], -1, 1) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(file, buf);
};

const normalize = (L, R, peakDb = -1) => {
  let pk = 0;
  for (let i = 0; i < L.length; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
  const g = pk > 0 ? Math.pow(10, peakDb / 20) / pk : 1;
  for (let i = 0; i < L.length; i++) {
    L[i] *= g;
    R[i] *= g;
  }
};

/** Chamberlin state-variable filter, cutoff may vary per sample */
const svf = () => {
  let lp = 0;
  let bp = 0;
  return (x, fc, q = 0.7) => {
    const f = 2 * Math.sin((Math.PI * clamp(fc, 20, SR / 6)) / SR);
    const hp = x - lp - q * bp;
    bp += f * hp;
    lp += f * bp;
    return {lp, bp, hp};
  };
};

/** Schroeder/Freeverb-style reverb, returns wet signal */
const reverb = (L, R, size = 0.84, damp = 0.3) => {
  const run = (x, off) => {
    const combs = [1557, 1617, 1491, 1422, 1277, 1356].map((d) => ({b: new Float32Array(d + off), i: 0, s: 0}));
    const aps = [556, 441, 341].map((d) => ({b: new Float32Array(d + off), i: 0}));
    const y = new Float32Array(x.length);
    for (let n = 0; n < x.length; n++) {
      let o = 0;
      for (const c of combs) {
        const v = c.b[c.i];
        c.s = v * (1 - damp) + c.s * damp;
        c.b[c.i] = x[n] * 0.015 + c.s * size;
        c.i = (c.i + 1) % c.b.length;
        o += v;
      }
      for (const a of aps) {
        const v = a.b[a.i];
        a.b[a.i] = o + v * 0.5;
        o = v - o * 0.5;
        a.i = (a.i + 1) % a.b.length;
      }
      y[n] = o;
    }
    return y;
  };
  return [run(L, 0), run(R, 23)];
};

/* ---------------- instruments ---------------- */
const pan = (p) => [Math.cos(((p + 1) * Math.PI) / 4), Math.sin(((p + 1) * Math.PI) / 4)];

function piano(B, t, midi, amp, dur = 4, p = 0) {
  const f = mtof(midi);
  const [gl, gr] = pan(p);
  const n0 = Math.floor(t * SR);
  const len = Math.floor((dur + 1.5) * SR);
  const H = [1, 0.5, 0.28, 0.16, 0.09, 0.05];
  for (let k = 0; k < len && n0 + k < B[0].length; k++) {
    const x = k / SR;
    const att = Math.min(1, x / 0.004);
    const rel = x > dur ? Math.max(0, 1 - (x - dur) / 1.5) : 1;
    let s = 0;
    for (let h = 0; h < H.length; h++) {
      const fh = f * (h + 1) * (1 + 0.0004 * (h + 1) * (h + 1));
      s += H[h] * Math.sin(2 * Math.PI * fh * x) * Math.exp(-x * (0.55 + h * 0.65));
    }
    s += 0.15 * Math.sin(2 * Math.PI * f * 0.5 * x) * Math.exp(-x * 2);
    const v = s * amp * att * rel;
    B[0][n0 + k] += v * gl;
    B[1][n0 + k] += v * gr;
  }
}

function padVoice(B, t, dur, midi, amp, {cut = 900, att = 1.5, rel = 1.8, det = 0.004, vib = 0, bright = 0}) {
  const f = mtof(midi);
  const n0 = Math.floor(t * SR);
  const len = Math.floor((dur + rel) * SR);
  const ph = [rand(), rand(), rand()];
  const dets = [1 - det, 1, 1 + det];
  const fl = svf();
  const fr = svf();
  for (let k = 0; k < len && n0 + k < B[0].length; k++) {
    const x = k / SR;
    const e = Math.min(1, x / att) * (x > dur ? Math.max(0, 1 - (x - dur) / rel) : 1);
    const vb = 1 + vib * Math.sin(2 * Math.PI * 5.2 * x);
    let sl = 0;
    let sr = 0;
    for (let v = 0; v < 3; v++) {
      const phase = (ph[v] + f * dets[v] * vb * x) % 1;
      const saw = 2 * phase - 1;
      if (v !== 2) sl += saw;
      if (v !== 0) sr += saw;
    }
    const c = cut * (1 + bright * e);
    B[0][n0 + k] += fl(sl, c).lp * amp * e;
    B[1][n0 + k] += fr(sr, c).lp * amp * e;
  }
}

function kick(B, t, amp) {
  const n0 = Math.floor(t * SR);
  let ph = 0;
  for (let k = 0; k < 0.45 * SR && n0 + k < B[0].length; k++) {
    const x = k / SR;
    const f = 45 + 75 * Math.exp(-x * 28);
    ph += f / SR;
    const v = (Math.sin(2 * Math.PI * ph) * Math.exp(-x * 7) + (x < 0.004 ? noise() * 0.4 : 0)) * amp;
    B[0][n0 + k] += v;
    B[1][n0 + k] += v;
  }
}

function hat(B, t, amp, p = 0.3) {
  const n0 = Math.floor(t * SR);
  const flt = svf();
  const [gl, gr] = pan(p);
  for (let k = 0; k < 0.08 * SR && n0 + k < B[0].length; k++) {
    const x = k / SR;
    const v = flt(noise(), 7000, 0.5).hp * Math.exp(-x * 55) * amp;
    B[0][n0 + k] += v * gl;
    B[1][n0 + k] += v * gr;
  }
}

function bass(B, t, midi, dur, amp) {
  const f = mtof(midi);
  const n0 = Math.floor(t * SR);
  const flt = svf();
  for (let k = 0; k < (dur + 0.05) * SR && n0 + k < B[0].length; k++) {
    const x = k / SR;
    const e = Math.min(1, x / 0.008) * Math.exp(-x * 2.2) * (x > dur ? Math.max(0, 1 - (x - dur) / 0.05) : 1);
    const saw = 2 * ((f * x) % 1) - 1;
    const v = (Math.sin(2 * Math.PI * f * x) * 0.8 + flt(saw, 380).lp * 0.6) * e * amp;
    B[0][n0 + k] += v;
    B[1][n0 + k] += v;
  }
}

function crash(B, t, amp, dur = 3.5) {
  const n0 = Math.floor(t * SR);
  const flt = svf();
  for (let k = 0; k < dur * SR && n0 + k < B[0].length; k++) {
    const x = k / SR;
    const s = flt(noise(), 6000, 0.6).hp * Math.exp(-x * 1.6) * amp;
    B[0][n0 + k] += s * (0.8 + 0.2 * noise());
    B[1][n0 + k] += s * (0.8 + 0.2 * noise());
  }
}

const sfx = (name, sec, fn, {verb = 0, peak = -3} = {}) => {
  const [L, R] = stereo(sec);
  fn(L, R);
  if (verb > 0) {
    const [wl, wr] = reverb(L, R, 0.82, 0.3);
    for (let i = 0; i < L.length; i++) {
      L[i] += wl[i] * verb;
      R[i] += wr[i] * verb;
    }
  }
  const fadeN = Math.floor(0.01 * SR);
  for (let i = 0; i < fadeN; i++) {
    L[L.length - 1 - i] *= i / fadeN;
    R[R.length - 1 - i] *= i / fadeN;
  }
  normalize(L, R, peak);
  writeWav(path.join(OUT, 'sfx', `${name}.wav`), L, R);
};
const each = (L, R, sec, f) => {
  for (let i = 0; i < Math.floor(sec * SR) && i < L.length; i++) {
    const [a, b] = f(i / SR);
    L[i] += a;
    R[i] += b ?? a;
  }
};
const at = (t0, fn) => (x) => (x < t0 ? [0] : fn(x - t0));
const bp = (fc, q = 0.4) => {
  const f = svf();
  return (x) => f(x, fc, q).bp;
};


/** Karplus–Strong plucked string (guitar) */
function pluck(B, t, midi, amp, dur = 1.6, p = 0, damp = 0.996) {
  const f = mtof(midi);
  const N = Math.max(2, Math.round(SR / f));
  const buf = new Float32Array(N);
  for (let i = 0; i < N; i++) buf[i] = noise();
  const [gl, gr] = pan(p);
  const n0 = Math.floor(t * SR);
  let idx = 0;
  for (let k = 0; k < dur * SR && n0 + k < B[0].length; k++) {
    const nxt = (idx + 1) % N;
    const v = buf[idx];
    buf[idx] = (buf[idx] + buf[nxt]) * 0.5 * damp;
    idx = nxt;
    const e = Math.min(1, k / 40) * (k > (dur - 0.1) * SR ? Math.max(0, 1 - (k - (dur - 0.1) * SR) / (0.1 * SR)) : 1);
    B[0][n0 + k] += v * amp * e * gl;
    B[1][n0 + k] += v * amp * e * gr;
  }
}
function shaker(B, t, amp, p = 0.3) {
  const n0 = Math.floor(t * SR);
  const flt = svf();
  const [gl, gr] = pan(p);
  for (let k = 0; k < 0.07 * SR && n0 + k < B[0].length; k++) {
    const x = k / SR;
    const v = flt(noise(), 6500, 0.5).hp * Math.exp(-x * 60) * amp * Math.min(1, x / 0.004);
    B[0][n0 + k] += v * gl;
    B[1][n0 + k] += v * gr;
  }
}

/* ---------------- 40 VISITS music ---------------- */
const DUR = 300;
// Am – F – C – G
const CH = [
  {root: 45, tones: [57, 60, 64]},
  {root: 41, tones: [57, 60, 65]},
  {root: 48, tones: [55, 60, 64]},
  {root: 43, tones: [55, 59, 62]},
];
const SIL = [[40, 42.4], [210, 220]];
const silent = (t) => SIL.some(([a, b]) => t >= a && t < b);

function music() {
  const dry = stereo(DUR);
  const send = stereo(DUR);

  // ACT 0 (4–18): a barely-there cold pad; the title (18–20) is dry
  [57, 64].forEach((m) => padVoice(send, 4, 13.5, m - 12, 0.01, {cut: 500, att: 3, rel: 2}));

  // ACT 1 (20–104): lonely piano Am–F–C–G, slow (3.6 s per chord), sparse melody notes
  for (let i = 0, t = 20.3; t < 103; i++, t += 3.6) {
    if (silent(t) || silent(t + 1.5)) continue;
    const c = CH[i % 4];
    c.tones.forEach((m, k) => piano(send, t + k * 0.07, m, 0.08, 3.4, -0.3 + k * 0.3));
    piano(send, t, c.root, 0.05, 3.6, 0);
    if (i % 2 === 1) piano(send, t + 1.8, c.tones[(i >> 1) % 3] + 12, 0.04, 1.8, 0.35);
  }

  // ACT 2 (104–170): warm acoustic guitar during the calls; tempo grows 84 → 112 BPM in the montage
  {
    let t = 104.2;
    let bar = 0;
    while (t < 169.5) {
      const bpm = env(t, [[104, 84], [130, 86], [146, 96], [160, 112], [170, 112]]);
      const beat = 60 / bpm;
      const rainy = t >= 130 && t < 138; // hook 2:10 — thin, minor
      const c = rainy ? CH[0] : CH[bar % 4];
      const arp = [c.root + 12, c.tones[0], c.tones[1], c.tones[2], c.tones[1], c.tones[0], c.tones[2], c.tones[1]];
      for (let e = 0; e < 8; e++) {
        const te = t + e * (beat / 2);
        if (te >= 169.5) break;
        if (rainy && e % 2) continue;
        pluck(send, te, arp[e], rainy ? 0.09 : 0.15, 1.4, -0.2 + (e % 3) * 0.2);
      }
      if (!rainy) {
        if (t > 146) for (let b = 0; b < 4; b++) shaker(dry, t + b * beat + beat / 2, 0.06);
        if (t > 156) for (let b = 0; b < 4; b += 2) kick(dry, t + b * beat, 0.18);
        bass(dry, t, c.root - 12, beat * 4 - 0.1, 0.08);
      }
      t += beat * 4;
      bar++;
    }
  }

  // ACT 3
  // 170–180 hook 2:50: only a low drone under the heartbeat
  padVoice(send, 170, 10, 33, 0.03, {cut: 300, att: 2, rel: 1.5});
  // 180–200: sparse piano (Arthur's photo → decision), rising at 192
  for (let i = 0, t = 180.3; t < 199; i++, t += 3.2) {
    const c = CH[i % 4];
    const I = t < 192 ? 0.7 : 1;
    c.tones.forEach((m, k) => piano(send, t + k * 0.08, m, 0.07 * I, 3, -0.3 + k * 0.3));
    piano(send, t, c.root, 0.045 * I, 3.2, 0);
  }
  // 200–210: train, golden — guitar + soft pad
  for (let i = 0, t = 200; t < 209.6; i++, t += 2.4) {
    const c = CH[(i + 2) % 4];
    [c.root + 12, c.tones[0], c.tones[1], c.tones[2], c.tones[1], c.tones[2]].forEach((m, e) => pluck(send, t + e * 0.4, m, 0.12, 1.6, -0.3 + (e % 3) * 0.3));
    c.tones.forEach((m) => padVoice(send, t, 2.4, m - 12, 0.012, {cut: 900, att: 0.8, rel: 0.8}));
  }
  // 210–220: TOTAL silence (only tick & wind as SFX)
  // 220–230: warm strings peak (door → hug)
  for (let i = 0, t = 220.2; t < 230; i++, t += 2.4) {
    const c = CH[(i + 2) % 4];
    const I = env(t, [[220, 0.5], [224, 1], [230, 1]]);
    c.tones.forEach((m) => padVoice(send, t, 2.5, m, 0.032 * I, {cut: 1800, att: 0.8, rel: 1.2, det: 0.003, vib: 0.003, bright: 0.3}));
    c.tones.forEach((m) => padVoice(send, t, 2.5, m - 12, 0.018 * I, {cut: 900, att: 0.8, rel: 1.2}));
    padVoice(send, t, 2.5, c.tones[2] + 12, 0.014 * I, {cut: 2400, att: 0.6, rel: 1, vib: 0.004});
    if (t > 223) piano(send, t, c.tones[2] + 12, 0.05, 2.4, 0.3);
  }
  // 230–254: dinner, porch, childhood room — gentle guitar + piano
  for (let i = 0, t = 230.2; t < 253.5; i++, t += 2.8) {
    const c = CH[(i + 2) % 4];
    [c.root + 12, c.tones[0], c.tones[1], c.tones[2]].forEach((m, e) => pluck(send, t + e * 0.35, m, 0.11, 1.8, -0.2 + e * 0.15));
    if (i % 2 === 0) piano(send, t + 1.4, c.tones[2] + 12, 0.04, 2, 0.3);
    c.tones.forEach((m) => padVoice(send, t, 2.8, m - 12, 0.01, {cut: 900, att: 1, rel: 1}));
  }

  // ACT 4 (254–288): bright build — piano + strings + light percussion, peak at the hill (272–288)
  {
    const beat = 0.6;
    for (let bar = 0; ; bar++) {
      const t = 254 + bar * 2.4;
      if (t >= 287.6) break;
      const c = CH[(bar + 2) % 4];
      const I = env(t, [[254, 0.55], [264, 0.75], [272, 1], [280, 1], [287, 0.75]]);
      c.tones.forEach((m, k) => piano(send, t + k * 0.02, m + 12, 0.08 * I, 2.4, -0.3 + k * 0.3));
      for (let e = 0; e < 8; e++) piano(send, t + e * 0.3, [c.tones[0] + 12, c.tones[2], c.tones[1] + 12, c.tones[2] + 12][e % 4], 0.032 * I, 0.5, 0.4 - (e % 4) * 0.2);
      c.tones.forEach((m) => padVoice(send, t, 2.4, m, 0.03 * I, {cut: 2000, att: 0.4, rel: 0.8, det: 0.003, vib: 0.002}));
      bass(dry, t, c.root - 12, 2.3, 0.1 * I);
      for (let b = 0; b < 4; b++) {
        if (t >= 262) shaker(dry, t + b * beat + beat / 2, 0.07 * I);
        if (t >= 268 && t < 280 && b % 2 === 0) kick(dry, t + b * beat, 0.28 * I);
        if (t >= 272 && t < 280) pluck(dry, t + b * beat, c.tones[2] + 24, 0.05, 0.3, 0.5, 0.98);
      }
    }
    // quiet final chord as he answers (S35, 288)
    [45, 52, 57, 60, 64, 71].forEach((m, k) => piano(send, 288 + k * 0.06, m, 0.075, 7, -0.4 + k * 0.16));
  }

  const [wl, wr] = reverb(send[0], send[1], 0.86, 0.35);
  const L = new Float32Array(dry[0].length);
  const R = new Float32Array(dry[0].length);
  for (let i = 0; i < L.length; i++) {
    const t = i / SR;
    const g = silent(t) ? 0 : 1;
    const fade = t > 293 ? Math.max(0, (297 - t) / 4) : 1;
    L[i] = Math.tanh((dry[0][i] + send[0][i] * 0.8 + wl[i] * 0.9) * 1.2) * g * fade;
    R[i] = Math.tanh((dry[1][i] + send[1][i] * 0.8 + wr[i] * 0.9) * 1.2) * g * fade;
  }
  for (const edge of SIL.flat()) {
    const n = Math.floor(edge * SR);
    for (let k = -200; k < 200; k++) {
      const gg = Math.abs(k) / 200;
      L[n + k] *= gg;
      R[n + k] *= gg;
    }
  }
  normalize(L, R, -1.5);
  writeWav(path.join(OUT, 'music.wav'), L, R);
}

/* ---------------- SFX ---------------- */
function voiceBabble(L, R, sec, base, pattern, amp = 0.5) {
  // formant-filtered glottal buzz shaped into syllables: a phone-quality "voice" with no words
  const f1 = bp(700, 0.25);
  const f2 = bp(1500, 0.3);
  const hp = svf();
  let ph = 0;
  each(L, R, sec, (x) => {
    const syl = pattern(x);
    ph += (base * (1 + 0.08 * Math.sin(x * 3.1) + 0.04 * Math.sin(x * 11))) / SR;
    const glot = (ph % 1) * 2 - 1;
    const v = (f1(glot) * 0.9 + f2(glot) * 0.5 + noise() * 0.03) * syl;
    return [hp(v, 300, 0.7).hp * amp];
  });
}
function makeSfx() {
  const vib = (x) => Math.sign(Math.sin(2 * Math.PI * 160 * x)) * 0.25 + Math.sin(2 * Math.PI * 80 * x) * 0.5;
  sfx('buzz', 2.4, (L, R) => each(L, R, 2.4, (x) => [vib(x) * ((x % 0.6) < 0.36 ? 1 : 0) * Math.min(1, (x % 0.6) / 0.01)]), {peak: -6});
  sfx('decline', 0.35, (L, R) => each(L, R, 0.35, (x) => [noise() * Math.exp(-x * 300) * 0.5 + Math.sin(2 * Math.PI * (700 - x * 900) * x) * Math.exp(-x * 25) * 0.5]), {peak: -4});
  sfx('ping', 0.6, (L, R) => each(L, R, 0.6, (x) => [Math.sin(2 * Math.PI * 1760 * x) * Math.exp(-x * 9) * 0.5 + Math.sin(2 * Math.PI * 2637 * x) * Math.exp(-x * 12) * 0.25]), {verb: 0.2, peak: -6});
  sfx('key', 0.12, (L, R) => each(L, R, 0.12, (x) => [noise() * Math.exp(-x * 400) * 0.6 + Math.sin(2 * Math.PI * 2200 * x) * Math.exp(-x * 200) * 0.2]), {peak: -10});
  sfx('thud', 1.2, (L, R) => each(L, R, 1.2, (x) => [Math.sin(2 * Math.PI * (55 + 60 * Math.exp(-x * 30)) * x) * Math.exp(-x * 5) * 0.9 + noise() * Math.exp(-x * 80) * 0.3]), {verb: 0.5, peak: -2});
  sfx('fridgehum', 2.2, (L, R) => each(L, R, 2.2, (x) => [(Math.sin(2 * Math.PI * 50 * x) * 0.4 + Math.sin(2 * Math.PI * 100 * x) * 0.2 + Math.sin(2 * Math.PI * 150 * x) * 0.08) * env(x, [[0, 0], [0.3, 1], [1.9, 1], [2.2, 0]])]), {peak: -14});
  sfx('clink', 1.6, (L, R) => each(L, R, 1.6, (x) => [
    (Math.sin(2 * Math.PI * 3150 * x) * 0.5 + Math.sin(2 * Math.PI * 4720 * x) * 0.3 + Math.sin(2 * Math.PI * 6300 * x) * 0.15) * Math.exp(-x * 6) + noise() * Math.exp(-x * 500) * 0.4 +
    (x > 0.11 ? Math.sin(2 * Math.PI * 3300 * x) * Math.exp(-(x - 0.11) * 12) * 0.2 : 0),
  ]), {verb: 0.5, peak: -2});
  sfx('oldring', 1.0, (L, R) => each(L, R, 1.0, (x) => {
    const bell = (Math.sin(2 * Math.PI * 1100 * x) + Math.sin(2 * Math.PI * 1320 * x) * 0.6) * (0.5 + 0.5 * Math.sign(Math.sin(2 * Math.PI * 22 * x)));
    return [bell * 0.3 * (x < 0.9 ? 1 : 0)];
  }), {verb: 0.3, peak: -3});
  sfx('city', 8, (L, R) => {
    const fl = bp(260, 0.2);
    const fr = bp(300, 0.2);
    each(L, R, 8, (x) => [fl(noise()) * 0.6 + Math.sin(2 * Math.PI * 70 * x) * 0.03, fr(noise()) * 0.6]);
    for (let k = 0; k < 3; k++) {
      const t0 = 0.5 + k * 2.6;
      const fc = bp(900, 0.3);
      each(L, R, 8, at(t0, (y) => [y < 2 ? fc(noise()) * Math.sin((y / 2) * Math.PI) * 0.5 : 0]));
    }
  }, {verb: 0.3, peak: -10});
  sfx('pigeons', 4, (L, R) => {
    for (let k = 0; k < 6; k++) {
      const t0 = rand() * 3.2;
      const f0 = 380 + rand() * 80;
      let ph = 0;
      each(L, R, 4, at(t0, (y) => {
        ph += (f0 * (1 + 0.15 * Math.sin(y * 30))) / SR;
        const e = y < 0.6 ? Math.sin((y / 0.6) * Math.PI) * (0.6 + 0.4 * Math.sin(y * 25)) : 0;
        return [Math.sin(2 * Math.PI * ph) * e * 0.25];
      }));
    }
  }, {verb: 0.3, peak: -8});
  sfx('flap', 1.4, (L, R) => {
    const f = bp(800, 0.3);
    each(L, R, 1.4, (x) => [f(noise()) * Math.max(0, Math.sin(x * 2 * Math.PI * 9)) * Math.exp(-x * 1.6) * 1.2]);
  }, {peak: -4});
  sfx('scroll', 1.2, (L, R) => [0, 0.15, 0.3, 0.5, 0.7].forEach((t0) => each(L, R, 1.2, at(t0, (y) => [noise() * Math.exp(-y * 200) * 0.3]))), {peak: -10});
  sfx('marker', 1.0, (L, R) => {
    const f = bp(3000, 0.5);
    each(L, R, 1.0, (x) => [f(noise()) * (0.4 + 0.6 * Math.abs(Math.sin(x * 30))) * env(x, [[0, 0], [0.05, 1], [0.6, 0.8], [0.75, 0]])]);
    each(L, R, 1.0, (x) => [x < 0.08 ? Math.sin(2 * Math.PI * 140 * x) * Math.exp(-x * 40) * 0.6 : 0]);
  }, {peak: -2});
  sfx('tick', 0.15, (L, R) => each(L, R, 0.15, (x) => [Math.sin(2 * Math.PI * 1800 * x) * Math.exp(-x * 90) * 0.6 + noise() * Math.exp(-x * 400) * 0.3]), {peak: -6});
  sfx('clock', 4, (L, R) => [0, 1, 2, 3].forEach((t0, k) => each(L, R, 4, at(t0 + 0.1, (y) => [noise() * Math.exp(-y * 300) * 0.5 + Math.sin(2 * Math.PI * (k % 2 ? 2200 : 1800) * y) * Math.exp(-y * 80) * 0.4]))), {verb: 0.3, peak: -6});
  sfx('office', 2.4, (L, R) => {
    const f = bp(180, 0.3);
    each(L, R, 2.4, (x) => [f(noise()) * 0.4 + Math.sin(2 * Math.PI * 60 * x) * 0.05]);
    for (let k = 0; k < 8; k++) each(L, R, 2.4, at(rand() * 2.2, (y) => [noise() * Math.exp(-y * 400) * 0.15]));
  }, {verb: 0.3, peak: -12});
  sfx('tap', 0.3, (L, R) => each(L, R, 0.3, (x) => [noise() * Math.exp(-x * 250) * 0.6 + Math.sin(2 * Math.PI * 900 * x) * Math.exp(-x * 90) * 0.4]), {peak: -4});
  sfx('momvoice', 3.6, (L, R) => {
    const syl = (x) => {
      // "Hi son… nothing important…   I just wanted to hear you."
      const words = [[0.2, 0.45], [0.55, 0.85], [1.2, 1.45], [1.5, 1.75], [1.8, 2.0], [2.5, 2.65], [2.7, 2.9], [2.95, 3.15], [3.2, 3.45]];
      for (const [a, b] of words) if (x >= a && x < b) return Math.sin(((x - a) / (b - a)) * Math.PI) ** 0.6;
      return 0;
    };
    voiceBabble(L, R, 3.6, 215, syl, 0.6);
  }, {verb: 0.15, peak: -6});
  sfx('alarm', 1.8, (L, R) => each(L, R, 1.8, (x) => [((x % 0.6) < 0.3 ? 1 : 0) * Math.sin(2 * Math.PI * (x % 0.6 < 0.15 ? 1318 : 1568) * x) * 0.3]), {verb: 0.2, peak: -6});
  sfx('ringback', 1.6, (L, R) => each(L, R, 1.6, (x) => [(Math.sin(2 * Math.PI * 440 * x) + Math.sin(2 * Math.PI * 480 * x)) * 0.25 * (x < 1.2 ? Math.min(1, x / 0.01, (1.2 - x) / 0.01) : 0)]), {verb: 0.1, peak: -5});
  sfx('pencil', 2.4, (L, R) => {
    const f = bp(4200, 0.5);
    each(L, R, 2.4, (x) => [f(noise()) * (0.3 + 0.7 * Math.abs(Math.sin(x * 22))) * env(x, [[0, 0], [0.05, 1], [2.2, 0.8], [2.4, 0]])]);
  }, {peak: -10});
  sfx('laugh', 2.4, (L, R) => {
    [0, 1].forEach((v) => {
      const base = 170 + v * 60;
      each(L, R, 2.4, at(v * 0.1, (y) => {
        const s = (Math.sin(2 * Math.PI * 4.2 * y + v) > 0.2 ? 1 : 0) * env(y, [[0, 0], [0.2, 1], [1.8, 0.5], [2.3, 0]]);
        return [(Math.sin(2 * Math.PI * base * y) + 0.4 * Math.sin(2 * Math.PI * base * 2 * y) + noise() * 0.15) * s * 0.18];
      }));
    });
  }, {verb: 0.3, peak: -6});
  sfx('guitar', 2.6, (L, R) => {
    [57, 60, 64, 69].forEach((m, k) => pluck([L, R], k * 0.03, m, 0.3, 2.5, -0.3 + k * 0.2));
    [64, 69].forEach((m, k) => pluck([L, R], 1.2 + k * 0.3, m, 0.2, 1.3, 0.3));
  }, {verb: 0.4, peak: -6});
  sfx('rain', 8, (L, R) => {
    const fl = svf();
    const fr = svf();
    each(L, R, 8, (x) => [fl(noise(), 4000, 0.6).hp * 0.5 * Math.min(1, x / 0.6), fr(noise(), 4200, 0.6).hp * 0.5 * Math.min(1, x / 0.6)]);
    for (let k = 0; k < 150; k++) each(L, R, 8, at(rand() * 7.9, (y) => [noise() * Math.exp(-y * 400) * 0.4]));
  }, {peak: -6});
  sfx('heartbeat', 3.4, (L, R) => {
    for (let b = 0; b < 4; b++) [0, 0.24].forEach((o, k) => each(L, R, 3.4, at(b * 0.85 + o, (y) => [y < 0.4 ? Math.sin(2 * Math.PI * (50 * y + (30 * (1 - Math.exp(-y * 40))) / 40)) * Math.exp(-y * 18) * (k ? 0.7 : 1) : 0])));
  }, {peak: -2});
  sfx('whoosh', 0.8, (L, R) => {
    const f = svf();
    each(L, R, 0.8, (x) => [f(noise(), 600 + x * 4000, 0.5).bp * Math.sin((x / 0.8) * Math.PI) * 0.8]);
  }, {peak: -6});
  sfx('train', 4, (L, R) => {
    const f = bp(140, 0.3);
    each(L, R, 4, (x) => [f(noise()) * 0.7 + noise() * 0.03]);
    for (let k = 0; k < 4; k++) [0, 0.18].forEach((o) => each(L, R, 4, at(k * 1.0 + 0.3 + o, (y) => [y < 0.12 ? (noise() * 0.4 + Math.sin(2 * Math.PI * 90 * y) * 0.6) * Math.exp(-y * 40) : 0])));
  }, {verb: 0.2, peak: -6});
  sfx('wind', 4, (L, R) => {
    const fl = bp(500, 0.3);
    const fr = bp(560, 0.3);
    each(L, R, 4, (x) => {
      const e = env(x, [[0, 0], [1, 0.8], [3, 0.8], [4, 0]]) * (0.6 + 0.4 * Math.sin(x * 2.3));
      return [fl(noise()) * e, fr(noise()) * e];
    });
  }, {peak: -10});
  sfx('creak', 1.4, (L, R) => {
    let ph = 0;
    each(L, R, 1.4, (x) => {
      ph += (110 + 60 * Math.sin(x * 4) + 20 * noise()) / SR;
      const pulse = (ph % 1) < 0.08 ? 1 : 0;
      return [pulse * 0.5 * env(x, [[0, 0], [0.1, 1], [1.2, 0.7], [1.4, 0]])];
    });
  }, {verb: 0.4, peak: -6});
  sfx('knock', 0.5, (L, R) => each(L, R, 0.5, (x) => [Math.sin(2 * Math.PI * (160 + 80 * Math.exp(-x * 60)) * x) * Math.exp(-x * 30) * 0.8 + noise() * Math.exp(-x * 300) * 0.4]), {verb: 0.4, peak: -2});
  sfx('dooropen', 1.2, (L, R) => {
    let ph = 0;
    each(L, R, 1.2, (x) => {
      ph += (240 + 120 * Math.sin(x * 6)) / SR;
      return [Math.sin(2 * Math.PI * ph) * (0.5 + 0.5 * Math.sin(x * 70)) * 0.12 * env(x, [[0, 0], [0.2, 1], [1, 0.5], [1.2, 0]]) + (x < 0.03 ? noise() * 0.4 : 0)];
    });
  }, {verb: 0.3, peak: -8});
  sfx('softthud', 0.5, (L, R) => {
    const f = bp(300, 0.4);
    each(L, R, 0.5, (x) => [f(noise()) * Math.exp(-x * 25) * 0.8]);
  }, {peak: -8});
  sfx('cutlery', 1.6, (L, R) => {
    for (let k = 0; k < 6; k++) {
      const t0 = rand() * 1.3;
      const fr = 2500 + rand() * 2500;
      each(L, R, 1.6, at(t0, (y) => [Math.sin(2 * Math.PI * fr * y) * Math.exp(-y * 40) * 0.25 + noise() * Math.exp(-y * 500) * 0.2]));
    }
  }, {verb: 0.3, peak: -8});
  sfx('crickets', 3, (L, R) => {
    for (let c = 0; c < 2; c++) {
      const p = c ? 0.6 : -0.6;
      const [gl, gr] = pan(p);
      each(L, R, 3, (x) => {
        const chirp = ((x + c * 0.37) % 0.9) < 0.25 ? (Math.sin(2 * Math.PI * 30 * x) > 0 ? 1 : 0) : 0;
        const v = Math.sin(2 * Math.PI * (4400 + c * 300) * x) * chirp * 0.15;
        return [v * gl, v * gr];
      });
    }
  }, {verb: 0.4, peak: -12});
  sfx('birds', 5, (L, R) => {
    for (let k = 0; k < 12; k++) {
      const t0 = rand() * 4.5;
      const f0 = 2500 + rand() * 2000;
      const p = rand() * 2 - 1;
      each(L, R, 5, at(t0, (y) => {
        const v = y < 0.18 ? Math.sin(2 * Math.PI * (f0 + 1500 * Math.sin(y * 60)) * y) * Math.sin((y / 0.18) * Math.PI) * 0.2 : 0;
        return [v * (1 - p * 0.5), v * (1 + p * 0.5)];
      }));
    }
  }, {verb: 0.4, peak: -8});
  sfx('ringtone', 1.2, (L, R) => each(L, R, 1.2, (x) => {
    const n = Math.floor(x / 0.12) % 8;
    const f = [1318, 1568, 1976, 1568, 1318, 1568, 1976, 2637][n];
    return [Math.sin(2 * Math.PI * f * x) * 0.35 * Math.exp(-((x % 0.12) * 14))];
  }), {verb: 0.2, peak: -3});
}

const t0 = Date.now();
fs.mkdirSync(path.join(OUT, 'sfx'), {recursive: true});
makeSfx();
music();
console.log(`audio written to ${OUT} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
