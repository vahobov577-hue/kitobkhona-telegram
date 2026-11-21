import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {EASE, keys, ramp} from '../lib';
import {Hero} from '../components/Hero';
import {Shadow} from '../components/Shadow';
import {Laptop, RecCamera} from '../components/Props';
import {Layer, SceneFrame, Sfx} from '../components/Stage';
import {DESK_TOP, DeskSet, LAPTOP_X, RoomBack} from './Room';

const PRESS = 138;

// 4050–4260: morning, same room. Tiny Shadow in the corner. He smiles at it and presses REC.
export const Scene17: React.FC = () => {
  const f = useCurrentFrame();
  const reach = keys(f, [112, PRESS, PRESS + 18], [0, 1, 0], EASE);
  const facing: 1 | -1 = f < 100 ? -1 : 1;
  return (
    <SceneFrame
      dur={210}
      cam={(t) => ({zoom: keys(t, [0, 210], [1.02, 1.16]), x: keys(t, [0, 100, 210], [-60, -30, 40], EASE), fx: 860, fy: 560})}
    >
      <RoomBack sky="morning" clockMin={0} clockHour={210} />
      <Layer depth={1}>
        <DeskSet time="07:00" />
        <Laptop x={LAPTOP_X} y={DESK_TOP} screen="views" views="5,000 views" glow={0.5} />
        <Shadow x={230} y={FLOOR_Y} frame={f} scale={0.3} pose="hug" smile={0.25} glow={1.4} eyes={keys(f, [40, 60], [1, 0.6])} />
        <RecCamera x={560} y={FLOOR_Y} rec={f >= PRESS} pressed={f >= PRESS && f < PRESS + 6 ? 1 : 0} />
        <Hero
          x={720}
          y={FLOOR_Y}
          frame={f}
          pose="stand"
          facing={-1}
          headband
          emotion="neutral"
          emotionTo="smile"
          emotionT={ramp(f, 30, 36)}
          look={facing === -1 ? 3 : 0}
          rig={{armF: [9 + (112 - 9) * reach, 6 - 6 * reach], head: f > 30 && f < 100 ? 8 : 0}}
        />
      </Layer>
      <Sfx name="beep" at={PRESS} volume={0.7} />
    </SceneFrame>
  );
};
