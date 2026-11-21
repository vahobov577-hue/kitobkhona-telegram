import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {EASE, EASE_OUT, keys, ramp} from '../lib';
import {Hero} from '../components/Hero';
import {Shadow} from '../components/Shadow';
import {Chair, Laptop} from '../components/Props';
import {DayCounter, Layer, SceneFrame, ShadowText, Sfx} from '../components/Stage';
import {DESK_TOP, DeskSet, LAPTOP_X, RoomBack} from './Room';
import {HERO2_X, reachArm} from './Scene02';

// 450–690: Shadow rises behind him, "what if they laugh?", laptop closes, light dies.
export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const rise = ramp(f, 8, 95, 0, 1, EASE_OUT);
  const back = ramp(f, 62, 108, 1, 0, EASE);
  const toLid = ramp(f, 118, 142, 0, 1, EASE);
  const lid = ramp(f, 140, 166, 1, 0, EASE);
  const dark = ramp(f, 150, 185, 0, 0.45);
  const arm = reachArm(back, f, back > 0.95 ? 2.2 : 0);
  const lidArm: [number, number] = [128, -18];
  const armF: [number, number] = toLid > 0 ? [arm[0] + (lidArm[0] - arm[0]) * toLid, arm[1] + (lidArm[1] - arm[1]) * toLid] : arm;
  // after closing, the hand drops to the lid top
  const afterClose = ramp(f, 166, 190, 0, 1, EASE);
  const finalArm: [number, number] = [armF[0] + (80 - armF[0]) * afterClose, armF[1] + (20 - armF[1]) * afterClose];
  return (
    <SceneFrame
      dur={240}
      fadeIn={0}
      fadeOut={10}
      cam={(t) => ({
        zoom: keys(t, [0, 240], [1.3, 1.18]),
        x: keys(t, [0, 240], [30, -40]),
        rot: keys(t, [0, 90, 240], [0, -1.6, -1.0]),
        fx: 930,
        fy: 560,
      })}
      overlay={
        <>
          <DayCounter label="DAY 1" from={-20} />
          <ShadowText text="what if they laugh?" from={78} to={176} y={200} size={96} />
          <AbsoluteFill style={{backgroundColor: '#000', opacity: dark, pointerEvents: 'none'}} />
        </>
      }
    >
      <RoomBack moonBeam={1} />
      <Layer depth={1}>
        <DeskSet />
        <Shadow x={HERO2_X - 175} y={FLOOR_Y} frame={f} scale={0.5 + 0.7 * rise} opacity={ramp(f, 4, 40)} pose="stand" poseTo="lean" poseT={ramp(f, 60, 120)} smile={ramp(f, 70, 110)} />
        <Laptop x={LAPTOP_X} y={DESK_TOP} screen="upload" open={lid} cursorOn={Math.floor((f + 300) / 14) % 2 === 0} />
        <Chair x={HERO2_X - 10} y={FLOOR_Y} />
        <Hero
          x={HERO2_X}
          y={FLOOR_Y}
          frame={f + 300}
          pose="sitDesk"
          rig={{armF: finalArm, head: 10 - ramp(f, 150, 200, 0, 14)}}
          emotion="neutral"
          emotionTo={f < 175 ? 'scared' : 'sad'}
          emotionT={ramp(f, 60, 70)}
          look={f > 60 && f < 120 ? -8 : 0}
        />
      </Layer>
      <Sfx name="whisper" at={70} volume={0.9} />
      <Sfx name="lid" at={160} volume={0.6} />
    </SceneFrame>
  );
};
