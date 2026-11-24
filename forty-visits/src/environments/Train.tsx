import React from 'react';
import {rnd} from '../lib';
import {Glow, Room, VGrad} from './common';

/** landscape strip seen from the train: city → fields → autumn trees (phase 0..1), scrolls with `offset` */
export const Landscape: React.FC<{x: number; y: number; w: number; h: number; offset: number; phase: number}> = ({x, y, w, h, offset, phase}) => {
  const id = `ls${Math.round(x)}${Math.round(y)}`;
  const city = Math.max(0, 1 - phase * 2.5);
  const autumn = Math.max(0, (phase - 0.45) * 2);
  return (
    <g>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <VGrad x={x} y={y} w={w} h={h} top="#f0b77a" bottom="#ffe0a8" />
        <Glow cx={x + w * 0.8} cy={y + h * 0.55} r={420} color="#ffd38a" opacity={0.9} />
        <circle cx={x + w * 0.8} cy={y + h * 0.55} r={50} fill="#fff1cf" />
        {/* far hills */}
        <path d={`M ${x} ${y + h * 0.62} Q ${x + w * 0.3} ${y + h * 0.5} ${x + w * 0.6} ${y + h * 0.6} T ${x + w} ${y + h * 0.58} L ${x + w} ${y + h} L ${x} ${y + h} Z`} fill="#c99a6a" opacity={0.7} />
        {/* mid layer: buildings or trees */}
        {Array.from({length: 16}).map((_, i) => {
          const px = x + ((((i * 180 - offset * 0.5) % (16 * 180)) + 16 * 180) % (16 * 180)) - 180;
          const hh = 60 + rnd('lb' + i) * 120;
          return (
            <g key={i}>
              <rect x={px} y={y + h * 0.7 - hh} width={120} height={hh} fill="#9d8a78" opacity={city} />
              <g opacity={1 - city}>
                <rect x={px + 56} y={y + h * 0.7 - 50} width={8} height={50} fill="#5a4636" />
                <circle cx={px + 60} cy={y + h * 0.7 - 70} r={40} fill={autumn > 0.3 ? ['#d9832f', '#e0a33d', '#c45b2a'][i % 3] : '#8aa85a'} />
              </g>
            </g>
          );
        })}
        <rect x={x} y={y + h * 0.7} width={w} height={h * 0.3} fill={city > 0.5 ? '#8a7f72' : '#c9b46a'} />
        {/* fast foreground poles */}
        {Array.from({length: 6}).map((_, i) => {
          const px = x + ((((i * 420 - offset * 2.2) % 2520) + 2520) % 2520) - 200;
          return <rect key={i} x={px} y={y} width={18} height={h} fill="#2a2420" opacity={0.85} />;
        })}
      </g>
    </g>
  );
};

/** wagon interior: windows (landscape inside), seats, golden light */
export const Wagon: React.FC<{offset: number; phase: number}> = ({offset, phase}) => (
  <g>
    <Room wall="#cdb894" wall2="#dcc8a4" floor="#6a5a48" floorY={920} />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <Landscape x={-100 + i * 720} y={180} w={560} h={360} offset={offset + i * 300} phase={phase} />
        <rect x={-100 + i * 720} y={180} width={560} height={360} fill="none" stroke="#7a6650" strokeWidth={18} rx={20} />
      </g>
    ))}
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(${-60 + i * 560} 920)`}>
        <rect x={0} y={-330} width={160} height={330} rx={20} fill="#7a3f32" />
        <rect x={0} y={-180} width={260} height={60} rx={14} fill="#8a4a3a" />
      </g>
    ))}
    <Glow cx={960} cy={400} r={1100} color="#FFC873" opacity={0.3} />
  </g>
);
