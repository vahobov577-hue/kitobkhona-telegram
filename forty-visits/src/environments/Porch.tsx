import React from 'react';
import {Glow, VGrad} from './common';

/** evening porch: steps, railing, porch light, dusk sky */
export const Porch: React.FC = () => (
  <g>
    <VGrad x={-800} y={-400} w={3600} h={1300} top="#2c3550" bottom="#d98a6a" />
    <rect x={-800} y={700} width={3600} height={500} fill="#3a3a30" />
    <rect x={200} y={-100} width={1600} height={820} fill="#bda886" />
    <rect x={1200} y={260} width={240} height={460} fill="#4a3a2e" />
    <rect x={400} y={300} width={360} height={240} fill="#ffcf7a" />
    <rect x={400} y={300} width={360} height={240} fill="none" stroke="#3a2a22" strokeWidth={12} />
    <rect x={-300} y={720} width={2400} height={30} fill="#7a6650" />
    <rect x={-300} y={750} width={2400} height={50} fill="#6a5644" />
    <rect x={-300} y={800} width={2400} height={60} fill="#5a4636" />
    {Array.from({length: 14}).map((_, i) => (
      <rect key={i} x={-200 + i * 170} y={560} width={16} height={160} fill="#6a5644" />
    ))}
    <rect x={-300} y={550} width={2400} height={18} fill="#7a6650" />
    <g transform="translate(1500 230)">
      <rect x={-20} y={-30} width={40} height={50} rx={6} fill="#2a2420" />
      <Glow cx={0} cy={0} r={300} color="#FFC873" opacity={0.6} />
    </g>
  </g>
);
