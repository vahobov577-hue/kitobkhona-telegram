import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Glow, Room, VGrad, Window} from './common';
import {StreetMood} from './common';

export type AptMood = 'dark' | 'day' | 'warm';
export const TABLE_Y = 640;

/** living room: wall, window, shelf, floor lamp */
export const AptRoom: React.FC<{mood?: AptMood; windowMood?: StreetMood}> = ({mood = 'dark', windowMood}) => {
  const wall = mood === 'dark' ? '#2a2c31' : mood === 'warm' ? '#d9c6a8' : '#cfccc5';
  const wall2 = mood === 'dark' ? '#33363d' : mood === 'warm' ? '#e8d6b6' : '#e2e0db';
  return (
    <g>
      <Room wall={wall} wall2={wall2} floor={mood === 'dark' ? '#1c1d21' : '#8a7660'} floorY={860} />
      <Window x={1180} y={150} w={520} h={460} mood={windowMood ?? (mood === 'dark' ? 'night' : 'day')} mullions={2} frame={mood === 'dark' ? '#17181c' : '#5b5d61'} seed="apt" />
      {/* shelf with books */}
      <rect x={260} y={300} width={420} height={12} fill={mood === 'dark' ? '#3a3c42' : '#8a7a68'} />
      {Array.from({length: 9}).map((_, i) => (
        <rect key={i} x={280 + i * 40} y={300 - 60 - (i % 3) * 8} width={28} height={60 + (i % 3) * 8} fill={['#6d5a4a', '#4b5d6b', '#7a6b4e', '#5d4b5f'][i % 4]} opacity={mood === 'dark' ? 0.5 : 1} />
      ))}
      <rect x={340} y={420} width={180} height={140} fill={mood === 'dark' ? '#3a3c42' : '#efe9dc'} />
      <rect x={352} y={432} width={156} height={116} fill={mood === 'dark' ? '#25272c' : '#9db0a2'} />
      {/* floor lamp */}
      <g transform="translate(1880 860)">
        <rect x={-4} y={-420} width={8} height={420} fill="#141416" />
        <path d="M -50 -400 L 50 -400 L 34 -470 L -34 -470 Z" fill={mood === 'warm' ? '#f6d9a0' : '#3a3b40'} />
        {mood === 'warm' ? <Glow cx={0} cy={-420} r={320} color="#FFC873" opacity={0.5} /> : null}
      </g>
      {mood === 'warm' ? <Glow cx={960} cy={300} r={1000} color="#FFC873" opacity={0.25} /> : null}
    </g>
  );
};

/** table with a small cake; the candle can be lit (0..1) */
export const TableCake: React.FC<{x?: number; candle?: number; cake?: boolean; phone?: 'none' | 'down' | 'up'; buzz?: number}> = ({x = 960, candle = 1, cake = true, phone = 'none', buzz = 0}) => {
  const f = useCurrentFrame();
  const flick = 0.85 + 0.15 * Math.sin(f * 0.9) * Math.sin(f * 0.37);
  return (
    <g>
      <rect x={x - 380} y={TABLE_Y} width={760} height={18} fill="#4a3d33" />
      <rect x={x - 360} y={TABLE_Y + 18} width={16} height={240} fill="#3a2f27" />
      <rect x={x + 344} y={TABLE_Y + 18} width={16} height={240} fill="#3a2f27" />
      {cake ? (
        <g transform={`translate(${x + 60} ${TABLE_Y})`}>
          <ellipse cx={0} cy={0} rx={80} ry={10} fill="#dcd6cc" />
          <rect x={-56} y={-56} width={112} height={56} rx={8} fill="#efe7dc" />
          <path d="M -56 -40 Q -42 -28 -28 -40 Q -14 -28 0 -40 Q 14 -28 28 -40 Q 42 -28 56 -40" stroke="#d6a8a8" strokeWidth={6} fill="none" />
          <rect x={-4} y={-90} width={8} height={34} fill="#9ec4e0" />
          {candle > 0 ? (
            <g opacity={candle}>
              <Glow cx={0} cy={-100} r={260 * flick} color="#FFC873" opacity={0.55} />
              <path d={`M 0 ${-118 - 4 * flick} Q 7 -102 0 -94 Q -7 -102 0 ${-118 - 4 * flick} Z`} fill="#ffe7a8" />
            </g>
          ) : null}
        </g>
      ) : null}
      {phone !== 'none' ? (
        <g transform={`translate(${x - 160 + (buzz ? Math.sin(f * 2.5) * 3 : 0)} ${TABLE_Y - 6})`}>
          <rect x={-46} y={-8} width={92} height={10} rx={4} fill="#111" />
          {phone === 'up' ? <Glow cx={0} cy={-10} r={90} color="#cfe0ff" opacity={0.6} /> : null}
        </g>
      ) : null}
    </g>
  );
};

/** kitchen corner with the fridge (papers can be passed as children in fridge-door coordinates) */
export const Kitchen: React.FC<{mood?: AptMood; children?: React.ReactNode; windowMood?: StreetMood; leaves?: number}> = ({mood = 'day', children, windowMood, leaves = 0}) => (
  <g>
    <Room wall={mood === 'dark' ? '#2a2c31' : '#cfcdc8'} wall2={mood === 'dark' ? '#33363d' : '#e4e3df'} floor={mood === 'dark' ? '#1c1d21' : '#9a9590'} floorY={900} />
    {/* fridge */}
    <g transform="translate(560 900)">
      <VGrad x={-230} y={-760} w={460} h={760} top="#f1f1ef" bottom="#c9c9c6" rx={14} />
      <rect x={-230} y={-500} width={460} height={6} fill="#000" opacity={0.12} />
      <rect x={-200} y={-460} width={10} height={160} rx={5} fill="#b9b9b6" />
      <rect x={-200} y={-720} width={10} height={160} rx={5} fill="#b9b9b6" />
      <circle cx={-120} cy={-700} r={10} fill="#4b6a8a" />
      <circle cx={130} cy={-700} r={10} fill="#5d8a5d" />
      <g transform="translate(0 -600)">{children}</g>
    </g>
    {/* light switch */}
    <rect x={130} y={460} width={34} height={56} rx={4} fill="#efefec" />
    <rect x={142} y={474} width={10} height={20} rx={2} fill="#cfcfcc" />
    {/* counter + window */}
    <rect x={820} y={600} width={1300} height={300} fill={mood === 'dark' ? '#2e3036' : '#bdb8b0'} />
    <rect x={820} y={590} width={1300} height={16} fill={mood === 'dark' ? '#3b3d44' : '#e8e6e1'} />
    <Window x={1080} y={140} w={560} h={380} mood={windowMood ?? (mood === 'dark' ? 'night' : 'grey')} leaves={leaves} frame="#4a4c50" seed="kit" />
    <rect x={1700} y={480} width={120} height={110} rx={8} fill="#8f8f8b" />
  </g>
);

/** front door (opens: 0..1) with warm light behind */
export const FrontDoor: React.FC<{x: number; open?: number; warm?: boolean}> = ({x, open = 0, warm = true}) => (
  <g>
    <rect x={x - 120} y={340} width={240} height={520} fill={warm ? '#ffd79a' : '#cfcfcf'} />
    {open > 0 && warm ? <Glow cx={x} cy={600} r={500} color="#FFC873" opacity={0.6 * open} /> : null}
    <g transform={`translate(${x - 120} 340) scale(${1 - open * 0.85} 1)`}>
      <rect x={0} y={0} width={240} height={520} fill="#5a4a3e" />
      <rect x={24} y={30} width={192} height={200} fill="none" stroke="#000" strokeOpacity={0.2} strokeWidth={4} />
      <rect x={24} y={270} width={192} height={220} fill="none" stroke="#000" strokeOpacity={0.2} strokeWidth={4} />
      <circle cx={210} cy={270} r={9} fill="#c8a86a" />
    </g>
    <rect x={x - 132} y={330} width={264} height={14} fill="#3a2f27" />
    <rect x={x - 132} y={330} width={14} height={530} fill="#3a2f27" />
    <rect x={x + 118} y={330} width={14} height={530} fill="#3a2f27" />
  </g>
);
