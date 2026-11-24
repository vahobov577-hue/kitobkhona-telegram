import React from 'react';
import {rnd} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {CityKitchen, LaptopDesk} from '../environments/CityApartment';
import {DeskPhone, MarbleJar} from '../inserts/Inserts';
import {Leaves} from '../effects/Leaves';
import {Glow} from '../environments/common';
import {MomHalfLamp, SplitCall, VideoCallScreen} from './family';
import {JAR, JAR_CAM} from './S04';
import {SAM, useT} from './kit';

const Timer: React.FC<{s: number}> = ({s}) => {
  const {t} = useT();
  const v = s + t / 2;
  return (
    <Shot bg="#16120e" zoom={[1.0, 1.06]}>
      <Layer depth={0.5} blur={8}>
        <CityKitchen mood="night" />
      </Layer>
      <Layer depth={1}>
        <DeskPhone x={960} y={540} s={0.95} rot={-3} mode="connected" frame={t} timer={`${Math.floor(v / 60)}:${String(Math.floor(v % 60)).padStart(2, '0')}`} />
      </Layer>
    </Shot>
  );
};
const Jar: React.FC<{n: number}> = ({n}) => {
  const {t} = useT();
  return (
    <Shot bg="#111" cam={JAR_CAM} zoom={[1.0, 1.03]}>
      <Layer depth={1}>
        <CityKitchen mood="night">
          <MarbleJar x={JAR.x} y={JAR.y} s={JAR.s} n={n + (t > 30 ? 1 : 0)} falling={t < 30 ? [(rnd('mf' + n) - 0.5) * 160, -900 + (t / 30) ** 2 * 700] : null} />
        </CityKitchen>
      </Layer>
      <Sfx name="clink" at={30} volume={0.6} />
    </Shot>
  );
};

const A: React.FC = () => <Timer s={12 * 60} />;
const B: React.FC = () => {
  const {g} = useT();
  return (
    <Shot zoom={[1.0, 1.04]} ungraded={<MomHalfLamp />}>
      <SplitCall g={g} samExpr="neutral" momExpr="happy" momTalk={1} cooking />
    </Shot>
  );
};
const C3: React.FC = () => <Timer s={31 * 60} />;
// close: burnt — both laugh
const D: React.FC = () => {
  const {g, t} = useT();
  return (
    <Shot cam={() => ({zoom: 2.0, fx: 960, fy: 560, x: 0, y: 0})}>
      <Layer depth={0.7} blur={4}>
        <CityKitchen mood="night" />
      </Layer>
      <Layer depth={1}>
        {SAM({x: 960, y: 1060, frame: g, scale: 2.0, expr: 'happy', talk: 0.8, rig: {armF: [80, 20], armB: [-168, -150]}})}
        {Array.from({length: 8}).map((_, i) => (
          <circle key={i} cx={1180 + Math.sin(t * 0.1 + i) * 30} cy={650 - ((t * 3 + i * 30) % 260)} r={30 + i * 3} fill="#555" opacity={0.35} />
        ))}
      </Layer>
      <Sfx name="laugh" at={6} volume={0.6} />
    </Shot>
  );
};
const E: React.FC = () => <Timer s={58 * 60} />;
const F: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.5, fx: 960, fy: 500, x: 0, y: -40})}>
      <Layer depth={1}>
        <LaptopDesk>
          <VideoCallScreen g={g} tomatoes />
        </LaptopDesk>
      </Layer>
    </Shot>
  );
};
const G: React.FC = () => <Jar n={6} />;
const H: React.FC = () => {
  const {g} = useT();
  return (
    <Shot zoom={[1.0, 1.04]} ungraded={<MomHalfLamp />}>
      <SplitCall g={g} samExpr="happy" momExpr="happy" samTalk={0.5} momTalk={0.6} />
    </Shot>
  );
};
const I: React.FC = () => <Jar n={12} />;
const J: React.FC = () => (
  <Shot cam={() => ({zoom: 1.6, fx: 1460, fy: 320, x: 1460 - 960, y: 320 - 540})} ungraded={<Layer depth={1}><Leaves n={30} amount={1} x0={1160} x1={1760} y0={100} y1={540} size={1.3} /></Layer>}>
    <Layer depth={1}>
      <CityKitchen mood="day" windowMood="dusk" />
      <Glow cx={1460} cy={320} r={400} color="#ffcf8a" opacity={0.2} />
    </Layer>
  </Shot>
);
export const S21 = [A, B, C3, D, E, F, G, H, I, J];
