import React from 'react';
import {Glow, StreetLamp, Tree, VGrad} from './common';
import {Houses} from './Street';
import {Rain} from '../effects/Rain';

export const BENCH_Y = 860;

/** city park: skyline, trees, path, lamp, the bench */
export const Park: React.FC<{mood?: 'grey' | 'day' | 'rain'; leaves?: number; bench?: boolean}> = ({mood = 'grey', leaves = 0, bench = true}) => {
  const day = mood === 'day';
  const leafCol = leaves > 0.5 ? ['#d9832f', '#e0a33d'] : day ? ['#6aa84f', '#5a9a42'] : ['#7d8a6e', '#6a785c'];
  return (
    <g>
      <VGrad x={-800} y={-400} w={3600} h={1300} top={day ? '#8ec5f0' : mood === 'rain' ? '#8f969c' : '#b7bcc1'} bottom={day ? '#d8ecf8' : '#d3d6d8'} />
      <Houses sky={day ? 'day' : 'grey'} y={680} scale={0.9} seed="pk" />
      <rect x={-800} y={680} width={3600} height={700} fill={day ? '#8ec46a' : '#9aa08e'} />
      <path d="M -800 980 Q 960 900 2700 990 L 2700 1100 L -800 1100 Z" fill={day ? '#d8c9a8' : '#bdb6a6'} />
      {[-200, 300, 1500, 2000].map((x, i) => (
        <Tree key={i} x={x} y={720} s={1.3} color={leafCol[0]} color2={leafCol[1]} />
      ))}
      <StreetLamp x={1350} y={900} on={0} h={600} />
      {bench ? (
        <g>
          <rect x={560} y={BENCH_Y - 150} width={800} height={22} rx={6} fill="#5a4a3a" />
          <rect x={560} y={BENCH_Y - 112} width={800} height={22} rx={6} fill="#5a4a3a" />
          <rect x={540} y={BENCH_Y - 62} width={840} height={26} rx={6} fill="#6a5644" />
          <rect x={600} y={BENCH_Y - 40} width={16} height={60} fill="#2a2a2a" />
          <rect x={1300} y={BENCH_Y - 40} width={16} height={60} fill="#2a2a2a" />
        </g>
      ) : null}
      {mood === 'rain' ? (
        <>
          <rect x={-800} y={-400} width={3600} height={1600} fill="#2a3038" opacity={0.25} />
          <Rain n={160} />
        </>
      ) : null}
      {day ? <Glow cx={1700} cy={0} r={500} color="#fff6d0" opacity={0.4} /> : null}
    </g>
  );
};

/** umbrella over the bench (hand item style, drawn in world coords) */
export const Umbrella: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -260 0 Q 0 -180 260 0 Q 200 -20 130 0 Q 65 -20 0 0 Q -65 -20 -130 0 Q -200 -20 -260 0 Z" fill="#2c2f36" />
    <path d="M 0 0 L 0 300" stroke="#1a1a1a" strokeWidth={8} />
  </g>
);
