import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {EASE, keys, ramp, rectPath, wobbler} from '../lib';
import {Pencil, SunDrawing} from '../components/Things';
import {DayCounter, Layer, SceneFrame, Sfx} from '../components/Stage';

const P: [number, number] = [960, 480];

// 4950–5190: DAY 9 — top view. Out of boredom he draws a small sun. It glows: the first yellow in the film.
export const Scene22: React.FC = () => {
  const f = useCurrentFrame();
  const w = wobbler(f, 'p22', 1);
  const t = ramp(f, 30, 170);
  const glow = ramp(f, 176, 206, 0, 1, EASE);
  // pencil tip follows the drawing: circle first, then rays
  const a = t < 0.5 ? (t / 0.5) * Math.PI * 2 : ((t - 0.5) / 0.5) * Math.PI * 2 * 1.0;
  const r = t < 0.5 ? 44 : 58 + 34 * (((t - 0.5) / 0.5) * 10 % 1);
  const tip: [number, number] = [P[0] + Math.cos(a) * r * 1.6, P[1] + Math.sin(a) * r * 1.6];
  const drawing = f > 30 && f < 172;
  const handTip: [number, number] = drawing ? tip : [keys(f, [172, 200], [tip[0], P[0] + 330]), keys(f, [172, 200], [tip[1], P[1] + 250])];
  return (
    <SceneFrame
      dur={240}
      floor={false}
      cam={(t2) => ({zoom: keys(t2, [0, 170, 240], [1.25, 1.1, 1.35], EASE), rot: keys(t2, [0, 240], [4, -2]), fx: P[0], fy: P[1] + 40})}
      overlay={
        <>
          <DayCounter label="DAY 9" />
          <AbsoluteFill style={{background: `radial-gradient(circle at 50% 44%, rgba(255,213,74,${0.28 * glow}), transparent 45%)`}} />
        </>
      }
    >
      <Layer depth={1}>
        <rect x={-600} y={-600} width={3200} height={2400} fill="#3a3a45" />
        {Array.from({length: 14}).map((_, i) => (
          <line key={i} x1={-600} y1={-500 + i * 140} x2={2600} y2={-480 + i * 140} stroke="#33333d" strokeWidth={6} />
        ))}
        <path d={rectPath(w, P[0] - 300, P[1] - 380, 600, 780, 4)} fill="#ece6d8" stroke={C.ink} strokeWidth={4} />
        <g transform={`translate(${P[0]} ${P[1]}) scale(1.6) translate(${-P[0]} ${-P[1]})`}>
          <SunDrawing x={P[0]} y={P[1]} t={t} glow={glow} />
        </g>
        {/* his bald head from above + arm with pencil */}
        <path d={`M ${P[0] + 520} ${P[1] + 640} Q ${P[0] + 420} ${handTip[1] + 260} ${handTip[0] + 40} ${handTip[1] + 50}`} stroke={C.ink} strokeWidth={50} fill="none" strokeLinecap="round" />
        <path d={`M ${P[0] + 520} ${P[1] + 640} Q ${P[0] + 420} ${handTip[1] + 260} ${handTip[0] + 40} ${handTip[1] + 50}`} stroke={C.hero} strokeWidth={41} fill="none" strokeLinecap="round" />
        <g transform={`translate(${handTip[0] + 36} ${handTip[1] + 44}) scale(2.2)`}>
          <Pencil rot={-140} />
        </g>
        <ellipse cx={P[0] + 40} cy={P[1] + 640} rx={190} ry={170} fill={C.hero} stroke={C.ink} strokeWidth={4} />
        <ellipse cx={P[0] + 40} cy={P[1] + 600} rx={120} ry={90} fill="#fff" opacity={0.25 + 0.3 * glow} />
        <ellipse cx={P[0] + 40} cy={P[1] + 560} rx={150} ry={80} fill={C.sun} opacity={0.18 * glow} />
      </Layer>
      <Sfx name="pencil" at={30} volume={0.6} dur={140} />
      <Sfx name="shimmer" at={176} volume={0.6} />
    </SceneFrame>
  );
};
