import React from 'react';
import {C} from '../theme';
import {rnd} from '../lib';

/** pigeon silhouette (pecking or flying) */
export const Pigeon: React.FC<{x: number; y: number; frame: number; s?: number; facing?: 1 | -1; fly?: number; seed?: string}> = ({x, y, frame, s = 1, facing = 1, fly = 0, seed = 'pg'}) => {
  const peck = fly > 0 ? 0 : Math.max(0, Math.sin(frame * 0.25 + rnd(seed) * 6)) * 10;
  const flap = Math.sin(frame * 1.4) * 40;
  return (
    <g transform={`translate(${x} ${y - fly * 300}) scale(${s * facing} ${s})`} fill={C.sil}>
      <ellipse cx={0} cy={-22} rx={26} ry={16} />
      <circle cx={22} cy={-36 + peck} r={9} />
      <path d={`M 30 ${-36 + peck} L 40 ${-33 + peck} L 30 ${-31 + peck} Z`} />
      <path d="M -24 -24 L -44 -18 L -24 -14 Z" />
      {fly > 0 ? (
        <g>
          <path d={`M -4 -30 Q -10 ${-60 - flap} -40 ${-50 - flap} Q -20 -36 -4 -24 Z`} />
          <path d={`M 4 -30 Q 10 ${-60 + flap} 30 ${-62 + flap} Q 16 -36 4 -24 Z`} />
        </g>
      ) : (
        <g>
          <rect x={-4} y={-8} width={3} height={10} />
          <rect x={6} y={-8} width={3} height={10} />
        </g>
      )}
      <circle cx={25} cy={-38 + peck} r={1.8} fill="#f4f4f0" />
    </g>
  );
};

/** cane for Arthur (hand item: from hand down to the floor) */
export const Cane: React.FC<{len?: number}> = ({len = 120}) => (
  <g>
    <path d={`M 0 0 L 6 ${len}`} stroke={C.sil} strokeWidth={6} strokeLinecap="round" />
    <path d="M -2 2 Q -2 -16 -16 -14" stroke={C.sil} strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);

/** sandwich hand item */
export const Sandwich: React.FC = () => (
  <g>
    <path d="M -22 -10 L 22 -10 L 18 6 L -18 6 Z" fill="#d9b97a" />
    <rect x={-22} y={-4} width={44} height={4} fill="#7fae5a" />
  </g>
);
