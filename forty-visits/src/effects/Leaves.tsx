import React from 'react';
import {useCurrentFrame} from 'remotion';
import {rnd} from '../lib';

const COLORS = ['#E08A3A', '#D9692E', '#F0A04B', '#C9562A', '#E8B04A'];

/** falling autumn leaves (amount 0..1) */
export const Leaves: React.FC<{n?: number; amount?: number; seed?: string; x0?: number; x1?: number; y0?: number; y1?: number; size?: number}> = ({n = 24, amount = 1, seed = 'lv', x0 = 0, x1 = 1920, y0 = -60, y1 = 1100, size = 1}) => {
  const f = useCurrentFrame();
  const h = y1 - y0;
  return (
    <g opacity={amount}>
      {Array.from({length: n}).map((_, i) => {
        const sp = 1.2 + rnd(seed + 's' + i) * 1.6;
        const y = y0 + ((rnd(seed + 'y' + i) * h + f * sp) % h);
        const x = x0 + rnd(seed + 'x' + i) * (x1 - x0) + Math.sin(f * 0.05 + i) * 30;
        const r = f * (2 + rnd(seed + 'r' + i) * 4) + i * 40;
        return <path key={i} d="M 0 -9 Q 7 -3 0 9 Q -7 -3 0 -9 Z" fill={COLORS[i % COLORS.length]} transform={`translate(${x} ${y}) rotate(${r}) scale(${size * (0.8 + rnd(seed + 'z' + i) * 0.7)})`} />;
      })}
    </g>
  );
};
