import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {EASE, keys, noise, rectPath, wobbler} from '../lib';
import {DayCounter, Layer, SceneFrame, Sfx} from '../components/Stage';
import {Glitch} from '../effects/Glitch';

// rectangles in the room that can "become" the phone for a moment
const RECTS = [
  {x: 260, y: 220, w: 300, h: 360, at: 26, kind: 'window'},
  {x: 760, y: 470, w: 150, h: 210, at: 66, kind: 'book'},
  {x: 1180, y: 180, w: 280, h: 600, at: 104, kind: 'door'},
  {x: 1620, y: 300, w: 220, h: 160, at: 142, kind: 'frame'},
  {x: 560, y: 760, w: 400, h: 130, at: 170, kind: 'rug'},
  {x: 1180, y: 180, w: 280, h: 600, at: 196, kind: 'door'},
];

const Smirk: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => {
  const s = Math.min(w, h) / 120;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#2a0c0e" stroke={C.red} strokeWidth={5} />
      <g transform={`translate(${x + w / 2} ${y + h / 2}) scale(${s})`} style={{filter: 'drop-shadow(0 0 6px #E53935)'}}>
        <path d="M -38 -24 L -8 -8 L -34 -6 Z" fill={C.red} />
        <path d="M 38 -24 L 8 -8 L 34 -6 Z" fill={C.red} />
        <path d="M -30 14 Q -6 36 12 22 Q 24 16 34 2" stroke={C.red} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

// 4710–4950: DAY 4 — POV: every rectangle flashes into the phone's grin for a moment.
export const Scene21: React.FC = () => {
  const f = useCurrentFrame();
  const w = wobbler(f, 'r21', 1);
  const shakeHead = f > 214 ? Math.sin((f - 214) * 0.9) * 60 * (1 - (f - 214) / 26) : 0;
  const flashing = RECTS.some((r) => f >= r.at && f < r.at + 8);
  return (
    <SceneFrame
      dur={240}
      floor={false}
      cam={(t) => ({x: keys(t, [0, 60, 120, 180, 214], [-160, -40, 200, 40, 0], EASE) + shakeHead + noise('p21', t * 0.3) * 10, y: noise('p21y', t * 0.3) * 8, zoom: 1.08, rot: noise('p21r', t * 0.2) * 1.5, fx: 960, fy: 540})}
      overlay={
        <>
          <DayCounter label="DAY 4" />
          <AbsoluteFill style={{boxShadow: 'inset 0 0 260px 60px rgba(0,0,0,0.95)'}} />
          {flashing ? <AbsoluteFill style={{background: C.red, opacity: 0.08}} /> : null}
        </>
      }
    >
      <Glitch amount={flashing ? 0.35 : 0} seed="g21">
        <Layer depth={1}>
          <line x1={-500} y1={900} x2={2500} y2={900} stroke={C.floor} strokeWidth={2} />
          <path d={rectPath(w, 260, 220, 300, 360, 4)} fill="#1b2233" stroke={C.ink} strokeWidth={4} />
          <path d={w`M 410 220 L 410 580 M 260 400 L 560 400`} stroke={C.grey2} strokeWidth={10} />
          <path d={rectPath(w, 700, 680, 300, 20, 4)} fill={C.furn} stroke={C.ink} strokeWidth={3} />
          <path d={rectPath(w, 760, 470, 150, 210, 4)} fill="#7a3b3a" stroke={C.ink} strokeWidth={3} />
          <path d={rectPath(w, 1180, 180, 280, 600, 4)} fill={C.grey2} stroke={C.ink} strokeWidth={4} />
          <circle cx={1420} cy={500} r={10} fill="#c9b98a" />
          <path d={rectPath(w, 1620, 300, 220, 160, 4)} fill={C.furn} stroke={C.ink} strokeWidth={3} />
          <path d={rectPath(w, 560, 760, 400, 130, 30)} fill="#2a2a33" stroke={C.ink} strokeWidth={3} />
          {RECTS.map((r, i) => (f >= r.at && f < r.at + 8 ? <Smirk key={i} x={r.x} y={r.y} w={r.w} h={r.h} /> : null))}
        </Layer>
      </Glitch>
      {RECTS.map((r, i) => (
        <Sfx key={i} name="glitch" at={r.at} volume={0.55} dur={10} />
      ))}
      <Sfx name="whoosh" at={212} volume={0.5} />
    </SceneFrame>
  );
};
