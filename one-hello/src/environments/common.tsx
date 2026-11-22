import React, {useId} from 'react';
import {rnd} from '../lib';

export const uid = () => useId().replace(/:/g, '');

/** soft radial light */
export const Glow: React.FC<{cx: number; cy: number; r: number; color: string; opacity?: number; ry?: number}> = ({cx, cy, r, color, opacity = 0.5, ry}) => {
  const id = uid();
  return (
    <g>
      <defs>
        <radialGradient id={`g${id}`}>
          <stop offset="0%" stopColor={color} stopOpacity={1} />
          <stop offset="30%" stopColor={color} stopOpacity={0.55} />
          <stop offset="65%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={r} ry={ry ?? r} fill={`url(#g${id})`} opacity={opacity} />
    </g>
  );
};

/** vertical gradient rect */
export const VGrad: React.FC<{x: number; y: number; w: number; h: number; top: string; bottom: string; rx?: number; opacity?: number}> = ({x, y, w, h, top, bottom, rx = 0, opacity = 1}) => {
  const id = uid();
  return (
    <g opacity={opacity}>
      <defs>
        <linearGradient id={`v${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#v${id})`} />
    </g>
  );
};

/** soft contact shadow under objects/characters */
export const Contact: React.FC<{x: number; y: number; w: number; opacity?: number}> = ({x, y, w, opacity = 0.35}) => <Glow cx={x} cy={y} r={w} ry={w * 0.12} color="#000" opacity={opacity} />;

export type StreetMood = 'day' | 'grey' | 'night' | 'dawn' | 'dusk';

/** A street seen through a window / as backdrop: facades, road, a car, trees. */
export const StreetView: React.FC<{x: number; y: number; w: number; h: number; mood?: StreetMood; leaves?: number; seed?: string; carX?: number}> = ({x, y, w, h, mood = 'grey', leaves = 0, seed = 'sv', carX}) => {
  const id = uid();
  const sky = mood === 'night' ? ['#1a2130', '#2a3346'] : mood === 'dawn' ? ['#9fb6cf', '#f3c9a0'] : mood === 'day' ? ['#9cc9ec', '#d8ecf7'] : mood === 'dusk' ? ['#5c6780', '#c79a7c'] : ['#c7ccd1', '#e3e5e6'];
  const fac = mood === 'night' ? ['#2c2f38', '#353845', '#2a2c34'] : ['#b9a58c', '#c9c2b5', '#a89f95', '#d3cdc2', '#9fa7ad'];
  const win = mood === 'night' ? '#ffd48a' : '#8f9aa3';
  const roadY = y + h * 0.72;
  const blds = Array.from({length: 7}).map((_, i) => {
    const bw = w / 5.5;
    const bx = x - bw * 0.4 + i * bw * 0.95;
    const bh = h * (0.45 + rnd(seed + 'h' + i) * 0.35);
    return {bx, bw: bw * 0.92, bh, c: fac[i % fac.length]};
  });
  const cx = carX ?? x + w * 0.25;
  return (
    <g>
      <defs>
        <clipPath id={`c${id}`}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#c${id})`}>
        <VGrad x={x} y={y} w={w} h={h} top={sky[0]} bottom={sky[1]} />
        {blds.map((b, i) => (
          <g key={i}>
            <rect x={b.bx} y={roadY - b.bh} width={b.bw} height={b.bh} fill={b.c} />
            <rect x={b.bx} y={roadY - b.bh} width={b.bw} height={10} fill="#000" opacity={0.12} />
            {Array.from({length: 3}).map((_, r) =>
              Array.from({length: 3}).map((__, c) => {
                const lit = mood === 'night' ? rnd(seed + i + r + c) > 0.45 : true;
                return <rect key={r + '-' + c} x={b.bx + 14 + c * (b.bw - 28) / 3} y={roadY - b.bh + 24 + r * 46} width={(b.bw - 40) / 3} height={28} fill={lit ? win : '#1d1f26'} opacity={mood === 'night' ? 0.9 : 0.6} />;
              }),
            )}
            <rect x={b.bx + 8} y={roadY - 60} width={b.bw - 16} height={14} fill={['#a3483f', '#3f6a8a', '#5d7a52'][i % 3]} opacity={0.7} />
          </g>
        ))}
        <rect x={x} y={roadY} width={w} height={h} fill={mood === 'night' ? '#20232b' : '#8e9296'} />
        <rect x={x} y={roadY} width={w} height={10} fill={mood === 'night' ? '#2c3038' : '#b8bbbd'} />
        {/* parked car */}
        <g transform={`translate(${cx} ${roadY + 30})`}>
          <path d="M -70 0 L -64 -26 Q -50 -46 -20 -48 L 26 -48 Q 50 -46 62 -26 L 76 -20 L 76 0 Z" fill={mood === 'night' ? '#454a58' : '#d6d8da'} />
          <path d="M -44 -28 L -30 -42 L 20 -42 L 40 -28 Z" fill="#6e7c88" opacity={0.7} />
          <circle cx={-42} cy={2} r={13} fill="#222" />
          <circle cx={46} cy={2} r={13} fill="#222" />
        </g>
        {/* tree */}
        <g transform={`translate(${x + w * 0.78} ${roadY + 4})`}>
          <rect x={-5} y={-120} width={10} height={120} fill="#3b3530" />
          {Array.from({length: 7}).map((_, i) => (
            <circle key={i} cx={-40 + (i % 4) * 26} cy={-150 - Math.floor(i / 4) * 30 + (i % 2) * 10} r={30} fill={leaves > 0.5 ? ['#d9832f', '#e0a33d', '#c45b2a'][i % 3] : leaves > 0 ? '#9a9a6a' : '#7d8a6e'} opacity={0.9} />
          ))}
        </g>
        {mood === 'night' ? <rect x={x} y={y} width={w} height={h} fill="#0b1020" opacity={0.25} /> : null}
      </g>
    </g>
  );
};

/** A window frame with a street outside */
export const Window: React.FC<{x: number; y: number; w: number; h: number; mood?: StreetMood; mullions?: number; leaves?: number; frame?: string; seed?: string}> = ({x, y, w, h, mood = 'grey', mullions = 2, leaves = 0, frame = '#3d4046', seed}) => (
  <g>
    <StreetView x={x} y={y} w={w} h={h} mood={mood} leaves={leaves} seed={seed} />
    <rect x={x} y={y} width={w} height={h} fill="#fff" opacity={mood === 'night' ? 0.03 : 0.12} />
    <path d={`M ${x + w * 0.1} ${y + h} L ${x + w * 0.35} ${y}`} stroke="#fff" strokeWidth={30} opacity={0.06} />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={frame} strokeWidth={14} />
    {Array.from({length: mullions - 1}).map((_, i) => (
      <rect key={i} x={x + (w * (i + 1)) / mullions - 5} y={y} width={10} height={h} fill={frame} />
    ))}
    <rect x={x} y={y + h * 0.18} width={w} height={8} fill={frame} />
  </g>
);

/** pendant lamp with light */
export const PendantLamp: React.FC<{x: number; y: number; on?: number; color?: string; len?: number}> = ({x, y, on = 1, color = '#FFC873', len = 120}) => (
  <g>
    <line x1={x} y1={y - len} x2={x} y2={y} stroke="#2a2a2a" strokeWidth={3} />
    <path d={`M ${x - 46} ${y + 40} Q ${x} ${y - 20} ${x + 46} ${y + 40} Z`} fill="#2f3034" />
    <ellipse cx={x} cy={y + 40} rx={46} ry={8} fill={on > 0 ? '#fff2cf' : '#555'} />
    {on > 0 ? <Glow cx={x} cy={y + 90} r={260} color={color} opacity={0.35 * on} /> : null}
  </g>
);

/** floor + wall base for interiors */
export const Room: React.FC<{wall: string; wall2?: string; floor: string; floorY?: number}> = ({wall, wall2, floor, floorY = 820}) => (
  <g>
    <VGrad x={-800} y={-400} w={3600} h={floorY + 400} top={wall2 ?? wall} bottom={wall} />
    <VGrad x={-800} y={floorY} w={3600} h={900} top={floor} bottom="#111" />
    <rect x={-800} y={floorY - 6} width={3600} height={8} fill="#000" opacity={0.15} />
  </g>
);

/** street lamp */
export const StreetLamp: React.FC<{x: number; y: number; on?: number; h?: number}> = ({x, y, on = 1, h = 520}) => (
  <g>
    <rect x={x - 5} y={y - h} width={10} height={h} fill="#1c1d21" />
    <path d={`M ${x} ${y - h} q 40 -10 60 10`} stroke="#1c1d21" strokeWidth={8} fill="none" />
    <path d={`M ${x + 40} ${y - h + 6} L ${x + 80} ${y - h + 6} L ${x + 72} ${y - h + 22} L ${x + 48} ${y - h + 22} Z`} fill="#1c1d21" />
    {on > 0 ? (
      <>
        <ellipse cx={x + 60} cy={y - h + 22} rx={14} ry={5} fill="#fff1c4" opacity={on} />
        <Glow cx={x + 60} cy={y - h + 40} r={140} color="#FFD58A" opacity={0.55 * on} />
        <Glow cx={x + 60} cy={y + 4} r={200} ry={30} color="#FFD58A" opacity={0.25 * on} />
      </>
    ) : null}
  </g>
);

/** simple tree (trunk + round crown) */
export const Tree: React.FC<{x: number; y: number; s?: number; color?: string; color2?: string}> = ({x, y, s = 1, color = '#6f7d5e', color2 = '#5b6a4c'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -10 0 L -6 -160 L 6 -160 L 10 0 Z" fill="#3b3530" />
    {[[-50, -200, 70], [40, -210, 75], [0, -260, 80], [-20, -180, 60], [55, -170, 55]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? color2 : color} />
    ))}
  </g>
);
