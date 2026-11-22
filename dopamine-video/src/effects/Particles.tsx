import React from 'react';
import {rnd} from '../lib';

/** Radial burst of particles (sparks, chain fragments, dust). t = frames since burst. */
export const Burst: React.FC<{x: number; y: number; t: number; n?: number; color?: string; speed?: number; life?: number; gravity?: number; seed?: string; size?: number; shape?: 'dot' | 'spark' | 'link'}> = ({
  x,
  y,
  t,
  n = 30,
  color = '#FFC94D',
  speed = 14,
  life = 40,
  gravity = 0.35,
  seed = 'burst',
  size = 5,
  shape = 'dot',
}) => {
  if (t < 0 || t > life) return null;
  const p = t / life;
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const a = rnd(seed + 'a' + i) * Math.PI * 2;
        const v = speed * (0.4 + rnd(seed + 'v' + i));
        const px = x + Math.cos(a) * v * t;
        const py = y + Math.sin(a) * v * t + gravity * t * t;
        const s = size * (0.5 + rnd(seed + 's' + i)) * (1 - p * 0.6);
        const op = 1 - p;
        if (shape === 'spark') {
          const len = s * 3;
          return <line key={i} x1={px} y1={py} x2={px - Math.cos(a) * len} y2={py - Math.sin(a) * len} stroke={color} strokeWidth={s * 0.6} strokeLinecap="round" opacity={op} />;
        }
        if (shape === 'link') {
          return <ellipse key={i} cx={px} cy={py} rx={s * 1.6} ry={s} fill="none" stroke={color} strokeWidth={s * 0.5} opacity={op} transform={`rotate(${rnd(seed + 'r' + i) * 360 + t * 12} ${px} ${py})`} />;
        }
        return <circle key={i} cx={px} cy={py} r={s} fill={color} opacity={op} />;
      })}
    </g>
  );
};
