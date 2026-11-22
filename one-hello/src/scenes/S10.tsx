import React from 'react';
import {EASE, keys, noise, ramp} from '../lib';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Corridor, PartyLeak} from '../environments/PartyDoor';
import {CalendarSheet, cellsOf} from '../inserts/Calendar';
import {LEO, useT} from './kit';

// wide: the party door, Leo walks up to it
const A: React.FC = () => {
  const {t, g} = useT();
  const x = keys(t, [0, 50], [500, 860], EASE);
  return (
    <Shot drift={[30, 0]} ungraded={<Layer depth={1}><PartyLeak x={1100} /></Layer>}>
      <Layer depth={1}>
        <Corridor />
        {LEO({x, y: 940, frame: g, scale: 1.5, pose: t < 50 ? 'walk' : 'stand', speed: 0.8, back: false, expr: 'worried', look: [4, 0]})}
      </Layer>
      <Sfx name="muffledparty" at={0} volume={0.6} dur={240} />
    </Shot>
  );
};
// insert: hand at the doorbell — hovers, trembles, drops
const B: React.FC = () => {
  const {t} = useT();
  const y = keys(t, [0, 14, 40, 56], [700, 520, 520, 800], EASE);
  const tr = t > 14 && t < 40 ? noise('bell', t * 0.8) * 4 : 0;
  return (
    <Shot bg="#3a3936" zoom={[1.0, 1.03]} ungraded={<Layer depth={1}><PartyLeak x={1500} y={540} amount={0.6} /></Layer>}>
      <Layer depth={0.8} blur={3}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#45433f" />
        <rect x={1300} y={-200} width={500} height={1500} fill="#4b4742" />
      </Layer>
      <Layer depth={1}>
        <rect x={1080} y={360} width={90} height={150} rx={10} fill="#d8d2c2" />
        <circle cx={1125} cy={420} r={22} fill="#b9b2a2" stroke="#8a8274" strokeWidth={4} />
        <g transform={`translate(${1060 + tr} ${y})`} fill={C.sil}>
          <rect x={-26} y={-30} width={52} height={120} rx={26} />
          <rect x={-8} y={-110} width={22} height={100} rx={11} transform="rotate(8)" />
          <rect x={-60} y={60} width={110} height={700} rx={50} />
        </g>
      </Layer>
    </Shot>
  );
};
// far: he walks away down the empty corridor
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot zoom={[1.0, 1.02]} ungraded={<Layer depth={1}><PartyLeak x={1100} amount={0.6} /></Layer>}>
      <Layer depth={1}>
        <Corridor />
        {LEO({x: keys(t, [0, 60], [760, 300]), y: 940, frame: g, scale: 0.95, pose: 'walk', speed: 0.7, facing: -1, back: true})}
      </Layer>
      <Sfx name="steps" at={0} volume={0.5} />
    </Shot>
  );
};
// insert: calendar on the fridge — days crossed out
const D: React.FC = () => {
  const {t} = useT();
  const n = Math.floor(ramp(t, 0, 44, 0, 9.999));
  return (
    <Shot bg="#cfcdc8" zoom={[1.0, 1.05]}>
      <Layer depth={0.6} blur={6}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#e4e3df" />
      </Layer>
      <Layer depth={1}>
        <CalendarSheet x={960} y={540} s={1.35} title="NOVEMBER" cells={cellsOf((i) => (i < n ? 'x' : i === n ? 'today' : 'empty'))} drawIdx={n - 1} draw={(t % 5) / 5 + 0.2} />
      </Layer>
      <Sfx name="marker" at={2} volume={0.5} />
    </Shot>
  );
};
export const S10 = [A, B, C3, D];
