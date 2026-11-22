import React from 'react';
import {useCurrentFrame} from 'remotion';
import {rnd} from '../lib';
import {Glow, VGrad} from './common';

/** green hill with a winding path, blue sky, distant town */
export const Hill: React.FC<{view?: 'top' | 'back'}> = ({view = 'top'}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <VGrad x={-800} y={-400} w={3600} h={1100} top="#5aa2e0" bottom="#cfe9f7" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${((200 + i * 700 + f * 0.4) % 2600) - 300} ${120 + i * 50})`} opacity={0.9}>
          <ellipse cx={0} cy={0} rx={110} ry={34} fill="#fff" />
          <ellipse cx={50} cy={-20} rx={70} ry={34} fill="#fff" />
        </g>
      ))}
      {view === 'top' ? (
        <g>
          {/* distant town */}
          {Array.from({length: 24}).map((_, i) => (
            <rect key={i} x={200 + i * 62} y={560 - rnd('tw' + i) * 40} width={46} height={40 + rnd('tw' + i) * 40} fill={['#d9cfc3', '#b9a99a', '#c96d5a'][i % 3]} opacity={0.8} />
          ))}
          <path d="M -800 600 Q 400 540 960 580 T 2700 590 L 2700 1500 L -800 1500 Z" fill="#8fc46a" />
          <path d="M -800 700 Q 600 640 1300 700 T 2700 720 L 2700 1500 L -800 1500 Z" fill="#7db85a" />
          <path d="M 940 1100 C 900 980 1060 900 1000 820 C 950 760 1040 700 980 640" stroke="#e8d8b0" strokeWidth={46} fill="none" strokeLinecap="round" />
          {[300, 1600, 1750].map((x, i) => (
            <g key={i} transform={`translate(${x} ${700 + i * 20})`}>
              <rect x={-6} y={-80} width={12} height={80} fill="#5a4636" />
              <circle cx={0} cy={-110} r={50} fill="#4f9a45" />
            </g>
          ))}
        </g>
      ) : (
        <g>
          <path d="M -800 520 Q 960 300 2700 520 L 2700 1500 L -800 1500 Z" fill="#86c062" />
          <path d="M 960 1200 C 900 1000 1020 800 960 520" stroke="#e8d8b0" strokeWidth={90} fill="none" strokeLinecap="round" />
        </g>
      )}
      {Array.from({length: 40}).map((_, i) => (
        <circle key={i} cx={rnd('fl' + i) * 1920} cy={760 + rnd('fy' + i) * 320} r={3} fill={['#fff', '#ffd24a', '#f28fb0'][i % 3]} />
      ))}
      <Glow cx={1600} cy={60} r={400} color="#fff6d0" opacity={0.4} />
    </g>
  );
};
