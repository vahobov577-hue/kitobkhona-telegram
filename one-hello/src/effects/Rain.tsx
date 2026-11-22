import React from 'react';
import {useCurrentFrame} from 'remotion';
import {rnd} from '../lib';

export const Rain: React.FC<{n?: number; amount?: number; seed?: string; color?: string; len?: number}> = ({n = 140, amount = 1, seed = 'rain', color = '#c9d3dc', len = 38}) => {
  const f = useCurrentFrame();
  return (
    <g opacity={amount}>
      {Array.from({length: n}).map((_, i) => {
        const x = rnd(seed + 'x' + i) * 2200 - 140;
        const sp = 34 + rnd(seed + 'v' + i) * 20;
        const y = ((rnd(seed + 'y' + i) * 1300 + f * sp) % 1300) - 120;
        return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + len} stroke={color} strokeWidth={1.6} opacity={0.35 + rnd(seed + 'o' + i) * 0.3} />;
      })}
    </g>
  );
};
