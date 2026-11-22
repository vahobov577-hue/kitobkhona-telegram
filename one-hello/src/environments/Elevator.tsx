import React from 'react';
import {FONT_TITLE} from '../theme';
import {Glow, VGrad} from './common';

/** inside the elevator, facing the doors' opposite wall */
export const Elevator: React.FC<{floor: number}> = ({floor}) => (
  <g>
    <VGrad x={-400} y={-200} w={2800} h={1400} top="#8f9396" bottom="#5f6366" />
    {Array.from({length: 5}).map((_, i) => (
      <g key={i}>
        <VGrad x={220 + i * 300} y={60} w={290} h={820} top="#b4b8bb" bottom="#7f8386" />
        <rect x={220 + i * 300} y={60} width={6} height={820} fill="#000" opacity={0.15} />
      </g>
    ))}
    <rect x={180} y={600} width={1560} height={14} rx={7} fill="#d5d8da" />
    <rect x={-400} y={880} width={2800} height={400} fill="#3c3e40" />
    {/* floor indicator */}
    <rect x={840} y={50} width={240} height={70} rx={8} fill="#141414" />
    <text x={960} y={102} textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={600} fontSize={46} fill="#ff6a4a">{floor}</text>
    <path d="M 1050 78 L 1062 94 L 1038 94 Z" fill="#ff6a4a" transform="rotate(180 1050 86)" />
    <Glow cx={960} cy={-80} r={700} color="#fff6e0" opacity={0.25} />
  </g>
);
