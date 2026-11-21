import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FLOOR_Y, FONT_BOLD} from '../theme';
import {EASE, EASE_OUT, keys, ramp, rnd, wobbler} from '../lib';
import {Hero} from '../components/Hero';
import {Figure} from '../components/Figure';
import {getRig, solve} from '../components/rig';
import {DayCounter, Layer, SceneFrame, Sfx} from '../components/Stage';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

type P = {x: number; y: number; s: number; at: number; c: string; facing: 1 | -1};
const PEOPLE: P[] = [];
const rows = [
  {y: FLOOR_Y - 70, s: 0.85, n: 9, c: '#2c2a38'},
  {y: FLOOR_Y - 36, s: 1.0, n: 8, c: '#383546'},
  {y: FLOOR_Y, s: 1.15, n: 6, c: '#46425a'},
];
rows.forEach((r, ri) => {
  for (let i = 0; i < r.n; i++) {
    let x = 240 + (i + 0.5) * (1440 / r.n) + (rnd(`px${ri}${i}`) - 0.5) * 60;
    if (ri === 2 && Math.abs(x - 960) < 190) x += x < 960 ? -190 : 190;
    PEOPLE.push({x, y: r.y, s: r.s, at: 20 + rnd(`pa${ri}${i}`) * 170, c: r.c, facing: x < 960 ? 1 : -1});
  }
});
PEOPLE.sort((a, b) => a.at - b.at);

const Person: React.FC<{p: P; f: number; i: number}> = ({p, f, i}) => {
  const t = ramp(f, p.at, p.at + 18, 0, 1, EASE_OUT);
  if (t <= 0) return null;
  const j = solve(getRig('stand', f + i * 13));
  const w = wobbler(f, 'pp' + i, 1);
  return (
    <g opacity={t} transform={`translate(${p.x} ${p.y + (1 - t) * 40}) scale(${p.s * p.facing} ${p.s})`}>
      <Figure j={j} w={w} fill={p.c} ink="#15131c" />
    </g>
  );
};

// 3150–3390: DAY 120 → DAY 180 — views 12 → 340 → 5,000; people gather; background turns violet.
export const Scene14: React.FC = () => {
  const f = useCurrentFrame();
  const v = f < 60 ? 12 : f < 120 ? keys(f, [60, 112], [12, 340], EASE) : keys(f, [120, 205], [340, 5000], EASE);
  const pulse = 1 + 0.06 * Math.max(0, Math.sin(((f - 60) / 52) * Math.PI)) * (f > 60 && f < 112 ? 1 : 0) + 0.08 * Math.max(0, Math.sin(((f - 120) / 85) * Math.PI)) * (f > 120 && f < 205 ? 1 : 0);
  const purple = ramp(f, 10, 200, 0, 1, EASE);
  return (
    <SceneFrame
      dur={240}
      cam={(t) => ({zoom: keys(t, [0, 240], [1.25, 1.0], EASE), fx: 960, fy: 600})}
      bg={
        <AbsoluteFill
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, #3a2258 0%, #22143a 45%, #120c1c 100%)',
            opacity: purple,
          }}
        />
      }
      overlay={
        <>
          <DayCounter label="DAY 120" change={{at: 120, label: 'DAY 180'}} />
          <div style={{position: 'absolute', top: 120, width: 1920, textAlign: 'center', fontFamily: FONT_BOLD, fontWeight: 700, color: '#fff', transform: `scale(${pulse})`}}>
            <span style={{fontSize: 140, letterSpacing: 2}}>{fmt(v)}</span>
            <span style={{fontSize: 52, opacity: 0.75, marginLeft: 20}}>views</span>
          </div>
        </>
      }
    >
      <Layer depth={0.85}>
        {PEOPLE.filter((p) => p.s < 1.1).map((p, i) => (
          <Person key={i} p={p} f={f} i={i} />
        ))}
      </Layer>
      <Layer depth={1}>
        {PEOPLE.filter((p) => p.s >= 1.1).map((p, i) => (
          <Person key={i} p={p} f={f} i={i + 40} />
        ))}
        <Hero x={960} y={FLOOR_Y} frame={f} pose="stand" headband emotion="determined" emotionTo="smile" emotionT={ramp(f, 140, 146)} />
      </Layer>
      <Sfx name="blips" at={60} volume={0.5} />
      <Sfx name="blips" at={122} volume={0.6} />
      <Sfx name="tick" at={120} volume={0.6} />
    </SceneFrame>
  );
};
