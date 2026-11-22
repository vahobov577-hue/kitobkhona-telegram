import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {keys, ramp} from '../lib';
import {Bubble} from '../components/Things';
import {DayCounter, Layer, SceneFrame, Sfx} from '../components/Stage';
import {DinnerTable, FRIENDS} from './Dinner';

const BUBBLES = [
  {at: 24, i: 1},
  {at: 64, i: 0},
  {at: 104, i: 2},
  {at: 150, i: 0},
  {at: 186, i: 1},
];

// 2250–2490: DAY 90 — dinner with friends. They laugh; he lives in the phone. Their words are empty to him.
export const Scene12: React.FC = () => {
  const f = useCurrentFrame();
  const laugh = [0, 1, 2].map((i) => (BUBBLES.some((b) => b.i === i && f > b.at + 10 && f < b.at + 50) ? 1 : 0.15));
  return (
    <SceneFrame
      dur={240}
      wipeIn={0}
      cam={(t) => ({zoom: keys(t, [0, 240], [1.25, 1.32]), x: keys(t, [0, 240], [80, -60]), fx: 1000, fy: 540})}
      overlay={
        <>
          <DayCounter label="DAY 90" />
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 40% 50%, transparent 30%, rgba(0,0,0,0.45) 75%)'}} />
        </>
      }
    >
      <Layer depth={0.8}>
        <polygon points="880,-50 1120,-50 1460,640 540,640" fill="#fff" opacity={0.035} />
        <path d="M 1000 -50 L 1000 150" stroke="#2a2a2a" strokeWidth={4} />
        <path d="M 960 150 L 1040 150 L 1070 190 L 930 190 Z" fill="#2a2a2a" stroke="#151515" strokeWidth={3} />
      </Layer>
      <Layer depth={1}>
        <DinnerTable f={f} laugh={laugh} />
        {BUBBLES.map((b, k) => {
          if (f < b.at || f > b.at + 46) return null;
          const fr = FRIENDS[b.i];
          const op = Math.min(ramp(f, b.at, b.at + 6), ramp(f, b.at + 38, b.at + 46, 1, 0));
          return <Bubble key={k} x={fr.x + (fr.facing < 0 ? -40 : 40)} y={fr.behind ? 250 : 300} w={150} h={74} opacity={op * 0.9} tail={fr.facing < 0 ? 1 : -1} />;
        })}
      </Layer>
      <Sfx name="muffled" at={0} volume={0.75} dur={240} />
    </SceneFrame>
  );
};
