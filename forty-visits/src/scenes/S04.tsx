import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN, keys} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {CityKitchen, COUNTER_TOP} from '../environments/CityApartment';
import {MarbleJar} from '../inserts/Inserts';
import {useT} from './kit';

export const JAR = {x: 960, y: COUNTER_TOP + 10, s: 1.1};
/** the jar close-up framing (S4 hides where the marble lands; S31 shows it lands inside) */
export const JAR_CAM = () => ({zoom: 1.55, fx: JAR.x, fy: JAR.y - 310, x: 0, y: JAR.y - 310 - 540});

const A: React.FC = () => (
  <Shot bg="#111" zoom={[1.0, 1.03]}>
    <Layer depth={1}>
      <CityKitchen mood="night">
        <MarbleJar x={JAR.x} y={JAR.y} s={JAR.s} n={0} />
      </CityKitchen>
    </Layer>
    <Sfx name="fridgehum" at={0} volume={0.3} dur={60} />
  </Shot>
);
// close: a marble drops past the rim — the frosted band hides whether it goes in or out
const B: React.FC = () => {
  const {t} = useT();
  const y = keys(t, [4, 25], [-900, -490], EASE_IN);
  return (
    <Shot bg="#111" cam={JAR_CAM} zoom={[1.0, 1.02]} overlay={t >= 25 ? <AbsoluteFill style={{background: '#000'}} /> : undefined}>
      <Layer depth={1}>
        <CityKitchen mood="night">
          <MarbleJar x={JAR.x} y={JAR.y} s={JAR.s} n={0} falling={[110, y]} />
        </CityKitchen>
      </Layer>
      <Sfx name="clink" at={29} volume={1} />
    </Shot>
  );
};
export const S04 = [A, B];
