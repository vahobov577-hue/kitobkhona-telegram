import React from 'react';
import {EASE, keys, ramp} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {LaptopDesk} from '../environments/CityApartment';
import {Park} from '../environments/ParkBench';
import {TwoWindows, Ticket} from '../inserts/Inserts';
import {SamAtLaptop} from './S03';
import {useT} from './kit';

const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.8, fx: 960, fy: 560, x: 0, y: 20})}>
      <SamAtLaptop g={g} expr="determined" look={[0, 3]} />
      {[10, 16, 22, 28, 34, 40, 46].map((a) => (
        <Sfx key={a} name="key" at={a} volume={0.35} dur={8} />
      ))}
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 2.2, fx: 760, fy: 440, x: 760 - 960, y: 440 - 540})}>
      <Layer depth={1}>
        <LaptopDesk>
          <TwoWindows cursor={[keys(t, [0, 50], [300, 370], EASE), keys(t, [0, 50], [300, 290], EASE)]} reply={ramp(t, 0, 40)} sent={t > 54} />
        </LaptopDesk>
      </Layer>
      <Sfx name="whoosh" at={54} volume={0.6} />
    </Shot>
  );
};
const C3: React.FC = () => (
  <Shot zoom={[1.0, 1.06]}>
    <Layer depth={0.5} blur={10}>
      <Park mood="grey" bench={false} />
    </Layer>
    <Layer depth={1}>
      <Ticket x={960} y={540} s={1.3} rot={-5} />
    </Layer>
  </Shot>
);
export const S24 = [A, B, C3];
