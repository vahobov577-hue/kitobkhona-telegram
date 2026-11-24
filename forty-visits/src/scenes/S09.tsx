import React from 'react';
import {ramp} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {CityFridge} from '../environments/CityApartment';
import {PlanCalendar} from '../inserts/Inserts';
import {SAM, useT} from './kit';

const Bg: React.FC = () => (
  <Layer depth={0.5} blur={8}>
    <rect x={-500} y={-500} width={3000} height={2200} fill="#d7d5d0" />
  </Layer>
);
// HOOK 0:40 — Christmas crossed (music stops for a bar)
const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#d7d5d0" zoom={[1.0, 1.04]}>
      <Bg />
      <Layer depth={1}>
        <PlanCalendar x={960} y={560} s={1.25} entries={[{text: 'VISIT HOME · Dec 25', cross: ramp(t, 10, 22), show: 1}]} />
      </Layer>
      <Sfx name="marker" at={10} volume={1} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#d7d5d0" zoom={[1.04, 1.08]}>
      <Bg />
      <Layer depth={1}>
        <PlanCalendar x={960} y={560} s={1.25} entries={[{text: 'VISIT HOME · Dec 25', cross: 1, show: 1}, {text: 'Easter', cross: ramp(t, 36, 48), show: ramp(t, 4, 14)}]} />
      </Layer>
      <Sfx name="marker" at={36} volume={1} />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.3, fx: 880, fy: 420, x: 880 - 960, y: 420 - 540})}>
      <Layer depth={1}>
        <CityFridge>
          <PlanCalendar x={0} y={0} s={0.55} entries={[{text: 'VISIT HOME · Dec 25', cross: 1, show: 1}, {text: 'Easter', cross: 1, show: 1}, {text: 'Summer', cross: ramp(t, 40, 52), show: ramp(t, 4, 18)}]} />
        </CityFridge>
        {SAM({x: 1110, y: 1060, frame: g, scale: 2.0, facing: -1, expr: t > 40 ? 'sad' : 'tired', look: [-5, -3], rig: {armF: [150, 10]}})}
      </Layer>
      <Sfx name="marker" at={40} volume={1} />
    </Shot>
  );
};
export const S09 = [A, B, C3];
