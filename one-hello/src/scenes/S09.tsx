import React from 'react';
import {EASE_OUT, keys, ramp} from '../lib';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Kitchen} from '../environments/Apartment';
import {Sheet} from '../inserts/Calendar';
import {LEO, useT} from './kit';

export const PLAN_LINES = [
  {text: 'NEW ME', size: 96, font: 'title' as const},
  {text: '5 PARTIES', size: 64, color: C.red},
  {text: 'A MONTH', size: 50},
  {text: '·', size: 40},
  {text: '20 NEW', size: 64, color: C.red},
  {text: 'FRIENDS', size: 56},
];

// insert: the hand slaps the plan on the fridge — magnet snap (music stops for a bar)
const A: React.FC = () => {
  const {t} = useT();
  const s = keys(t, [0, 5, 9, 14], [1.25, 0.96, 1.02, 1], EASE_OUT);
  const handY = keys(t, [0, 5, 16, 30], [260, 0, 0, 420]);
  return (
    <Shot bg="#cfcdc8" cam={() => ({zoom: 2.4, fx: 560, fy: 320, x: 560 - 960 + (t < 8 ? (8 - t) * 1.5 : 0), y: 320 - 540})} zoom={[1, 1.02]}>
      <Layer depth={1}>
        <Kitchen>
          <g transform={`scale(${s})`}>
            <Sheet x={0} y={0} s={0.42} lines={PLAN_LINES} />
          </g>
          <circle cx={0} cy={-128} r={12} fill="#d9443a" />
          <g transform={`translate(${70 + handY * 0.6} ${-110 + handY})`} fill={C.sil}>
            <ellipse cx={0} cy={0} rx={34} ry={30} />
            <path d="M 10 10 L 420 300" stroke={C.sil} strokeWidth={36} strokeLinecap="round" />
          </g>
        </Kitchen>
      </Layer>
      <Sfx name="magnet" at={4} volume={1} />
    </Shot>
  );
};
// wide: Leo in front of the fridge, looking at his big plan
const B: React.FC = () => {
  const {g, t} = useT();
  return (
    <Shot drift={[-30, 0]}>
      <Layer depth={0.8} blur={2}>
        <Kitchen>
          <Sheet x={0} y={0} s={0.42} lines={PLAN_LINES} />
        </Kitchen>
      </Layer>
      <Layer depth={1}>{LEO({x: 980, y: 1000, frame: g, scale: 1.7, facing: -1, expr: t > 20 ? 'determined' : 'neutral', look: [-5, -2], rig: {armF: [20, 10]}})}</Layer>
    </Shot>
  );
};
// insert: the plan, slow push
const C3: React.FC = () => (
  <Shot bg="#cfcdc8" cam={(t) => ({zoom: keys(t, [0, 90], [2.6, 2.9]), fx: 560, fy: 300, x: 560 - 960, y: 300 - 540})}>
    <Layer depth={1}>
      <Kitchen>
        <Sheet x={0} y={0} s={0.42} lines={PLAN_LINES} />
      </Kitchen>
    </Layer>
  </Shot>
);
export const S09 = [A, B, C3];
void ramp;
