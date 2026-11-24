import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT_TITLE} from '../theme';
import {Glow, Room, VGrad, Window} from './common';

/** S1/S35: the office desk seen from above (the phone is drawn by the shot on top) */
export const DeskTop: React.FC<{lamp?: number}> = ({lamp = 0}) => (
  <g>
    <VGrad x={-600} y={-400} w={3200} h={1900} top="#8f8b84" bottom="#6f6b65" />
    {Array.from({length: 16}).map((_, i) => (
      <path key={i} d={`M -600 ${-300 + i * 110} Q 960 ${-260 + i * 110} 2600 ${-310 + i * 110}`} stroke="#000" strokeOpacity={0.05} strokeWidth={14} fill="none" />
    ))}
    {/* keyboard */}
    <g transform="translate(250 140) rotate(-8)">
      <rect x={-330} y={-110} width={660} height={220} rx={18} fill="#d8d6d1" />
      {Array.from({length: 4}).map((_, r) =>
        Array.from({length: 12}).map((__, c) => <rect key={r + '-' + c} x={-310 + c * 52} y={-92 + r * 50} width={44} height={40} rx={6} fill="#f1f0ec" />),
      )}
    </g>
    {/* mug */}
    <g transform="translate(1600 260)">
      <circle r={90} fill="#e9e6df" />
      <circle r={70} fill="#4a3224" />
      <path d="M 86 -20 Q 140 0 86 30" stroke="#e9e6df" strokeWidth={22} fill="none" />
    </g>
    {/* papers */}
    <rect x={1340} y={620} width={460} height={560} fill="#f6f5f1" transform="rotate(10 1570 900)" />
    <rect x={1390} y={660} width={460} height={560} fill="#fbfaf7" transform="rotate(4 1620 940)" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={1440} y={720 + i * 46} width={300 - (i % 3) * 50} height={10} fill="#cfcdc7" transform="rotate(4 1620 940)" />
    ))}
    {lamp > 0 ? <Glow cx={960} cy={540} r={900} color="#FFC24A" opacity={0.25 * lamp} /> : null}
  </g>
);

/** open-plan office at night: monitors, windows, the boss in the doorway */
export const OfficeNight: React.FC<{clock?: string}> = ({clock = '21:40'}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <Room wall="#2a2d33" wall2="#33363d" floor="#1c1d21" floorY={880} />
      <Window x={-200} y={120} w={900} h={480} mood="night" mullions={3} frame="#16171b" seed="off1" />
      <Window x={760} y={120} w={620} h={480} mood="night" mullions={2} frame="#16171b" seed="off2" />
      {/* door with boss light */}
      <rect x={1520} y={300} width={260} height={580} fill="#e9e2cf" />
      <Glow cx={1650} cy={700} r={420} color="#efe6cf" opacity={0.35} />
      {/* wall clock */}
      <g transform="translate(1460 200)">
        <rect x={-90} y={-36} width={180} height={72} rx={10} fill="#141518" />
        <text x={0} y={18} textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={600} fontSize={48} fill="#ff6a4a">{clock}</text>
      </g>
      {/* rows of desks with monitors */}
      {[0, 1].map((r) =>
        Array.from({length: 5}).map((_, i) => {
          const x = 120 + i * 300 + r * 120;
          const y = 640 + r * 140;
          const on = (i + r) % 3 === 0;
          return (
            <g key={r + '-' + i} opacity={r ? 1 : 0.8}>
              <rect x={x - 120} y={y} width={240} height={16} fill="#3a3c42" />
              <rect x={x - 6} y={y - 40} width={12} height={40} fill="#2c2e33" />
              <rect x={x - 70} y={y - 120} width={140} height={84} rx={6} fill={on ? '#aecbe0' : '#22252b'} />
              {on ? <Glow cx={x} cy={y - 80} r={160} color="#bcd8ff" opacity={0.35 + 0.05 * Math.sin(f * 0.3 + i)} /> : null}
            </g>
          );
        }),
      )}
    </g>
  );
};
