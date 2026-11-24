import React from 'react';
import {FONT_TITLE} from '../theme';

/** smart watch on a black silhouette wrist */
export const Watch: React.FC<{x: number; y: number; s?: number; km: string; min: string; rot?: number}> = ({x, y, s = 1, km, min, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -400 120 L 400 -60 L 420 60 L -380 240 Z" fill="#0E0E0E" />
    <rect x={-70} y={-200} width={140} height={400} rx={30} fill="#1a1b1e" />
    <rect x={-110} y={-130} width={220} height={260} rx={46} fill="#111214" />
    <rect x={-92} y={-112} width={184} height={224} rx={36} fill="#05070a" />
    <text x={0} y={-62} textAnchor="middle" fontFamily="Helvetica, Arial" fontSize={20} fill="#8a94a6">Sat, Nov 22</text>
    <text x={0} y={10} textAnchor="middle" fontFamily="Helvetica, Arial" fontWeight={700} fontSize={64} fill="#fff">{km}</text>
    <text x={0} y={42} textAnchor="middle" fontFamily="Helvetica, Arial" fontSize={22} fill="#8a94a6">km</text>
    <text x={0} y={84} textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={600} fontSize={28} fill="#7fd08a">{min}</text>
  </g>
);

/** digital clock (bedside) */
export const Clock: React.FC<{x: number; y: number; s?: number; time: string}> = ({x, y, s = 1, time}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-220} y={-110} width={440} height={220} rx={30} fill="#16171a" />
    <rect x={-196} y={-86} width={392} height={172} rx={18} fill="#0a0b0d" />
    <text x={0} y={40} textAnchor="middle" fontFamily="Helvetica, Arial" fontWeight={300} fontSize={120} fill="#ffb27a">{time}</text>
  </g>
);
