import React from 'react';
import {Glow, Tree, VGrad} from './common';

/** parents' small house at dusk: fence, the gate (open 0..1), lit window. `inWindow` = what we see inside */
export const HomeOutside: React.FC<{gate?: number; inWindow?: React.ReactNode; closer?: boolean}> = ({gate = 0, inWindow}) => (
  <g>
    <VGrad x={-800} y={-400} w={3600} h={1300} top="#4a5878" bottom="#e7a878" />
    <rect x={-800} y={760} width={3600} height={600} fill="#4a4a3a" />
    <Tree x={260} y={780} s={1.5} color="#c46a2a" color2="#d9832f" />
    {/* house */}
    <path d="M 760 360 L 1260 140 L 1760 360 Z" fill="#5a3a32" />
    <rect x={800} y={360} width={920} height={420} fill="#bda886" />
    <rect x={1460} y={520} width={150} height={260} fill="#4a3a2e" />
    <circle cx={1590} cy={650} r={7} fill="#c8a86a" />
    {/* window with parents inside */}
    <g>
      <rect x={920} y={440} width={400} height={240} fill="#ffcf7a" />
      <clipPath id="homewin">
        <rect x={920} y={440} width={400} height={240} />
      </clipPath>
      <g clipPath="url(#homewin)">{inWindow}</g>
      <rect x={920} y={440} width={400} height={240} fill="none" stroke="#3a2a22" strokeWidth={14} />
      <rect x={1114} y={440} width={12} height={240} fill="#3a2a22" />
      <Glow cx={1120} cy={560} r={360} color="#FFC873" opacity={0.45} />
    </g>
    {/* fence + gate */}
    {Array.from({length: 22}).map((_, i) => {
      const x = -100 + i * 60;
      if (x > 560 && x < 760) return null;
      return <rect key={i} x={x} y={700} width={30} height={170} fill="#6a5a48" />;
    })}
    <rect x={-120} y={740} width={2400} height={16} fill="#5a4a3a" />
    <rect x={-120} y={820} width={2400} height={16} fill="#5a4a3a" />
    <g transform={`translate(580 690) scale(${1 - gate * 0.7} 1)`}>
      <rect x={0} y={0} width={180} height={190} fill="#7a6a56" />
      <path d="M 0 0 L 180 190 M 180 0 L 0 190" stroke="#5a4a3a" strokeWidth={10} />
    </g>
    <rect x={-800} y={-400} width={3600} height={1600} fill="#1a1e2c" opacity={0.15} />
  </g>
);
