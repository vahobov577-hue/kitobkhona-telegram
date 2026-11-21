import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {EASE, EASE_OUT, keys, ramp} from '../lib';
import {Hero} from '../components/Hero';
import {Shadow} from '../components/Shadow';
import {Door} from '../components/Props';
import {DayCounter, Layer, SceneFrame, ShadowText, Sfx} from '../components/Stage';

// 930–1170: DAY 90 — walks to START, Shadow blocks it: "not yet." → "you're not ready." He steps back.
export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const fwd = keys(f, [0, 104], [360, 1000], (t) => t * (1.25 - 0.25 * t) * (t < 0.85 ? 1 : 1));
  const backX = keys(f, [172, 226], [0, -120], EASE);
  const x = fwd + backX;
  const walking = f < 104;
  const backing = f >= 172 && f < 226;
  const sRise = ramp(f, 70, 112, 0, 1, EASE_OUT);
  const pose = walking ? 'walk' : backing ? 'walk' : 'stand';
  const camX = keys(f, [0, 110, 240], [-260, 150, 150]);
  return (
    <SceneFrame
      dur={240}
      cam={(t) => ({x: camX, zoom: keys(t, [0, 100, 240], [1.05, 1.08, 1.2]), fx: 1150, fy: 560})}
      overlay={
        <>
          <DayCounter label="DAY 90" />
          <ShadowText text="not yet." from={112} to={162} y={200} size={104} />
          <ShadowText text="you're not ready." from={164} to={232} y={200} size={96} />
        </>
      }
    >
      <Layer depth={1}>
        <Door x={1500} y={FLOOR_Y} />
        <Shadow x={1330} y={FLOOR_Y} frame={f} facing={-1} scale={0.5 + 0.9 * sRise} opacity={ramp(f, 66, 92)} pose="stand" poseTo="armsOut" poseT={ramp(f, 96, 130)} smile={ramp(f, 110, 140)} />
        <Hero
          x={x}
          y={FLOOR_Y}
          frame={f}
          pose={pose}
          speed={backing ? -0.9 : 1.05}
          poseTo={walking ? 'stand' : undefined}
          poseT={walking ? ramp(f, 92, 104) : 0}
          emotion="neutral"
          emotionTo={f < 168 ? 'scared' : 'sad'}
          emotionT={ramp(f, 100, 104)}
          rig={f >= 226 ? {head: 14} : undefined}
          shrink={ramp(f, 110, 130, 0, 0.3)}
        />
      </Layer>
      <Sfx name="whisper" at={106} volume={0.8} />
      <Sfx name="whisper" at={158} volume={0.8} />
    </SceneFrame>
  );
};
