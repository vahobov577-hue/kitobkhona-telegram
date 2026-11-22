import {Easing, interpolate, random} from 'remotion';

export const EASE = Easing.bezier(0.45, 0, 0.25, 1);
export const EASE_OUT = Easing.bezier(0.16, 0.7, 0.3, 1);
export const EASE_IN = Easing.bezier(0.6, 0, 0.85, 0.35);
export const LINEAR = (t: number) => t;

export const ramp = (
  f: number,
  a: number,
  b: number,
  from = 0,
  to = 1,
  ease: (t: number) => number = EASE,
) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

/** multi-key interpolation with easing on every segment */
export const keys = (
  f: number,
  input: number[],
  output: number[],
  ease: (t: number) => number = EASE,
) =>
  interpolate(f, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const rnd = (s: string | number) => random(String(s));

/** smooth 1D value noise in [-1,1] */
export const noise = (seed: string | number, t: number) => {
  const i = Math.floor(t);
  const fr = t - i;
  const s = fr * fr * (3 - 2 * fr);
  const a = rnd(`${seed}:${i}`) * 2 - 1;
  const b = rnd(`${seed}:${i + 1}`) * 2 - 1;
  return a + (b - a) * s;
};

/**
 * Hand-drawn "boil": a tagged template that adds ±amp px seeded noise to every
 * interpolated number. The noise changes every 4 frames.
 */
export const wobbler = (frame: number, seed: string, amp = 1) => {
  const step = Math.floor(frame / 4);
  return (strings: TemplateStringsArray, ...vals: number[]) => {
    let out = strings[0];
    for (let i = 0; i < vals.length; i++) {
      const n = (rnd(`${seed}|${step}|${i}`) * 2 - 1) * amp;
      out += (vals[i] + n).toFixed(1) + strings[i + 1];
    }
    return out;
  };
};
export type Wob = ReturnType<typeof wobbler>;

/** ellipse as 4 cubic beziers (so it can wobble) */
export const ellipsePath = (
  w: Wob,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
) => {
  const k = 0.5523;
  return w`M ${cx - rx} ${cy} C ${cx - rx} ${cy - ry * k} ${cx - rx * k} ${cy - ry} ${cx} ${cy - ry} C ${cx + rx * k} ${cy - ry} ${cx + rx} ${cy - ry * k} ${cx + rx} ${cy} C ${cx + rx} ${cy + ry * k} ${cx + rx * k} ${cy + ry} ${cx} ${cy + ry} C ${cx - rx * k} ${cy + ry} ${cx - rx} ${cy + ry * k} ${cx - rx} ${cy} Z`;
};

/** rounded rect path that can wobble */
export const rectPath = (
  w: Wob,
  x: number,
  y: number,
  wd: number,
  ht: number,
  r = 6,
) =>
  w`M ${x + r} ${y} L ${x + wd - r} ${y} Q ${x + wd} ${y} ${x + wd} ${y + r} L ${x + wd} ${y + ht - r} Q ${x + wd} ${y + ht} ${x + wd - r} ${y + ht} L ${x + r} ${y + ht} Q ${x} ${y + ht} ${x} ${y + ht - r} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;

/** jitter offset (changes every `every` frames) */
export const jitter = (frame: number, seed: string, amp: number, every = 2) => {
  const s = Math.floor(frame / every);
  return {
    x: (rnd(`${seed}x${s}`) * 2 - 1) * amp,
    y: (rnd(`${seed}y${s}`) * 2 - 1) * amp,
  };
};
