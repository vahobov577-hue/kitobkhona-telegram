import React from 'react';
import {Glow, Room, Window} from './common';

/** Sam's childhood room at night: small bed, posters, desk lamp */
export const ChildhoodRoom: React.FC = () => (
  <g>
    <Room wall="#4a5a6a" wall2="#56687a" floor="#3a3028" floorY={900} />
    <Window x={1240} y={170} w={420} h={360} mood="night" frame="#2a2a30" seed="cr" />
    {[[260, 220, '#c96d5a'], [460, 260, '#5a8ac9'], [660, 210, '#e2b24a']].map(([x, y, c], i) => (
      <g key={i}>
        <rect x={x as number} y={y as number} width={150} height={200} fill={c as string} opacity={0.6} />
        <circle cx={(x as number) + 75} cy={(y as number) + 80} r={34} fill="#fff" opacity={0.35} />
      </g>
    ))}
    <rect x={200} y={640} width={700} height={100} rx={12} fill="#6a7a8a" />
    <rect x={200} y={730} width={700} height={50} fill="#3a3a44" />
    <rect x={220} y={604} width={180} height={50} rx={22} fill="#d9d6cc" />
    <rect x={1000} y={660} width={420} height={18} fill="#5a4636" />
    <g transform="translate(1300 660)">
      <path d="M -40 -110 L 40 -110 L 28 -150 L -28 -150 Z" fill="#e8cf8a" />
      <rect x={-4} y={-110} width={8} height={110} fill="#222" />
      <Glow cx={0} cy={-60} r={320} color="#FFC873" opacity={0.55} />
    </g>
  </g>
);
