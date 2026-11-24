import React from 'react';
import {EASE_IN, keys} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {CityKitchen} from '../environments/CityApartment';
import {DeskPhone, MarbleJar} from '../inserts/Inserts';
import {MomHalfLamp, SplitCall} from './family';
import {JAR, JAR_CAM} from './S04';
import {useT} from './kit';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#16120e" zoom={[1.0, 1.05]}>
      <Layer depth={0.5} blur={8}>
        <CityKitchen mood="night" />
      </Layer>
      <Layer depth={1}>
        <DeskPhone x={960} y={540} s={0.95} mode="connected" frame={t} timer={fmt(600 + (t / 80) * (43 * 60 + 12 - 600))} />
      </Layer>
    </Shot>
  );
};
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot zoom={[1.02, 1.05]} ungraded={<MomHalfLamp k={1.2} />}>
      <SplitCall g={g} samExpr={t > 30 ? 'happy' : 'neutral'} momExpr="happy" momTalk={t < 40 ? 1 : 0.4} samTalk={t > 44 ? 0.4 : 0} />
      <Sfx name="laugh" at={30} volume={0.6} />
      <Sfx name="guitar" at={0} volume={0.3} dur={80} />
    </Shot>
  );
};
// insert: the first marble goes into the jar
const C3: React.FC = () => {
  const {t} = useT();
  const y = keys(t, [10, 30], [-900, -40], EASE_IN);
  return (
    <Shot bg="#111" cam={JAR_CAM} zoom={[1.0, 1.02]}>
      <Layer depth={1}>
        <CityKitchen mood="night">
          <MarbleJar x={JAR.x} y={JAR.y} s={JAR.s} n={t >= 30 ? 1 : 0} falling={t < 30 ? [-110, y] : null} />
        </CityKitchen>
      </Layer>
      <Sfx name="clink" at={30} volume={0.8} />
    </Shot>
  );
};
export const S17 = [A, B, C3];
