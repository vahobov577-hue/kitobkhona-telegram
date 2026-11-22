import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {EASE, keys, ramp} from '../lib';
import {Burst} from '../effects/Particles';
import {Layer, SceneFrame, ShadowText, Sfx} from '../components/Stage';
import {DinnerTable, FRIENDS, HERO_D} from './Dinner';

// 2490–2730: friends fade one by one; the last one touches his shoulder, he doesn't look up — gone.
export const Scene13: React.FC = () => {
  const f = useCurrentFrame();
  const op = [ramp(f, 186, 214, 1, 0), ramp(f, 30, 60, 1, 0), ramp(f, 80, 110, 1, 0)];
  const walk = ramp(f, 118, 158, 0, 1, EASE);
  const touch = ramp(f, 158, 172, 0, 1, EASE);
  return (
    <SceneFrame
      dur={240}
      fadeIn={0}
      cam={(t) => ({zoom: keys(t, [0, 240], [1.25, 0.95], EASE), fx: 980, fy: 560})}
      overlay={<ShadowText text="they'll wait." from={196} to={240} y={170} size={100} fadeOut={4} />}
    >
      <Layer depth={1}>
        <DinnerTable
          f={f + 240}
          friendOp={op}
          friendPose={(i) => (i === 0 && f > 112 ? 'stand' : 'sit')}
          friendX={(i) => (i === 0 ? FRIENDS[0].x + (HERO_D + 150 - FRIENDS[0].x) * walk : FRIENDS[i].x)}
          friendRig={(i) => (i === 0 && f > 112 ? {armF: [20 + 80 * touch, 10] as [number, number], head: 10} : undefined)}
        />
        <Burst x={FRIENDS[1].x} y={FLOOR_Y - 200} t={f - 40} n={30} color="#5a5868" speed={4} gravity={-0.08} life={40} seed="d1" size={5} />
        <Burst x={FRIENDS[2].x} y={FLOOR_Y - 200} t={f - 90} n={30} color="#5a5868" speed={4} gravity={-0.08} life={40} seed="d2" size={5} />
        <Burst x={HERO_D + 150} y={FLOOR_Y - 220} t={f - 196} n={34} color="#5a5868" speed={4} gravity={-0.08} life={40} seed="d3" size={5} />
      </Layer>
      <Sfx name="muffled" at={0} volume={0.45} dur={110} />
      <Sfx name="poof" at={40} volume={0.5} />
      <Sfx name="poof" at={90} volume={0.5} />
      <Sfx name="poof" at={196} volume={0.6} />
      <Sfx name="whisper" at={192} volume={0.9} />
    </SceneFrame>
  );
};
