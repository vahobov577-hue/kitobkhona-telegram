import React from 'react';
import {C, FONT_HAND, FONT_TITLE} from '../theme';
import {clamp} from '../lib';

export type Cell = 'empty' | 'x' | 'check' | 'today' | 'missed';

/** paper calendar: title + 7×5 grid. `state(i)` per cell (31 cells), `draw` 0..1 animates the last mark */
export const CalendarSheet: React.FC<{x: number; y: number; s?: number; title: string; cells: Cell[]; drawIdx?: number; draw?: number; rot?: number; label?: (i: number) => string | undefined; cellColor?: (i: number) => string | undefined}> = ({x, y, s = 1, title, cells, drawIdx = -1, draw = 1, rot = 0, label, cellColor}) => {
  const W = 520;
  const H = 640;
  const cw = (W - 40) / 7;
  const ch = 82;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-W / 2 + 8} y={-H / 2 + 10} width={W} height={H} fill="#000" opacity={0.18} />
      <rect x={-W / 2} y={-H / 2} width={W} height={H} fill="#fbfaf6" />
      <text x={0} y={-H / 2 + 62} textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={600} fontSize={40} letterSpacing={3} fill="#222">{title}</text>
      <rect x={-W / 2 + 20} y={-H / 2 + 86} width={W - 40} height={4} fill="#222" strokeDasharray="10 8" />
      {cells.map((st, i) => {
        const cx = -W / 2 + 20 + (i % 7) * cw;
        const cy = -H / 2 + 110 + Math.floor(i / 7) * ch;
        const k = i === drawIdx ? clamp(draw) : 1;
        const base = cellColor?.(i) ?? (st === 'check' ? '#dff2e3' : st === 'missed' ? '#f1f1ef' : '#e9eef3');
        return (
          <g key={i}>
            <rect x={cx + 4} y={cy + 4} width={cw - 8} height={ch - 8} fill={base} stroke={st === 'today' ? '#222' : '#c9ccd0'} strokeWidth={st === 'today' ? 4 : 1.5} />
            {label?.(i) ? <text x={cx + cw / 2} y={cy + ch / 2 + 8} textAnchor="middle" fontFamily={FONT_HAND} fontSize={20} fill="#555">{label(i)}</text> : null}
            {st === 'x' ? (
              <path d={`M ${cx + 12} ${cy + 12} L ${cx + cw - 12} ${cy + ch - 12} M ${cx + cw - 12} ${cy + 12} L ${cx + 12} ${cy + ch - 12}`} stroke={C.red} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />
            ) : null}
            {st === 'check' ? <path d={`M ${cx + 14} ${cy + ch / 2} L ${cx + cw / 2 - 2} ${cy + ch - 16} L ${cx + cw - 12} ${cy + 14}`} stroke={C.green} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} /> : null}
          </g>
        );
      })}
    </g>
  );
};

/** helper to build cell arrays */
export const cellsOf = (fn: (i: number) => Cell): Cell[] => Array.from({length: 31}).map((_, i) => fn(i));

/** big paper sheet with handwritten text (fridge plans) */
export const Sheet: React.FC<{x: number; y: number; s?: number; rot?: number; lines: {text: string; size: number; color?: string; font?: 'hand' | 'title'}[]; w?: number; h?: number}> = ({x, y, s = 1, rot = 0, lines, w = 520, h = 680}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} fill="#000" opacity={0.18} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#fbfaf6" />
    <path d={`M ${-w / 2} ${-h / 2 + 30} Q 0 ${-h / 2 + 40} ${w / 2} ${-h / 2 + 26}`} stroke="#000" strokeOpacity={0.05} strokeWidth={30} fill="none" />
    {lines.map((l, i) => {
      const yy = -h / 2 + 90 + lines.slice(0, i).reduce((a, b) => a + b.size * 1.25, 0) + l.size * 0.6;
      return (
        <text key={i} x={0} y={yy} textAnchor="middle" fontFamily={l.font === 'title' ? FONT_TITLE : FONT_HAND} fontWeight={l.font === 'title' ? 600 : 400} fontSize={l.size} fill={l.color ?? '#222'}>
          {l.text}
        </text>
      );
    })}
    <circle cx={-w / 2 + 40} cy={-h / 2 + 30} r={12} fill="#4b6a8a" />
  </g>
);
