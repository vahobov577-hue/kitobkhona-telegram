import React, {useId} from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {clamp, noise, rectPath, rnd, wobbler} from '../lib';

type P = [number, number];

/* ---------------- Chain ---------------- */
/**
 * Red chain of links between two world points. `sag` px of slack in the middle,
 * `swing` adds a sway, `snap` 0..1 breaks the chain at `breakAt` and the halves fall away.
 */
export const Chain: React.FC<{
  from: P;
  to: P;
  sag?: number;
  swing?: number;
  link?: number; // link length px
  width?: number;
  snap?: number;
  breakAt?: number;
  seed?: string;
  glow?: number;
  grow?: number; // 0..1 draw from `from` towards `to`
}> = ({from, to, sag = 40, swing = 1, link = 26, width = 6, snap = 0, breakAt = 0.5, seed = 'ch', glow = 1, grow = 1}) => {
  const f = useCurrentFrame();
  const id = useId().replace(/:/g, '');
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy);
  const n = Math.max(2, Math.floor(len / (link * 0.78)));
  const sway = Math.sin(f * 0.09 + rnd(seed) * 6) * 12 * swing;
  const ctrl: P = [(from[0] + to[0]) / 2 + sway, (from[1] + to[1]) / 2 + sag];
  const at = (t: number): P => [
    (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * ctrl[0] + t * t * to[0],
    (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * ctrl[1] + t * t * to[1],
  ];
  const links: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    if (t > grow) break;
    let [x, y] = at(t);
    const [x2, y2] = at(Math.min(1, t + 0.01));
    let ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    if (snap > 0) {
      // halves recoil and fall
      const side = t < breakAt ? -1 : 1;
      const k = Math.abs(t - breakAt);
      x += side * snap * 320 * (1 - k) + noise(seed + i, snap * 4) * 40 * snap;
      y += snap * snap * 420 * (0.4 + (1 - k));
      ang += side * snap * 120 * (1 - k);
      if (Math.abs(t - breakAt) < 0.5 / n) continue; // the broken link
    }
    const side = i % 2 === 1;
    links.push(
      <ellipse
        key={i}
        cx={x}
        cy={y}
        rx={link * 0.5}
        ry={side ? width * 0.45 : link * 0.27}
        fill="none"
        stroke={side ? '#b42320' : C.red}
        strokeWidth={width * (side ? 0.9 : 0.75)}
        transform={`rotate(${ang} ${x} ${y})`}
      />,
    );
  }
  return (
    <g>
      <defs>
        <filter id={`cg${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={4} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={glow > 0 ? `url(#cg${id})` : undefined} opacity={1 - Math.max(0, snap - 0.6) / 0.4}>{links}</g>
    </g>
  );
};

/* ---------------- PhoneMonster ---------------- */
export const PHONE_W = 120;
export const PHONE_H = 220;

/**
 * Smartphone with a red face. (x, y) = bottom centre of the phone in world px.
 * `chains`: number of chains drawn to `targets` (world points).
 */
export const PhoneMonster: React.FC<{
  x: number;
  y: number;
  scale?: number;
  glow?: number;
  roar?: number; // 0..1
  chains?: number;
  targets?: P[];
  chainSnap?: number;
  smirk?: number;
  eyes?: number;
  tilt?: number;
  laugh?: number; // 0..1 shakes and opens mouth rhythmically
  sulk?: number; // 0..1 pouty face (finale)
  chainSag?: number;
  chainGrow?: number;
  seed?: string;
}> = ({x, y, scale = 1, glow = 1, roar = 0, chains = 0, targets = [], chainSnap = 0, smirk = 1, eyes = 1, tilt = 0, laugh = 0, sulk = 0, chainSag = 50, chainGrow = 1, seed = 'pm'}) => {
  const f = useCurrentFrame();
  const id = useId().replace(/:/g, '');
  const k = scale * 0.5; // scale 6 ≈ two hero heights
  const w = wobbler(f, seed, 1 / k);
  const lj = laugh > 0 ? Math.sin(f * 1.6) * 3 * laugh : 0;
  const mouthOpen = clamp(roar + laugh * (0.4 + 0.4 * Math.abs(Math.sin(f * 0.8))));
  const shakeX = roar > 0.1 ? noise(seed + 'rx', f * 2) * 4 * roar : 0;
  // chain anchors in local units (sides + bottom of phone)
  const anchors: P[] = [
    [-PHONE_W / 2, -PHONE_H * 0.3],
    [PHONE_W / 2, -PHONE_H * 0.35],
    [-PHONE_W / 2, -PHONE_H * 0.6],
    [0, -6],
    [PHONE_W / 2, -PHONE_H * 0.62],
  ];
  const world = (p: P): P => {
    const a = (tilt * Math.PI) / 180;
    const px = p[0] * Math.cos(a) - p[1] * Math.sin(a);
    const py = p[0] * Math.sin(a) + p[1] * Math.cos(a);
    return [x + px * k, y + py * k];
  };
  const rings = roar > 0.05 ? [0, 1, 2].map((i) => ((f * 0.045 + i / 3) % 1)) : [];
  return (
    <g>
      {Array.from({length: Math.min(chains, targets.length)}).map((_, i) => (
        <Chain key={i} from={world(anchors[i % anchors.length])} to={targets[i]} sag={chainSag * (1 - 0.6 * Math.min(1, roar))} snap={chainSnap} seed={seed + 'c' + i} width={5 + k * 1.2} link={18 + k * 5} grow={chainGrow} />
      ))}
      <g transform={`translate(${x + shakeX} ${y + lj}) rotate(${tilt}) scale(${k})`}>
        <defs>
          <radialGradient id={`pmg${id}`}>
            <stop offset="0%" stopColor={C.red} stopOpacity={0.55} />
            <stop offset="100%" stopColor={C.red} stopOpacity={0} />
          </radialGradient>
          <filter id={`pmf${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={3} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {glow > 0 ? <ellipse cx={0} cy={-PHONE_H / 2} rx={PHONE_W * 1.6} ry={PHONE_H * 1.0} fill={`url(#pmg${id})`} opacity={glow * (0.85 + 0.15 * Math.sin(f * 0.2))} /> : null}
        {rings.map((r, i) => (
          <ellipse key={i} cx={0} cy={-PHONE_H * 0.32} rx={40 + r * 260} ry={30 + r * 200} fill="none" stroke={C.red} strokeWidth={6 * (1 - r)} opacity={(1 - r) * 0.7 * roar} />
        ))}
        <path d={rectPath(w, -PHONE_W / 2, -PHONE_H, PHONE_W, PHONE_H, 18)} fill="#1b1b21" stroke={C.ink} strokeWidth={3} />
        <path d={rectPath(w, -PHONE_W / 2 + 7, -PHONE_H + 14, PHONE_W - 14, PHONE_H - 28, 10)} fill="#2a0c0e" />
        <rect x={-14} y={-PHONE_H + 6} width={28} height={4} rx={2} fill="#33333b" />
        <g filter={`url(#pmf${id})`} transform={`translate(0 ${-PHONE_H * 0.55})`}>
          {/* eyes: narrow slanted */}
          <g transform={`scale(1 ${eyes})`}>
            {sulk > 0.5 ? (
              <>
                <path d="M -34 -14 Q -22 -6 -10 -14" stroke={C.red} strokeWidth={4} fill="none" strokeLinecap="round" />
                <path d="M 10 -14 Q 22 -6 34 -14" stroke={C.red} strokeWidth={4} fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d={`M -38 ${-24 - roar * 4} L -8 -8 L -34 -6 Z`} fill={C.red} />
                <path d={`M 38 ${-24 - roar * 4} L 8 -8 L 34 -6 Z`} fill={C.red} />
              </>
            )}
          </g>
          {sulk > 0.5 ? (
            <g>
              <path d="M -10 26 Q 0 18 10 26" stroke={C.red} strokeWidth={4} fill="none" strokeLinecap="round" />
              <circle cx={-26} cy={12} r={7} fill={C.red} opacity={0.35} />
              <circle cx={26} cy={12} r={7} fill={C.red} opacity={0.35} />
            </g>
          ) : mouthOpen > 0.05 ? (
            <g>
              <path d={`M -32 14 Q 0 ${14 + 50 * mouthOpen} 34 10 Q 0 ${18 + 8 * mouthOpen} -32 14 Z`} fill="#0a0000" stroke={C.red} strokeWidth={4} strokeLinejoin="round" />
              {[-20, -8, 4, 16].map((tx) => (
                <path key={tx} d={`M ${tx} ${15} l 5 ${8 + 4 * mouthOpen} l 5 ${-8 - 4 * mouthOpen} Z`} fill="#fff" opacity={0.9} />
              ))}
            </g>
          ) : (
            <path d={`M -30 14 Q -6 ${14 + 22 * smirk} 12 ${16 + 6 * smirk} Q 24 ${14 + 2 * smirk} 34 ${6 - 4 * smirk}`} stroke={C.red} strokeWidth={5} fill="none" strokeLinecap="round" />
          )}
        </g>
      </g>
    </g>
  );
};

/* ---------------- Dopamine spark ---------------- */
/** golden 4-point star flying from `from` to `to` along an arc; t 0..1 */
export const DopamineSpark: React.FC<{from: P; to: P; t: number; size?: number; arc?: number}> = ({from, to, t, size = 12, arc = -120}) => {
  if (t <= 0 || t >= 1.05) return null;
  const pos = (u: number): P => {
    const c: P = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + arc];
    return [(1 - u) * (1 - u) * from[0] + 2 * (1 - u) * u * c[0] + u * u * to[0], (1 - u) * (1 - u) * from[1] + 2 * (1 - u) * u * c[1] + u * u * to[1]];
  };
  const tt = Math.min(1, t);
  const [x, y] = pos(tt);
  const trail = [0.04, 0.08, 0.12, 0.16].map((d) => pos(Math.max(0, tt - d)));
  const s = size * (t > 1 ? (1.05 - t) * 20 : 1);
  return (
    <g>
      {trail.map(([tx, ty], i) => (
        <circle key={i} cx={tx} cy={ty} r={s * 0.35 * (1 - i * 0.2)} fill={C.gold} opacity={0.5 - i * 0.1} />
      ))}
      <circle cx={x} cy={y} r={s * 2.2} fill={C.gold} opacity={0.25} />
      <path d={`M ${x} ${y - s * 1.6} Q ${x + s * 0.25} ${y - s * 0.25} ${x + s * 1.6} ${y} Q ${x + s * 0.25} ${y + s * 0.25} ${x} ${y + s * 1.6} Q ${x - s * 0.25} ${y + s * 0.25} ${x - s * 1.6} ${y} Q ${x - s * 0.25} ${y - s * 0.25} ${x} ${y - s * 1.6} Z`} fill={C.gold} stroke="#fff3c4" strokeWidth={1} />
    </g>
  );
};
