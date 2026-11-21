import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {EASE, keys, ramp} from '../lib';
import {Hero} from '../components/Hero';
import {Desk, Laptop, Sofa, WallClock} from '../components/Props';
import {DayCounter, Layer, Motes, SceneFrame} from '../components/Stage';

// 1170–1350: DAY 200 — laptop in cobwebs, dust, clock spinning, he lies on the sofa.
export const Scene06: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame
      dur={180}
      cam={(t) => ({x: keys(t, [0, 180], [-170, 160], EASE), zoom: 1.12, fy: 560})}
      overlay={<DayCounter label="DAY 200" />}
    >
      <Layer depth={0.75}>
        <WallClock x={930} y={300} scale={1.2} minute={f * 38} hour={f * 3.2} />
      </Layer>
      <Layer depth={1}>
        <Desk x={560} y={FLOOR_Y} />
        <Laptop x={540} y={FLOOR_Y - 129 * 1.3} open={0} screen="off" cobweb={ramp(f, 0, 150, 0.3, 1)} />
        <Sofa x={1330} y={FLOOR_Y} />
        <Hero x={1320} y={FLOOR_Y - 92} frame={f} pose="lie" emotion="tired" />
        <Motes n={40} x0={300} x1={1700} y0={150} y1={760} seed="dust6" fall={0.9} size={2.2} opacity={0.45} color="#d8d2c4" />
      </Layer>
      <Layer depth={1.3}>
        <Motes n={14} x0={100} x1={1900} y0={0} y1={1080} seed="dust6b" fall={1.4} size={4} opacity={0.25} color="#d8d2c4" />
      </Layer>
    </SceneFrame>
  );
};
