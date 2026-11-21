import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {EASE, keys, noise, ramp} from '../lib';
import {Hero} from '../components/Hero';
import {Chair, Laptop} from '../components/Props';
import {DayCounter, Layer, Motes, SceneFrame, Sfx} from '../components/Stage';
import {DESK_TOP, DeskSet, LAPTOP_X, RoomBack} from './Room';

export const HERO2_X = 850;
/** arm angles for "reach" 0..1 (rest on desk → finger towards UPLOAD) */
export const reachArm = (t: number, f: number, trem: number): [number, number] => [
  75 + (105 - 75) * t + noise('arm', f * 0.8) * trem,
  15 + (6 - 15) * t + noise('arm2', f * 0.8) * trem,
];

// 150–450: night room, laptop glows, finger slowly reaches for UPLOAD and freezes.
export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const reach = ramp(f, 80, 215, 0, 1, EASE);
  const trem = ramp(f, 190, 230, 0, 2.2);
  return (
    <SceneFrame
      dur={300}
      fadeIn={10}
      fadeOut={0}
      cam={(t) => ({zoom: keys(t, [0, 300], [1, 1.25]), x: keys(t, [0, 300], [0, 30]), fx: 930, fy: 560})}
      overlay={<DayCounter label="DAY 1" from={14} />}
    >
      <RoomBack />
      <Layer depth={1}>
        <DeskSet />
        <Laptop x={LAPTOP_X} y={DESK_TOP} screen="upload" cursorOn={Math.floor(f / 14) % 2 === 0} />
        <Chair x={HERO2_X - 10} y={FLOOR_Y} />
        <Hero x={HERO2_X} y={FLOOR_Y} frame={f} pose="sitDesk" rig={{armF: reachArm(reach, f, trem), head: 6 + reach * 4}} emotion="neutral" />
      </Layer>
      <Layer depth={1.25}>
        <Motes n={18} x0={820} x1={1250} y0={380} y1={700} seed="m2" fall={0.12} size={2} opacity={0.35} color="#bfe6ff" />
      </Layer>
      <Sfx name="tick" at={60} volume={0.25} />
    </SceneFrame>
  );
};
