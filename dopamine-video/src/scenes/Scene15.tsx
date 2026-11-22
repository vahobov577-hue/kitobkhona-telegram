import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {keys} from '../lib';
import {Hero, heroJoint} from '../components/Hero';
import {PhoneMonster} from '../components/Monster';
import {Notif} from '../components/Things';
import {DayCounter, Layer, SceneFrame, ShadowText, Sfx} from '../components/Stage';

// 2970–3240: DAY 200 — grey, slouched. Monster ×4, five chains, a swarm of notifications.
export const Scene15: React.FC = () => {
  const f = useCurrentFrame();
  const hp = {x: 1180, y: FLOOR_Y, frame: f, pose: 'stand' as const, scale: 1.3, facing: -1 as const, rig: {armF: [30, 20] as [number, number], armB: [-20, -10] as [number, number]}};
  const targets: [number, number][] = [heroJoint(hp, 'neck'), heroJoint(hp, 'haF'), heroJoint(hp, 'haB'), [hp.x - 14, FLOOR_Y - 8], [hp.x + 14, FLOOR_Y - 6]];
  const M: [number, number] = [640, FLOOR_Y];
  return (
    <SceneFrame
      dur={270}
      cam={(t) => ({zoom: keys(t, [0, 270], [1.0, 1.1]), rot: keys(t, [0, 270], [-3, 2]), y: keys(t, [0, 270], [-40, 0]), fx: 900, fy: 700})}
      overlay={
        <>
          <DayCounter label="DAY 200" />
          <ShadowText text="you deserve a break." from={20} to={96} y={130} size={86} />
          <ShadowText text="start tomorrow." from={100} to={170} y={130} size={96} />
          <ShadowText text="you're fine." from={174} to={268} y={130} size={110} />
        </>
      }
    >
      <Layer depth={1}>
        <PhoneMonster x={M[0]} y={M[1]} scale={4} chains={5} targets={targets} chainSag={60} smirk={1} glow={1.2} />
        {Array.from({length: 22}).map((_, i) => {
          const a = f * (0.02 + (i % 3) * 0.006) + i * 0.9;
          const r = 260 + (i % 4) * 70;
          return <Notif key={i} x={M[0] + Math.cos(a) * r * 1.25} y={M[1] - 260 + Math.sin(a) * r * 0.75} t={f - i * 4} n={(i * 7) % 99 + 1} size={18 + (i % 3) * 4} />;
        })}
        <Hero {...hp} emotion="empty" saturation={0.3} age={0.3} tremble={0.5} />
      </Layer>
      <Sfx name="whisper" at={16} volume={0.8} />
      <Sfx name="whisper" at={96} volume={0.8} />
      <Sfx name="whisper" at={170} volume={0.9} />
      {[0, 20, 36, 50, 62, 74, 84, 94].map((d) => (
        <Sfx key={d} name="ding" at={d} volume={0.3} />
      ))}
    </SceneFrame>
  );
};
