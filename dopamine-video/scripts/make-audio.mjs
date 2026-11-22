// DOPAMINE soundtrack + SFX synthesiser (pure Node, 16-bit WAV).
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

/* ---------------- music: DOPAMINE ---------------- */
const DUR = 270;
const F = (fr) => fr / 30;
const CH = [
  {root: 45, tones: [57, 60, 64]}, // Am
  {root: 41, tones: [57, 60, 65]}, // F
  {root: 48, tones: [55, 60, 64]}, // C
  {root: 43, tones: [55, 59, 62]}, // G
];
const BEAT = 0.6;
const BAR = 2.4;
const T_TITLE = F(390); // 13.0
const T_AMB = F(450); // 15.0 — grid of act 1/2
const T_SIL0 = F(1170); // 39.0 one bar of silence
const T_BLACK = F(3540); // 118.0
const T_PIANO = F(3900); // 130.0
const T_DISS = F(5190); // 173.0
const T_RISE = F(5430); // 181.0
const T_DROP = F(5622); // 187.4
const T_SNAP = F(6774); // 225.8
const T_FLASH = F(6930); // 231.0
const T_FINAL = F(7800); // 260.0

function bell(B, t, f, amp, p = 0) {
  const [gl, gr] = pan(p);
  const n0 = Math.floor(t * SR);
  for (let k = 0; k < 1.2 * SR && n0 + k < B[0].length; k++) {
    const x = k / SR;
    const v = (Math.sin(2 * Math.PI * f * x) + 0.4 * Math.sin(2 * Math.PI * f * 2.76 * x) * Math.exp(-x * 6)) * Math.exp(-x * 3.5) * amp * Math.min(1, x / 0.003);
    B[0][n0 + k] += v * gl;
    B[1][n0 + k] += v * gr;
  }
}

function drone(B, t0, dur, amp, notes, cut = 300) {
  notes.forEach((m) => padVoice(B, t0, dur, m, amp, {cut, att: 0.8, rel: 0.6, det: 0.008}));
}

function music() {
  const dry = stereo(DUR);
  const send = stereo(DUR);

  // ACT 0 (0–15 s): heavy drone, cut at the freeze, boom on the title
  drone(dry, 0, F(150) - 0.05, 0.09, [33, 40, 45, 46], 260);
  for (let t = 0; t < F(150); t += BEAT) kick(dry, t, 0.45);
  kick(dry, T_TITLE, 1.0);
  bass(dry, T_TITLE, 33, 1.8, 0.3);
  crash(dry, T_TITLE, 0.18, 2);

  // ACT 1–2 (15–118 s): dark pulsing ambient, dings more and more often, one silent bar at 39 s
  const inSil = (t) => t >= T_SIL0 - 0.02 && t < T_SIL0 + BAR - 0.02;
  for (let bar = 0; ; bar++) {
    const t = T_AMB + bar * BAR;
    if (t >= T_BLACK - 0.01) break;
    if (inSil(t)) continue;
    const c = CH[Math.floor(bar / 2) % 4];
    const I = env(t, [[15, 0.5], [60, 0.7], [75, 0.85], [100, 0.8], [117, 1]]);
    const len = Math.min(BAR, T_BLACK - t);
    c.tones.forEach((m) => padVoice(send, t, len, m - 12, 0.02 * I, {cut: 600, att: 0.6, rel: 0.5, det: 0.006}));
    for (let e = 0; e < 8; e++) {
      const te = t + e * (BEAT / 2);
      if (te >= T_BLACK - 0.05 || inSil(te)) continue;
      bass(dry, te, c.root - 12, BEAT / 2 - 0.05, 0.11 * I * (e % 2 ? 0.6 : 1));
    }
    for (let b = 0; b < 4; b++) {
      const tb = t + b * BEAT;
      if (tb >= T_BLACK - 0.05 || inSil(tb)) continue;
      if (b % 2 === 0) kick(dry, tb, 0.3 * I);
      if (t > F(1860) && t < F(2250)) hat(dry, tb + BEAT / 2, 0.05);
    }
  }
  // notification dings baked into the ambient, getting denser
  for (let t = T_AMB + 2; t < T_BLACK - 1; ) {
    if (!inSil(t)) bell(send, t, [1318, 1568, 1760, 2093][Math.floor(rand() * 4)], 0.05, rand() * 2 - 1);
    t += env(t, [[15, 6], [60, 3], [100, 1.2], [117, 0.5]]) * (0.6 + rand() * 0.8);
  }

  // 118–130: silence (scene 17 has only ticking SFX)

  // ACT 3a (130–173): lonely piano, slow
  for (let i = 0, t = T_PIANO + 0.2; t < T_DISS - 0.5; i++, t += 4.8) {
    const c = CH[i % 4];
    c.tones.forEach((m, k) => piano(send, t + k * 0.06, m, 0.1, 4.2, -0.3 + k * 0.3));
    piano(send, t, c.root, 0.07, 4.5, 0);
    [0, 1, 2].forEach((k) => piano(send, t + 1.8 + k * 0.9, c.tones[(k + 1) % 3] + 12, 0.04, 1.4, 0.4 - k * 0.3));
  }
  // 3:09 dissonance: cluster + detuned drone
  [57, 58, 63, 64, 70].forEach((m, k) => piano(send, T_DISS + k * 0.01, m, 0.12, 2.5, -0.5 + k * 0.25));
  drone(dry, T_DISS, T_RISE - T_DISS, 0.06, [33, 34, 40], 400);
  // riser into the drop
  {
    const n0 = Math.floor(T_RISE * SR);
    const flt = svf();
    for (let k = 0; k < (T_DROP - T_RISE) * SR; k++) {
      const x = k / SR / (T_DROP - T_RISE);
      const v = flt(noise(), 300 + 6000 * x * x, 0.4).bp * x * x * 0.22;
      dry[0][n0 + k] += v;
      dry[1][n0 + k] += v;
    }
    for (let i = 0; i < 16; i++) hat(dry, T_DROP - 2.4 + i * 0.15, 0.03 + i * 0.006, i % 2 ? -0.3 : 0.3);
  }

  // ACT 3b–4 (187.4–260): epic, peak on the chain snap, slow-mo swell, warm finish
  const I = (t) => env(t, [[T_DROP, 0.7], [205, 0.8], [215, 0.9], [T_SNAP - 0.01, 1]]);
  for (let bar = 0; ; bar++) {
    const t = T_DROP + bar * BAR;
    if (t >= T_FINAL - 0.01) break;
    const c = CH[bar % 4];
    const slowmo = t >= T_SNAP - 0.01 && t < T_FLASH + 1;
    const after = t >= T_FLASH + 1;
    const amp = slowmo ? 0.85 : after ? env(t, [[232, 0.75], [258, 0.6]]) : I(t);
    c.tones.forEach((m, k) => piano(send, t + k * 0.02, m, 0.11 * amp, BAR, -0.3 + k * 0.3));
    for (let e = 0; e < 8; e++) piano(send, t + e * (BEAT / 2), [c.tones[0] + 12, c.tones[2], c.tones[1] + 12, c.tones[2] + 12][e % 4], 0.04 * amp, 0.6, 0.5 - (e % 4) * 0.25);
    c.tones.forEach((m) => padVoice(send, t, BAR, m, (slowmo ? 0.05 : 0.035) * amp, {cut: slowmo ? 2400 : 1500, att: 0.3, rel: 1, det: 0.003, vib: 0.002, bright: 0.4}));
    c.tones.forEach((m) => padVoice(send, t, BAR, m - 12, 0.02 * amp, {cut: 700, att: 0.4, rel: 1}));
    if (!slowmo) {
      for (let b = 0; b < 4; b++) {
        const tb = t + b * BEAT;
        if (after && b % 2 === 1) continue;
        kick(dry, tb, (after ? 0.4 : 0.6) * amp);
        for (let e = 0; e < 2; e++) bass(dry, tb + e * (BEAT / 2), c.root - 12, BEAT / 2 - 0.03, 0.16 * amp);
        if (!after) hat(dry, tb + BEAT / 2, 0.08 * amp);
      }
      if (t >= T_SNAP - BAR * 2 - 0.01 && t < T_SNAP) for (let s = 0; s < 16; s++) hat(dry, t + s * (BEAT / 4), 0.05 + 0.05 * (s / 16), s % 2 ? -0.3 : 0.3);
    } else {
      bass(dry, t, c.root - 12, BAR, 0.12);
    }
  }
  kick(dry, T_SNAP, 1.3);
  crash(dry, T_SNAP, 0.4, 4);
  bass(dry, T_SNAP, 33, 3, 0.3);
  crash(dry, T_FLASH, 0.2, 3);
  // final chord (C major) 260 s, ringing out
  [48, 55, 60, 64, 67].forEach((m, k) => piano(send, T_FINAL + k * 0.05, m, 0.11, 5, -0.4 + k * 0.2));
  [55, 60, 64].forEach((m) => padVoice(send, T_FINAL, 5.5, m, 0.03, {cut: 1200, att: 1, rel: 2}));

  const [wl, wr] = reverb(send[0], send[1], 0.86, 0.35);
  const L = new Float32Array(dry[0].length);
  const R = new Float32Array(dry[0].length);
  for (let i = 0; i < L.length; i++) {
    const t = i / SR;
    // hard silences required by the brief (reverb tails are cut too)
    const silent = (t >= T_SIL0 && t < T_SIL0 + BAR) || (t >= T_BLACK && t < T_PIANO);
    const g = silent ? 0 : 1;
    const fade = t > 266 ? Math.max(0, (268 - t) / 2) : 1;
    L[i] = Math.tanh((dry[0][i] + send[0][i] * 0.8 + wl[i] * 0.9) * 1.2) * g * fade;
    R[i] = Math.tanh((dry[1][i] + send[1][i] * 0.8 + wr[i] * 0.9) * 1.2) * g * fade;
  }
  // 3 ms ramps at the silence edges against clicks
  for (const edge of [T_SIL0, T_SIL0 + BAR, T_BLACK, T_PIANO]) {
    const n = Math.floor(edge * SR);
    for (let k = -132; k < 132; k++) {
      const g = Math.abs(k) / 132;
      if (L[n + k] !== undefined) {
        L[n + k] *= g;
        R[n + k] *= g;
      }
    }
  }
  normalize(L, R, -1.5);
  writeWav(path.join(OUT, 'music.wav'), L, R);
}

/* ---------------- SFX ---------------- */
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
    const g = i / fadeN;
    L[L.length - 1 - i] *= g;
    R[R.length - 1 - i] *= g;
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
const tone = (f, decay, amp = 1) => (x) => [Math.sin(2 * Math.PI * f * x) * Math.exp(-x * decay) * amp];

function makeSfx() {
  sfx('roar', 3.8, (L, R) => {
    const fl = svf();
    const fr = svf();
    let ph = 0;
    each(L, R, 3.8, (x) => {
      const e = env(x, [[0, 0], [0.25, 1], [2.8, 0.8], [3.8, 0]]);
      ph += (55 + 8 * Math.sin(x * 30)) / SR;
      const growl = Math.tanh(Math.sin(2 * Math.PI * ph) * 3 + Math.sin(2 * Math.PI * ph * 1.5) * 2) * 0.5;
      const c = 500 + 300 * Math.sin(x * 9);
      return [(growl + fl(noise(), c, 0.3).bp * 1.4) * e, (growl + fr(noise(), c * 1.1, 0.3).bp * 1.4) * e];
    });
  }, {verb: 0.4, peak: -1});
  const rattle = (L, R, sec, dens) => {
    for (let k = 0; k < sec * dens; k++) {
      const t0 = rand() * sec;
      const f = 2500 + rand() * 3500;
      const p = rand() * 2 - 1;
      each(L, R, sec, at(t0, (y) => {
        const v = Math.sin(2 * Math.PI * f * y) * Math.exp(-y * 45) * 0.3 + noise() * Math.exp(-y * 300) * 0.3;
        return [v * (1 - p * 0.5), v * (1 + p * 0.5)];
      }));
    }
  };
  sfx('chainrattle', 1.6, (L, R) => rattle(L, R, 1.6, 22), {verb: 0.3, peak: -4});
  sfx('strain', 2.2, (L, R) => {
    rattle(L, R, 2.2, 10);
    const f = svf();
    each(L, R, 2.2, (x) => [f(noise(), 180 + x * 120, 0.2).bp * env(x, [[0, 0], [1.6, 1], [2.2, 0]]) * 1.5]);
  }, {verb: 0.3, peak: -3});
  sfx('scratch', 0.9, (L, R) => {
    const f = svf();
    let ph = 0;
    each(L, R, 0.9, (x) => {
      const sp = x < 0.25 ? 1 - x * 6 : x < 0.5 ? -0.5 + (x - 0.25) * 4 : Math.max(0, 0.5 - (x - 0.5) * 1.4);
      ph += (300 * sp) / SR;
      return [f(noise(), 1200 + 2400 * Math.abs(sp), 0.5).bp * 1.2 * Math.abs(sp) + Math.sin(2 * Math.PI * ph * 4) * 0.2 * Math.abs(sp)];
    });
  }, {peak: -1});
  sfx('tick', 0.15, (L, R) => each(L, R, 0.15, (x) => [Math.sin(2 * Math.PI * 1800 * x) * Math.exp(-x * 90) * 0.6 + noise() * Math.exp(-x * 400) * 0.3]), {peak: -4});
  sfx('rewind', 5.2, (L, R) => {
    const f = svf();
    let ph = 0;
    each(L, R, 5.2, (x) => {
      ph += (400 + 900 * Math.sin(x * 6) ** 2) / SR;
      const chirp = Math.sin(2 * Math.PI * ph) * 0.25 * (0.6 + 0.4 * Math.sin(x * 40));
      const hiss = f(noise(), 3000, 0.4).bp * 0.5;
      const motor = Math.sin(2 * Math.PI * 120 * x) * 0.1;
      return [(chirp + hiss + motor) * env(x, [[0, 0], [0.1, 1], [3.2, 1], [3.4, 0.2], [5.2, 0]])];
    });
  }, {peak: -3});
  sfx('glitch', 0.5, (L, R) => {
    let hold = 0;
    let v = 0;
    each(L, R, 0.5, (x) => {
      if (hold-- <= 0) {
        hold = Math.floor(rand() * 900);
        v = noise();
      }
      const bit = Math.round(v * 3) / 3;
      return [bit * 0.6 * (Math.sin(x * 60) > -0.3 ? 1 : 0) * env(x, [[0, 1], [0.4, 0.8], [0.5, 0]]), noise() * 0.2 * Math.exp(-x * 8)];
    });
  }, {peak: -4});
  sfx('boom', 3, (L, R) => {
    let ph = 0;
    each(L, R, 3, (x) => {
      ph += (32 + 70 * Math.exp(-x * 10)) / SR;
      return [Math.sin(2 * Math.PI * ph) * Math.exp(-x * 1.8) + noise() * Math.exp(-x * 30) * 0.4];
    });
  }, {verb: 0.6, peak: -1});
  sfx('buzz', 1.3, (L, R) => each(L, R, 1.3, (x) => {
    const on = (x % 0.5) < 0.32 ? 1 : 0;
    return [(Math.sign(Math.sin(2 * Math.PI * 160 * x)) * 0.3 + Math.sin(2 * Math.PI * 80 * x) * 0.5) * on * Math.min(1, (x % 0.5) / 0.01)];
  }), {peak: -4});
  sfx('phantom', 0.6, (L, R) => each(L, R, 0.6, (x) => [(Math.sign(Math.sin(2 * Math.PI * 160 * x)) * 0.3 + Math.sin(2 * Math.PI * 80 * x) * 0.5) * env(x, [[0, 0], [0.05, 1], [0.35, 0.5], [0.6, 0]])]), {verb: 0.5, peak: -8});
  sfx('ding', 1.4, (L, R) => {
    each(L, R, 1.4, (x) => [Math.sin(2 * Math.PI * 1568 * x) * Math.exp(-x * 4) * 0.5 + Math.sin(2 * Math.PI * 2093 * x) * Math.exp(-x * 5) * 0.35 * (x > 0.09 ? 1 : 0)]);
  }, {verb: 0.4, peak: -3});
  sfx('swipe', 0.35, (L, R) => {
    const f = svf();
    each(L, R, 0.35, (x) => [f(noise(), 800 + 5000 * (x / 0.35), 0.5).bp * env(x, [[0, 0], [0.15, 1], [0.35, 0]])]);
  }, {peak: -6});
  sfx('slot', 1.2, (L, R) => {
    for (let k = 0; k < 18; k++) each(L, R, 1.2, at(k * 0.045 + k * k * 0.0012, (y) => [noise() * Math.exp(-y * 300) * 0.5 + Math.sin(2 * Math.PI * 900 * y) * Math.exp(-y * 120) * 0.3]));
    each(L, R, 1.2, at(0, (y) => [Math.sin(2 * Math.PI * (300 - y * 120) * y) * Math.exp(-y * 20) * 0.4]));
  }, {verb: 0.2, peak: -4});
  sfx('jackpot', 2.4, (L, R) => {
    [72, 76, 79, 84, 88, 91].forEach((m, k) => each(L, R, 2.4, at(k * 0.07, (y) => {
      const v = Math.sin(2 * Math.PI * mtof(m) * y) * Math.exp(-y * 2.5) * 0.3;
      return [v * (k % 2 ? 0.6 : 1), v * (k % 2 ? 1 : 0.6)];
    })));
    for (let k = 0; k < 30; k++) each(L, R, 2.4, at(0.3 + rand() * 1.6, tone(3000 + rand() * 3000, 40, 0.12)));
  }, {verb: 0.6, peak: -2});
  sfx('whisper', 2.4, (L, R) => {
    const fl = svf();
    const fr = svf();
    each(L, R, 2.4, (x) => {
      const e = env(x, [[0, 0], [0.25, 1], [1.7, 0.8], [2.4, 0]]);
      const trem = 0.6 + 0.4 * Math.sin(2 * Math.PI * 7 * x) * Math.sin(2 * Math.PI * 1.3 * x);
      const fc = 700 + 500 * Math.sin(2 * Math.PI * 0.8 * x);
      const drone = (Math.sin(2 * Math.PI * 55 * x) + 0.6 * Math.sin(2 * Math.PI * 56.5 * x)) * 0.25;
      return [(fl(noise(), fc, 0.25).bp * 0.6 * trem + drone) * e, (fr(noise(), fc * 1.1, 0.25).bp * 0.6 * trem + drone) * e];
    });
  }, {verb: 0.6, peak: -4});
  sfx('alarm', 1.8, (L, R) => each(L, R, 1.8, (x) => [((x % 0.25) < 0.12 ? 1 : 0) * Math.sign(Math.sin(2 * Math.PI * 2000 * x)) * 0.25 * (x < 1.6 ? 1 : 0)]), {peak: -8});
  sfx('chainclick', 1.2, (L, R) => {
    each(L, R, 1.2, (x) => [noise() * Math.exp(-x * 220) * 0.9 + Math.sin(2 * Math.PI * 3100 * x) * Math.exp(-x * 14) * 0.35 + Math.sin(2 * Math.PI * 4650 * x) * Math.exp(-x * 18) * 0.2]);
    each(L, R, 1.2, at(0.05, (y) => [noise() * Math.exp(-y * 300) * 0.6 + Math.sin(2 * Math.PI * 2600 * y) * Math.exp(-y * 20) * 0.25]));
  }, {verb: 0.4, peak: -1});
  sfx('bike', 1.0, (L, R) => {
    const f = svf();
    each(L, R, 1.0, (x) => {
      const p = clamp((x - 0.3) / 0.4, -1, 1);
      const [gl, gr] = pan(p);
      const v = (f(noise(), 1500 + 1500 * (1 - Math.abs(p)), 0.4).bp + Math.sin(2 * Math.PI * 30 * x) * 0.2) * env(x, [[0, 0], [0.45, 1], [1, 0]]);
      return [v * gl, v * gr];
    });
    each(L, R, 1.0, at(0.15, (y) => [Math.sin(2 * Math.PI * 2400 * y) * (y < 0.08 || (y > 0.12 && y < 0.2) ? 0.2 : 0)]));
  }, {peak: -3});
  sfx('sand', 4, (L, R) => {
    const f = svf();
    each(L, R, 4, (x) => [f(noise(), 5000, 0.6).hp * (0.5 + 0.5 * rand()) * env(x, [[0, 0], [0.5, 0.5], [3.5, 0.5], [4, 0]])]);
  }, {peak: -12});
  sfx('booksnap', 0.6, (L, R) => each(L, R, 0.6, (x) => [noise() * Math.exp(-x * 60) * 0.8 + Math.sin(2 * Math.PI * (120 + 80 * Math.exp(-x * 40)) * x) * Math.exp(-x * 18)]), {verb: 0.3, peak: -2});
  sfx('dive', 1.4, (L, R) => {
    const f = svf();
    each(L, R, 1.4, (x) => {
      const u = Math.min(1, x / 1.0);
      return [f(noise(), 200 + 6000 * u * u, 0.35).bp * u * u * (x < 1.0 ? 1 : Math.exp(-(x - 1) * 20)) + Math.sin(2 * Math.PI * (200 + 1200 * u * u) * x) * 0.1 * u];
    });
  }, {verb: 0.3, peak: -2});
  sfx('slide', 13, (L, R) => {
    const fl = svf();
    const fr = svf();
    each(L, R, 13, (x) => {
      const e = env(x, [[0, 0], [0.5, 0.8], [12, 1], [13, 0]]);
      const c = 900 + 400 * Math.sin(x * 1.7);
      return [fl(noise(), c, 0.3).bp * e * 0.7 + Math.sin(2 * Math.PI * 70 * x) * 0.08, fr(noise(), c * 1.08, 0.3).bp * e * 0.7 + Math.sin(2 * Math.PI * 70 * x) * 0.08];
    });
  }, {peak: -6});
  sfx('muffled', 8, (L, R) => {
    const f = svf();
    const f2 = svf();
    each(L, R, 8, (x) => {
      const babble = f(noise() * (0.5 + 0.5 * Math.sin(x * 23) * Math.sin(x * 7.3)), 500, 0.2).bp;
      const laugh = ((x % 2.6) > 0.8 && (x % 2.6) < 1.6) ? Math.sin(2 * Math.PI * (220 + 30 * Math.sin(x * 40)) * x) * (0.5 + 0.5 * Math.sin(x * 50)) * 0.25 : 0;
      return [f2(babble + laugh, 450, 0.7).lp * env(x, [[0, 0], [0.5, 1], [7.5, 1], [8, 0]]) * 1.4];
    });
  }, {verb: 0.6, peak: -6});
  sfx('laughs', 4, (L, R) => {
    for (let v = 0; v < 4; v++) {
      const base = 180 + v * 50;
      const p = v / 1.5 - 1;
      each(L, R, 4, at(v * 0.15, (y) => {
        const s = (Math.sin(2 * Math.PI * 4.5 * y + v) > 0.2 ? 1 : 0) * env(y, [[0, 0], [0.2, 1], [2.6, 0.6], [3.4, 0]]);
        const vv = (Math.sin(2 * Math.PI * base * y) + 0.4 * Math.sin(2 * Math.PI * base * 2 * y) + noise() * 0.2) * s * 0.18;
        const [gl, gr] = pan(p);
        return [vv * gl, vv * gr];
      }));
    }
  }, {verb: 0.4, peak: -4});
  sfx('poof', 0.8, (L, R) => {
    const f = svf();
    each(L, R, 0.8, (x) => [f(noise(), 900, 0.5).lp * env(x, [[0, 0], [0.05, 1], [0.8, 0]])]);
  }, {verb: 0.5, peak: -6});
  sfx('suck', 1.8, (L, R) => {
    const f = svf();
    each(L, R, 1.8, (x) => {
      const u = x / 1.8;
      return [f(noise(), 300 + 4000 * u, 0.4).bp * env(x, [[0, 0], [1.4, 1], [1.8, 0]]) + Math.sin(2 * Math.PI * (300 + 900 * u) * x) * 0.06];
    });
    each(L, R, 1.8, at(1.55, (y) => [Math.sin(2 * Math.PI * 900 * y) * Math.exp(-y * 40) * 0.4]));
  }, {peak: -4});
  sfx('wind', 10, (L, R) => {
    const fl = svf();
    const fr = svf();
    each(L, R, 10, (x) => {
      const e = env(x, [[0, 0], [1, 0.8], [9, 0.8], [10, 0]]) * (0.6 + 0.4 * Math.sin(x * 0.9) * Math.sin(x * 2.3));
      return [fl(noise(), 500 + 300 * Math.sin(x * 0.7), 0.3).bp * e, fr(noise(), 560 + 300 * Math.sin(x * 0.6), 0.3).bp * e];
    });
  }, {peak: -6});
  sfx('pages', 10, (L, R) => {
    for (let k = 0; k < 70; k++) {
      const t0 = Math.pow(k / 70, 0.8) * 9.5;
      const f = svf();
      each(L, R, 10, at(t0, (y) => [y < 0.12 ? f(noise(), 3500, 0.5).bp * Math.sin((y / 0.12) * Math.PI) * 0.5 : 0]));
    }
  }, {peak: -6});
  sfx('powerdown', 1.6, (L, R) => {
    let ph = 0;
    each(L, R, 1.6, (x) => {
      ph += (900 * Math.exp(-x * 3)) / SR;
      return [Math.sin(2 * Math.PI * ph) * Math.exp(-x * 2.4) * 0.5 + noise() * Math.exp(-x * 40) * 0.2];
    });
  }, {verb: 0.3, peak: -4});
  sfx('drawer', 0.9, (L, R) => {
    const f = svf();
    each(L, R, 0.9, (x) => [f(noise(), 700, 0.4).bp * env(x, [[0, 0], [0.05, 0.6], [0.45, 0.6], [0.5, 0]]) + (x > 0.48 ? Math.sin(2 * Math.PI * 140 * (x - 0.48)) * Math.exp(-(x - 0.48) * 20) : 0)]);
  }, {verb: 0.2, peak: -3});
  sfx('impact', 3.0, (L, R) => {
    const fl = svf();
    let ph = 0;
    each(L, R, 3.0, (x) => {
      ph += (34 + 60 * Math.exp(-x * 12)) / SR;
      return [Math.sin(2 * Math.PI * ph) * Math.exp(-x * 2.2) + fl(noise(), 1200 * Math.exp(-x * 6) + 100, 0.6).lp * Math.exp(-x * 5) * 0.7];
    });
  }, {verb: 0.6, peak: -1});
  sfx('slam', 0.8, (L, R) => each(L, R, 0.8, (x) => [noise() * Math.exp(-x * 50) * 0.8 + Math.sin(2 * Math.PI * (90 + 80 * Math.exp(-x * 30)) * x) * Math.exp(-x * 9)]), {verb: 0.3, peak: -1});
  sfx('pencil', 5, (L, R) => {
    const f = svf();
    each(L, R, 5, (x) => [f(noise(), 3000 + 1000 * Math.sin(x * 25), 0.6).bp * (0.4 + 0.6 * Math.abs(Math.sin(x * 9))) * env(x, [[0, 0], [0.1, 1], [4.6, 1], [5, 0]])]);
  }, {peak: -10});
  sfx('shimmer', 2.5, (L, R) => {
    [2093, 2637, 3136, 3951].forEach((fq, k) => each(L, R, 2.5, (x) => {
      const v = Math.sin(2 * Math.PI * fq * x + k) * env(x, [[0, 0], [0.4, 1], [2.5, 0]]) * 0.2;
      return [v * (k % 2 ? 0.6 : 1), v * (k % 2 ? 1 : 0.6)];
    }));
  }, {verb: 0.8, peak: -6});
  sfx('monsterlaugh', 3.6, (L, R) => {
    const f = svf();
    let ph = 0;
    each(L, R, 3.6, (x) => {
      const pulse = Math.max(0, Math.sin(2 * Math.PI * 5 * x)) ** 2;
      ph += (110 + 25 * Math.sin(x * 2)) / SR;
      const v = Math.tanh(Math.sin(2 * Math.PI * ph) * 4) * 0.4 + f(noise(), 700, 0.3).bp * 0.6;
      return [v * pulse * env(x, [[0, 0], [0.1, 1], [2.8, 0.8], [3.6, 0]])];
    });
  }, {verb: 0.5, peak: -2});
  sfx('tie', 0.7, (L, R) => {
    const f = svf();
    each(L, R, 0.7, (x) => [f(noise(), 1800 + 1200 * Math.sin(x * 20), 0.4).bp * env(x, [[0, 0], [0.1, 1], [0.3, 0.6], [0.45, 1], [0.7, 0]]) * 0.8]);
  }, {peak: -6});
  sfx('whoosh', 0.9, (L, R) => {
    const f = svf();
    each(L, R, 0.9, (x) => [f(noise(), 400 + 3000 * Math.sin((x / 0.9) * Math.PI), 0.35).bp * Math.sin((x / 0.9) * Math.PI) ** 2]);
  }, {peak: -4});
  sfx('knock', 0.8, (L, R) => {
    [0, 0.2, 0.4].forEach((t0) => each(L, R, 0.8, at(t0, (y) => [Math.sin(2 * Math.PI * (180 + 100 * Math.exp(-y * 60)) * y) * Math.exp(-y * 35) + noise() * Math.exp(-y * 200) * 0.3])));
  }, {verb: 0.25, peak: -2});
  sfx('door', 1.2, (L, R) => {
    let ph = 0;
    each(L, R, 1.2, (x) => {
      ph += (260 + 120 * Math.sin(x * 6)) / SR;
      return [Math.sin(2 * Math.PI * ph) * (0.5 + 0.5 * Math.sin(x * 70)) * 0.15 * env(x, [[0, 0], [0.2, 1], [1, 0.5], [1.2, 0]])];
    });
  }, {verb: 0.3, peak: -8});
  sfx('chainsnap', 3.5, (L, R) => {
    each(L, R, 3.5, (x) => [noise() * Math.exp(-x * 25) * 0.9 + Math.sin(2 * Math.PI * (60 + 90 * Math.exp(-x * 9)) * x) * Math.exp(-x * 1.8) * 0.9]);
    for (let k = 0; k < 40; k++) {
      const t0 = rand() * 1.8;
      const fq = 2500 + rand() * 4000;
      const p = rand() * 2 - 1;
      each(L, R, 3.5, at(t0, (y) => {
        const v = Math.sin(2 * Math.PI * fq * y) * Math.exp(-y * 12) * 0.18;
        return [v * (1 - p * 0.6), v * (1 + p * 0.6)];
      }));
    }
  }, {verb: 0.7, peak: -1});
  sfx('screech', 2.5, (L, R) => {
    let ph = 0;
    each(L, R, 2.5, (x) => {
      ph += (900 + 1400 * x - 300 * Math.sin(x * 30)) / SR;
      return [(Math.sin(2 * Math.PI * ph) + 0.4 * Math.sign(Math.sin(2 * Math.PI * ph * 1.01))) * 0.3 * env(x, [[0, 0], [0.1, 1], [1.8, 0.6], [2.5, 0]])];
    });
  }, {verb: 0.4, peak: -4});
  sfx('flash', 4, (L, R) => {
    const f = svf();
    each(L, R, 4, (x) => [f(noise(), 5000, 0.5).hp * Math.exp(-x * 1.2) * 0.35 + Math.sin(2 * Math.PI * (30 + 70 * Math.exp(-x * 8)) * x) * Math.exp(-x * 1.4)]);
    [1047, 1319, 1568, 2093].forEach((fq, k) => each(L, R, 4, (x) => [Math.sin(2 * Math.PI * fq * x + k) * env(x, [[0, 0], [0.05, 0.12], [4, 0]])]));
  }, {verb: 0.8, peak: -2});
  sfx('dialtone', 2.4, (L, R) => each(L, R, 2.4, (x) => [((x % 1.2) < 0.5 ? 1 : 0) * (Math.sin(2 * Math.PI * 440 * x) + Math.sin(2 * Math.PI * 480 * x)) * 0.12]), {peak: -10});
  sfx('pout', 0.8, (L, R) => {
    let ph = 0;
    each(L, R, 0.8, (x) => {
      ph += (500 - 300 * x) / SR;
      return [Math.sin(2 * Math.PI * ph) * env(x, [[0, 0], [0.05, 0.5], [0.6, 0.3], [0.8, 0]])];
    });
  }, {peak: -10});
  sfx('scribble', 1.4, (L, R) => {
    const f = svf();
    each(L, R, 1.4, (x) => [f(noise(), 2500 + 800 * Math.sin(x * 40), 0.5).bp * (0.5 + 0.5 * Math.sin(2 * Math.PI * 6 * x)) * env(x, [[0, 0], [0.05, 1], [1.2, 0.8], [1.4, 0]])]);
  }, {peak: -6});
}

const t0 = Date.now();
makeSfx();
music();
console.log(`audio written to ${OUT} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
