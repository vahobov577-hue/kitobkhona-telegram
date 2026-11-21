// Synthesises the soundtrack and SFX as 16-bit WAV files (no dependencies).
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

/* ---------------- music ---------------- */
// Am – F – C – G
const CH = [
  {root: 45, tones: [57, 60, 64]},
  {root: 41, tones: [57, 60, 65]},
  {root: 48, tones: [55, 60, 64]},
  {root: 43, tones: [55, 59, 62]},
];
const DUR = 150;
const T_PART2 = 2190 / 30; // 73.0 s
const T0 = 2250 / 30; // 75.0 s — "DAY 1." downbeat
const BEAT = 0.6; // 100 BPM
const BAR = BEAT * 4;
const T_FLASH = 3618 / 30; // 120.6 s
const T_DAWN = 3750 / 30; // 125 s
const T_END_CARD = 4260 / 30; // 142 s

function music() {
  const dry = stereo(DUR);
  const send = stereo(DUR);

  // Part 1: quiet piano + pad, 4.8 s per chord
  const P1 = 4.8;
  for (let i = 0, t = 0.25; t < T_PART2 - 1; i++, t += P1) {
    const c = CH[i % 4];
    const vol = 1.45 * env(t, [[0, 0.5], [20, 0.8], [57, 0.75], [68, 0.95]]);
    c.tones.forEach((m, k) => piano(send, t + k * 0.035, m, 0.11 * vol, 3.8, -0.3 + k * 0.3));
    piano(send, t, c.root + 12, 0.08 * vol, 4, -0.2);
    [0, 1, 2, 1, 2, 3].forEach((s, k) => {
      const m = [c.tones[0] + 12, c.tones[1] + 12, c.tones[2] + 12, c.tones[0] + 24][s];
      if (rand() < 0.85) piano(send, t + 1.2 + k * 0.6, m, 0.045 * vol, 1.6, 0.4 - k * 0.15);
    });
    c.tones.forEach((m) => padVoice(send, t, P1, m - 12, 0.022 * vol * env(t, [[0, 0.3], [10, 1]]), {cut: 700, att: 2, rel: 2}));
  }
  // riser into part 2 (73 → 75 s)
  {
    const n0 = Math.floor(T_PART2 * SR);
    const flt = svf();
    for (let k = 0; k < (T0 - T_PART2) * SR; k++) {
      const x = k / SR / (T0 - T_PART2);
      const v = flt(noise(), 300 + 5000 * x * x, 0.4).bp * x * x * 0.16;
      dry[0][n0 + k] += v;
      dry[1][n0 + k] += v;
    }
  }

  // Part 2: from 75 s on the 100 BPM grid, chord per 2 bars (4.8 s)
  const intensity = (t) => env(t, [[T0, 0.55], [95, 0.7], [113, 0.85], [T_FLASH - 0.01, 1.0]]);
  for (let bar = 0; ; bar++) {
    const t = T0 + bar * BAR;
    if (t >= DUR) break;
    const c = CH[Math.floor(bar / 2) % 4];
    const driving = t < T_FLASH - 0.01;
    const calm = t >= T_DAWN - 0.2;
    if (t >= T_END_CARD - 0.1) break; // final chord handled below
    const I = driving ? intensity(t) : env(t, [[T_FLASH, 0.9], [T_DAWN, 0.65], [T_END_CARD, 0.45]]);
    // piano
    c.tones.forEach((m, k) => piano(send, t + k * 0.02, m + (driving ? 0 : 0), 0.12 * I, BAR, -0.3 + k * 0.3));
    for (let e = 0; e < 8; e++) {
      const m = [c.tones[0] + 12, c.tones[2], c.tones[1] + 12, c.tones[2] + 12][e % 4];
      piano(send, t + e * (BEAT / 2), m, (driving ? 0.05 : 0.04) * I, 0.6, 0.5 - (e % 4) * 0.25);
    }
    if (bar % 2 === 0) {
      // strings / pad
      const sAmp = driving ? env(t, [[T0, 0.0], [94, 0.006], [96, 0.03], [113, 0.045]]) : calm ? 0.03 : 0.045;
      c.tones.forEach((m) => padVoice(send, t, BAR * 2, m, sAmp, {cut: 1500, att: 0.9, rel: 1.6, det: 0.003, vib: 0.002, bright: 0.4}));
      c.tones.forEach((m) => padVoice(send, t, BAR * 2, m - 12, 0.02 * I, {cut: 700, att: 1.2, rel: 1.6}));
    }
    if (driving) {
      for (let b = 0; b < 4; b++) {
        const tb = t + b * BEAT;
        if (tb >= T_FLASH - 0.01) break;
        kick(dry, tb, 0.55 * I);
        for (let e = 0; e < 2; e++) bass(dry, tb + e * (BEAT / 2), c.root - 12 + (e === 1 && b === 3 ? 7 : 0), BEAT / 2 - 0.03, 0.16 * I);
        if (t >= 95) hat(dry, tb + BEAT / 2, 0.08 * I);
      }
      // build in scene 15: 16th hats + snare-ish noise in the last 2 bars before the flash
      if (t >= T_FLASH - BAR * 2 - 0.01) {
        for (let s = 0; s < 16; s++) hat(dry, t + s * (BEAT / 4), 0.05 + 0.05 * (s / 16), s % 2 ? -0.3 : 0.3);
      }
    } else if (calm) {
      bass(dry, t, c.root - 12, BAR - 0.1, 0.07);
    }
  }
  // the hit
  kick(dry, T_FLASH, 1.2);
  crash(dry, T_FLASH, 0.35, 4);
  CH[0].tones.forEach((m) => padVoice(send, T_FLASH, 4.4, m + 12, 0.04, {cut: 2500, att: 0.05, rel: 3, vib: 0.003}));
  bass(dry, T_FLASH, 33, 3, 0.25);
  // final chord (C major, warm) from the end card to the end
  const fin = [48, 55, 60, 64, 67];
  fin.forEach((m, k) => piano(send, T_END_CARD + k * 0.05, m, 0.11, 6, -0.4 + k * 0.2));
  fin.slice(1).forEach((m) => padVoice(send, T_END_CARD, 6.5, m, 0.03, {cut: 1200, att: 1.5, rel: 1.5}));

  // mix: dry + send + reverb
  const [wl, wr] = reverb(send[0], send[1], 0.86, 0.35);
  const L = new Float32Array(dry[0].length);
  const R = new Float32Array(dry[0].length);
  for (let i = 0; i < L.length; i++) {
    const t = i / SR;
    const fade = t > DUR - 20 / 30 ? Math.max(0, (DUR - t) / (20 / 30)) : 1;
    const fadeIn = Math.min(1, t / 1.5);
    L[i] = Math.tanh((dry[0][i] + send[0][i] * 0.8 + wl[i] * 0.9) * 1.2) * fade * fadeIn;
    R[i] = Math.tanh((dry[1][i] + send[1][i] * 0.8 + wr[i] * 0.9) * 1.2) * fade * fadeIn;
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
  // tiny fades against clicks
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

function makeSfx() {
  sfx('shimmer', 2.5, (L, R) => {
    [2093, 2637, 3136, 3951].forEach((f, k) =>
      each(L, R, 2.5, (x) => {
        const e = env(x, [[0, 0], [0.4, 1], [2.5, 0]]) * 0.2;
        const v = Math.sin(2 * Math.PI * f * x + k) * e * (0.6 + 0.4 * Math.sin(x * 9 + k));
        return [v * (k % 2 ? 0.6 : 1), v * (k % 2 ? 1 : 0.6)];
      }),
    );
  }, {verb: 0.8, peak: -6});
  sfx('tick', 0.15, (L, R) => each(L, R, 0.15, (x) => [Math.sin(2 * Math.PI * 1800 * x) * Math.exp(-x * 90) * 0.6 + noise() * Math.exp(-x * 400) * 0.3]), {peak: -4});
  sfx('whisper', 2.4, (L, R) => {
    const fl = svf();
    const fr = svf();
    each(L, R, 2.4, (x) => {
      const e = env(x, [[0, 0], [0.25, 1], [1.7, 0.8], [2.4, 0]]);
      const trem = 0.6 + 0.4 * Math.sin(2 * Math.PI * 7 * x) * Math.sin(2 * Math.PI * 1.3 * x);
      const fc = 700 + 500 * Math.sin(2 * Math.PI * 0.8 * x);
      const air = [fl(noise(), fc, 0.25).bp, fr(noise(), fc * 1.1, 0.25).bp];
      const drone = (Math.sin(2 * Math.PI * 55 * x) + 0.6 * Math.sin(2 * Math.PI * 56.5 * x) + 0.3 * Math.sin(2 * Math.PI * 82.4 * x)) * 0.25;
      return [(air[0] * 0.6 * trem + drone) * e, (air[1] * 0.6 * trem + drone) * e];
    });
  }, {verb: 0.6, peak: -4});
  sfx('lid', 0.5, (L, R) => each(L, R, 0.5, (x) => [Math.sin(2 * Math.PI * (90 + 60 * Math.exp(-x * 30)) * x) * Math.exp(-x * 14) + noise() * Math.exp(-x * 120) * 0.5]), {verb: 0.3});
  sfx('blips', 1.6, (L, R) => {
    [0, 0.22, 0.5, 0.71, 1.0, 1.24].forEach((t0, k) =>
      each(L, R, 1.6, (x) => {
        const y = x - t0;
        if (y < 0) return [0];
        const v = Math.sin(2 * Math.PI * (k % 2 ? 1760 : 1320) * y) * Math.exp(-y * 25) * 0.4;
        return [v * (k % 2 ? 0.5 : 1), v * (k % 2 ? 1 : 0.5)];
      }),
    );
  }, {verb: 0.5, peak: -6});
  sfx('heartbeat', 6.5, (L, R) => {
    for (let b = 0; b < 7; b++) {
      [0, 0.24].forEach((o, k) => {
        const t0 = b * 0.92 + o;
        each(L, R, 6.5, (x) => {
          const y = x - t0;
          if (y < 0 || y > 0.4) return [0];
          let ph = 50 * y + (30 * (1 - Math.exp(-y * 40))) / 40;
          return [Math.sin(2 * Math.PI * ph) * Math.exp(-y * 18) * (k ? 0.7 : 1)];
        });
      });
    }
  }, {peak: -2});
  sfx('glass', 2.0, (L, R) => {
    const f1 = svf();
    each(L, R, 2.0, (x) => [f1(noise(), 3500, 0.5).hp * (Math.exp(-x * 9) + (x > 0.12 && x < 0.2 ? 0.6 : 0)) * 0.8]);
    for (let k = 0; k < 14; k++) {
      const t0 = 0.05 + rand() * 1.1;
      const f = 2500 + rand() * 4500;
      const p = rand() * 2 - 1;
      each(L, R, 2.0, (x) => {
        const y = x - t0;
        if (y < 0) return [0];
        const v = Math.sin(2 * Math.PI * f * y) * Math.exp(-y * 30) * 0.25;
        return [v * (1 - p) * 0.7, v * (1 + p) * 0.7];
      });
    }
    each(L, R, 2.0, (x) => [Math.sin(2 * Math.PI * (60 + 40 * Math.exp(-x * 10)) * x) * Math.exp(-x * 5) * 0.5]);
  }, {verb: 0.5});
  sfx('click', 0.25, (L, R) => {
    const f = svf();
    each(L, R, 0.25, (x) => {
      const a = x < 0.012 ? f(noise(), 3200, 0.3).bp * Math.exp(-x * 400) : 0;
      const y = x - 0.07;
      const b = y > 0 && y < 0.012 ? noise() * Math.exp(-y * 500) * 0.5 : 0;
      return [a + b + Math.sin(2 * Math.PI * 2400 * x) * Math.exp(-x * 160) * 0.4];
    });
  }, {verb: 0.1, peak: -2});
  sfx('impact', 3.0, (L, R) => {
    const fl = svf();
    let ph = 0;
    each(L, R, 3.0, (x) => {
      ph += (34 + 60 * Math.exp(-x * 12)) / SR;
      const boom = Math.sin(2 * Math.PI * ph) * Math.exp(-x * 2.2);
      const crack = fl(noise(), 1200 * Math.exp(-x * 6) + 100, 0.6).lp * Math.exp(-x * 5) * 0.7;
      return [boom + crack];
    });
  }, {verb: 0.6, peak: -1});
  sfx('tie', 0.7, (L, R) => {
    const f = svf();
    each(L, R, 0.7, (x) => [f(noise(), 1800 + 1200 * Math.sin(x * 20), 0.4).bp * env(x, [[0, 0], [0.1, 1], [0.3, 0.6], [0.45, 1], [0.7, 0]]) * 0.8]);
  }, {peak: -6});
  sfx('whistle', 0.8, (L, R) => {
    const f = svf();
    let ph = 0;
    each(L, R, 0.8, (x) => {
      ph += (2400 - 1500 * (x / 0.8)) / SR;
      const e = env(x, [[0, 0], [0.45, 1], [0.6, 0.3], [0.8, 0]]);
      const p = -1 + 2 * (x / 0.6);
      const v = (Math.sin(2 * Math.PI * ph) * 0.35 + f(noise(), 3000, 0.3).bp * 0.6) * e;
      const [gl, gr] = pan(clamp(p, -1, 1));
      return [v * gl, v * gr];
    });
  }, {peak: -4});
  sfx('hit', 0.4, (L, R) => each(L, R, 0.4, (x) => [noise() * Math.exp(-x * 60) * 0.7 + Math.sin(2 * Math.PI * (140 + 100 * Math.exp(-x * 40)) * x) * Math.exp(-x * 14)]), {verb: 0.2, peak: -3});
  sfx('thud', 0.8, (L, R) => each(L, R, 0.8, (x) => [Math.sin(2 * Math.PI * (55 + 50 * Math.exp(-x * 25)) * x) * Math.exp(-x * 7) + noise() * Math.exp(-x * 80) * 0.3]), {verb: 0.25, peak: -2});
  sfx('sparkle', 0.6, (L, R) => {
    for (let k = 0; k < 6; k++) {
      const t0 = k * 0.04;
      const f = 1500 * Math.pow(1.26, k);
      each(L, R, 0.6, (x) => {
        const y = x - t0;
        if (y < 0) return [0];
        const v = Math.sin(2 * Math.PI * f * y) * Math.exp(-y * 18) * 0.25;
        return [v * (k % 2 ? 0.5 : 1), v * (k % 2 ? 1 : 0.5)];
      });
    }
  }, {verb: 0.5, peak: -6});
  sfx('whoosh', 1.5, (L, R) => {
    const fl = svf();
    const fr = svf();
    each(L, R, 1.5, (x) => {
      const u = Math.min(1, x / 1.33);
      const e = x < 1.33 ? Math.pow(u, 2.5) : Math.exp(-(x - 1.33) * 30);
      const fc = 200 + 5000 * u * u;
      return [fl(noise(), fc, 0.35).bp * e, fr(noise(), fc * 1.07, 0.35).bp * e];
    });
  }, {peak: -2});
  sfx('flash', 4.5, (L, R) => {
    let ph = 0;
    const f = svf();
    each(L, R, 4.5, (x) => {
      ph += (30 + 70 * Math.exp(-x * 8)) / SR;
      const boom = Math.sin(2 * Math.PI * ph) * Math.exp(-x * 1.4);
      const air = f(noise(), 5000, 0.5).hp * Math.exp(-x * 1.1) * 0.35;
      return [boom + air];
    });
    [1047, 1319, 1568, 2093].forEach((fr, k) =>
      each(L, R, 4.5, (x) => {
        const v = Math.sin(2 * Math.PI * fr * x + k) * env(x, [[0, 0], [0.05, 0.12], [4.5, 0]]);
        return [v * (k % 2 ? 0.6 : 1), v * (k % 2 ? 1 : 0.6)];
      }),
    );
  }, {verb: 0.8, peak: -1});
  sfx('beep', 0.3, (L, R) => each(L, R, 0.3, (x) => [Math.sin(2 * Math.PI * 1000 * x) * (x < 0.14 ? 0.5 : 0) * Math.min(1, x / 0.005)]), {verb: 0.2, peak: -6});
  sfx('scribble', 1.4, (L, R) => {
    const f = svf();
    each(L, R, 1.4, (x) => {
      const strokeAmp = 0.5 + 0.5 * Math.sin(2 * Math.PI * 6 * x);
      return [f(noise(), 2500 + 800 * Math.sin(x * 40), 0.5).bp * strokeAmp * env(x, [[0, 0], [0.05, 1], [1.2, 0.8], [1.4, 0]])];
    });
  }, {peak: -6});
}

const t0 = Date.now();
makeSfx();
music();
console.log(`audio written to ${OUT} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
