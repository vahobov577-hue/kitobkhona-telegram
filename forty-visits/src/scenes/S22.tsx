import React from 'react';
import {noise} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {LaptopDesk} from '../environments/CityApartment';
import {TwoWindows} from '../inserts/Inserts';
import {SamAtLaptop} from './S03';
import {useT} from './kit';

// cursor darts between the boss's email and mom's message
const cursorAt = (t: number): [number, number] => {
  const k = (Math.sin(t * 0.09) + 1) / 2;
  return [200 + k * 400 + noise('cu', t * 0.4) * 30, 160 + (1 - k) * 40 + noise('cv', t * 0.4) * 20];
};
// HOOK 2:50
const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 1.45, fx: 960, fy: 500, x: 0, y: -40})}>
      <Layer depth={1}>
        <LaptopDesk>
          <TwoWindows cursor={cursorAt(t)} />
        </LaptopDesk>
      </Layer>
      <Sfx name="heartbeat" at={0} volume={0.8} dur={100} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 2.6, fx: 1200, fy: 420, x: 1200 - 960, y: 420 - 540})}>
      <Layer depth={1}>
        <LaptopDesk>
          <TwoWindows cursor={cursorAt(t + 60)} />
        </LaptopDesk>
      </Layer>
      <Sfx name="heartbeat" at={0} volume={0.9} dur={100} />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 2.4, fx: 960, fy: 520, x: 0, y: 0})}>
      <SamAtLaptop g={g} expr="worried" look={[0, 2]} />
      <Sfx name="heartbeat" at={0} volume={1} dur={100} />
    </Shot>
  );
};
export const S22 = [A, B, C3];
