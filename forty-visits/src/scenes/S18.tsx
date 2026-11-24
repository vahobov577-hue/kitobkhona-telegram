import React from 'react';
import {Layer} from '../effects/Parallax';
import {Shot} from '../effects/Shot';
import {LaptopDesk} from '../environments/CityApartment';
import {VideoCallScreen} from './family';
import {SamAtLaptop} from './S03';
import {useT} from './kit';

// video call: dad behind mom — thinner, slow, waving with a trembling hand
const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.5, fx: 960, fy: 500, x: 0, y: -40})}>
      <Layer depth={1}>
        <LaptopDesk>
          <VideoCallScreen g={g} dadWave={1} />
        </LaptopDesk>
      </Layer>
    </Shot>
  );
};
// insert: push in on the trembling hand (on screen)
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.6 + t * 0.004, fx: 960, fy: 500, x: 0, y: -40})}>
      <Layer depth={1}>
        <LaptopDesk>
          <VideoCallScreen g={g} dadWave={1} zoom={3.6 + t * 0.01} focus={[1350, 700]} />
        </LaptopDesk>
      </Layer>
    </Shot>
  );
};
const C3: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 2.2, fx: 960, fy: 520, x: 0, y: 0})}>
      <SamAtLaptop g={g} expr="worried" look={[0, 3]} />
    </Shot>
  );
};
export const S18 = [A, B, C3];
