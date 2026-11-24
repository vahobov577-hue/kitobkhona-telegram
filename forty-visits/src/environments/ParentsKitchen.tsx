import React from 'react';
import {C} from '../theme';
import {Glow, Room, VGrad, Window} from './common';

/** mom's warm kitchen: yellow pendant lamp, cabinets, window, table. `lampExempt` = lamp drawn separately (ungraded) */
export const MomKitchen: React.FC<{noLampGlow?: boolean; table?: boolean}> = ({noLampGlow = false, table = true}) => (
  <g>
    <Room wall="#cdb78f" wall2="#dcc8a2" floor="#7a6248" floorY={900} />
    <Window x={1250} y={170} w={440} h={360} mood="dusk" frame="#5a4636" seed="mk" />
    <rect x={-300} y={140} width={1300} height={230} fill="#a88c66" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-280 + i * 320} y={156} width={300} height={198} fill="none" stroke="#000" strokeOpacity={0.15} strokeWidth={4} />
    ))}
    <rect x={-300} y={560} width={1350} height={340} fill="#b39a74" />
    <rect x={-300} y={548} width={1350} height={16} fill="#e9dcc4" />
    {/* hanging lamp */}
    <line x1={960} y1={-100} x2={960} y2={180} stroke="#2a2a2a" strokeWidth={4} />
    <path d="M 900 240 Q 960 160 1020 240 Z" fill="#3a3030" />
    <ellipse cx={960} cy={240} rx={60} ry={10} fill="#fff1c4" />
    {noLampGlow ? null : <Glow cx={960} cy={420} r={700} color={C.momLamp} opacity={0.45} />}
    {table ? (
      <g>
        <rect x={560} y={700} width={800} height={20} fill="#6a4a36" />
        <rect x={590} y={720} width={18} height={180} fill="#5a3e2e" />
        <rect x={1312} y={720} width={18} height={180} fill="#5a3e2e" />
        <VGrad x={560} y={680} w={800} h={24} top="#f3e9d6" bottom="#e2d3b8" />
      </g>
    ) : null}
  </g>
);

/** the lamp glow alone (to draw outside the colour grade so mom's light stays warm) */
export const MomLampGlow: React.FC<{x?: number; y?: number; k?: number}> = ({x = 960, y = 420, k = 1}) => (
  <g>
    <Glow cx={x} cy={y} r={720} color={C.momLamp} opacity={0.5 * k} />
    <Glow cx={x} cy={y - 180} r={160} color="#fff1c4" opacity={0.7 * k} />
  </g>
);
export {VGrad};
