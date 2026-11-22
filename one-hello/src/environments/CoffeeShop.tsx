import React from 'react';
import {FONT_HAND} from '../theme';
import {Glow, PendantLamp, Room, VGrad, Window} from './common';

export const COUNTER_Y = 640;

/** View towards the barista: shelves, menu board, machine, lamps (seen behind Mia). */
export const CoffeeBack: React.FC<{leaves?: number; lampsOn?: number}> = ({lampsOn = 1}) => (
  <g>
    <Room wall="#d9d6cf" wall2="#ecebe7" floor="#7b6f63" floorY={900} />
    {/* shelves with cups */}
    {[260, 380].map((sy, r) => (
      <g key={r}>
        <rect x={420} y={sy} width={1080} height={12} fill="#8a7a68" />
        {Array.from({length: 14}).map((_, i) => (
          <g key={i} transform={`translate(${450 + i * 75} ${sy})`}>
            <path d="M -18 0 L -15 -40 L 15 -40 L 18 0 Z" fill={['#f4f2ee', '#cfd6d9', '#e2d3c0'][(i + r) % 3]} />
            <path d="M 16 -30 q 12 0 10 12 q -2 10 -12 8" stroke="#bdbab4" strokeWidth={4} fill="none" />
          </g>
        ))}
      </g>
    ))}
    {/* menu board */}
    <rect x={1540} y={150} width={330} height={360} rx={8} fill="#2b2d2f" />
    <text x={1705} y={215} textAnchor="middle" fontFamily={FONT_HAND} fontSize={46} fill="#efece4">MENU</text>
    {['ESPRESSO 3', 'LATTE 4', 'FLAT WHITE 4', 'TEA 3', 'CROISSANT 3'].map((m, i) => (
      <text key={i} x={1570} y={275 + i * 48} fontFamily={FONT_HAND} fontSize={30} fill="#d8d4ca">{m}</text>
    ))}
    {/* back counter + espresso machine */}
    <rect x={300} y={560} width={1350} height={20} fill="#9a8b79" />
    <rect x={300} y={580} width={1350} height={320} fill="#b9ad9e" />
    <g transform="translate(1250 560)">
      <rect x={-120} y={-170} width={240} height={170} rx={14} fill="#9fa4a8" />
      <rect x={-120} y={-190} width={240} height={26} rx={8} fill="#7d8287" />
      <rect x={-90} y={-130} width={180} height={50} rx={8} fill="#c9ccce" />
      <rect x={-60} y={-60} width={14} height={40} fill="#3a3a3a" />
      <rect x={46} y={-60} width={14} height={40} fill="#3a3a3a" />
    </g>
    <rect x={-400} y={150} width={720} height={420} fill="#cfcac1" />
    <Window x={-300} y={170} w={560} h={360} mood="grey" />
    {[700, 1100].map((x) => (
      <PendantLamp key={x} x={x} y={120} on={lampsOn} />
    ))}
  </g>
);

/** View towards the entrance: big window to the street, tables (seen behind Leo). */
export const CoffeeFront: React.FC<{mood?: 'grey' | 'day' | 'dusk'; leaves?: number; lampsOn?: number}> = ({mood = 'grey', leaves = 0, lampsOn = 1}) => (
  <g>
    <Room wall="#d4d1ca" wall2="#e8e6e1" floor="#7b6f63" floorY={900} />
    <rect x={180} y={120} width={1560} height={560} fill="#c2bdb4" />
    <Window x={200} y={140} w={1520} h={520} mood={mood} mullions={3} leaves={leaves} frame="#3a3c40" />
    {/* window boxes (like the shoe boxes in the reference) */}
    {[420, 1280].map((x) => (
      <rect key={x} x={x} y={600} width={170} height={70} fill="#f1efea" />
    ))}
    {[560, 1360].map((x) => (
      <PendantLamp key={x} x={x} y={70} on={lampsOn} len={80} />
    ))}
    <rect x={-400} y={120} width={560} height={780} fill="#cfcac1" />
    <rect x={1760} y={120} width={700} height={780} fill="#cfcac1" />
  </g>
);

/** the counter: white top + ribbed front panel (foreground of the barista, background of customer shots) */
export const Counter: React.FC<{y?: number; x0?: number; x1?: number; withCups?: boolean}> = ({y = COUNTER_Y, x0 = -400, x1 = 2400, withCups = true}) => (
  <g>
    <VGrad x={x0} y={y + 22} w={x1 - x0} h={600} top="#c9c6c0" bottom="#8e8b86" />
    {Array.from({length: Math.floor((x1 - x0) / 26)}).map((_, i) => (
      <rect key={i} x={x0 + i * 26} y={y + 30} width={4} height={600} fill="#000" opacity={0.12} />
    ))}
    <rect x={x0} y={y} width={x1 - x0} height={24} fill="#f2f1ee" />
    <rect x={x0} y={y + 22} width={x1 - x0} height={6} fill="#000" opacity={0.15} />
    {withCups ? (
      <g>
        <g transform={`translate(1380 ${y})`}>
          <rect x={-60} y={-60} width={120} height={60} rx={6} fill="#e9e6df" />
          <text x={0} y={-24} textAnchor="middle" fontFamily={FONT_HAND} fontSize={22} fill="#5a554d">TIPS</text>
        </g>
        <g transform={`translate(470 ${y})`}>
          <path d="M -30 0 L -26 -50 L 26 -50 L 30 0 Z" fill="#f6f4ef" />
          <rect x={-30} y={-36} width={60} height={14} fill="#b48a62" />
        </g>
      </g>
    ) : null}
  </g>
);

/** cork board with the run-club flyer */
export const FlyerBoard: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-200} width={520} height={400} rx={6} fill="#b58b5e" />
    <rect x={-250} y={-190} width={500} height={380} fill="#c49a6a" />
    <rect x={-220} y={-160} width={150} height={110} fill="#efe9dc" transform="rotate(-4)" />
    <rect x={90} y={-150} width={130} height={150} fill="#e5ecef" transform="rotate(5)" />
    <g transform="rotate(-2)">
      <rect x={-130} y={-70} width={260} height={240} fill="#fbfaf6" />
      <text x={0} y={-10} textAnchor="middle" fontFamily={FONT_HAND} fontSize={30} fill="#222">SATURDAY</text>
      <text x={0} y={30} textAnchor="middle" fontFamily={FONT_HAND} fontSize={38} fill="#D9443A">RUN CLUB</text>
      <text x={0} y={80} textAnchor="middle" fontFamily={FONT_HAND} fontSize={30} fill="#222">7:00</text>
      <text x={0} y={120} textAnchor="middle" fontFamily={FONT_HAND} fontSize={24} fill="#555">ALL PACES</text>
      <circle cx={0} cy={-56} r={7} fill="#D9443A" />
    </g>
  </g>
);

export {Glow};
