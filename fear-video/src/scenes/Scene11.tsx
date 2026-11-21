import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {EASE, keys, ramp} from '../lib';
import {Hero} from '../components/Hero';
import {Shadow} from '../components/Shadow';
import {Desk, Laptop} from '../components/Props';
import {DayCounter, Layer, SceneFrame, ShadowText, Sfx} from '../components/Stage';

const LX = 1130;
const LY = FLOOR_Y - 129 * 1.3;

// 2310–2550: DAY 3 — "0 views". Pull back from the screen; tiny Shadow in the corner: "told you." He keeps talking.
export const Scene11: React.FC = () => {
  const f = useCurrentFrame();
  const talk = Math.max(0, Math.sin(f * 0.45)) * (0.5 + 0.5 * Math.abs(Math.sin(f * 0.13)));
  return (
    <SceneFrame
      dur={240}
      cam={(t) => ({
        zoom: keys(t, [0, 110, 240], [2.3, 1.08, 1.04], EASE),
        fx: keys(t, [0, 110], [LX, 960], EASE),
        fy: keys(t, [0, 110], [LY - 60, 560], EASE),
        rot: keys(t, [0, 110, 240], [2, 0, -0.5], EASE),
      })}
      overlay={
        <>
          <DayCounter label="DAY 3" />
          <ShadowText text="told you." from={100} to={185} x={330} y={560} size={58} />
        </>
      }
    >
      <Layer depth={1}>
        <Desk x={1150} y={FLOOR_Y} />
        <Laptop x={LX} y={LY} screen="views" views="0 views" />
        <Shadow x={300} y={FLOOR_Y} frame={f} scale={0.45} opacity={ramp(f, 70, 100)} smile={1} pose="stand" />
        <Hero x={880} y={FLOOR_Y} frame={f} pose="speak" headband emotion="determined" mouth={talk} />
      </Layer>
      <Sfx name="whisper" at={96} volume={0.5} />
    </SceneFrame>
  );
};
