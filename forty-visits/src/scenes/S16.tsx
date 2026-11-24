import React from 'react';
import {EASE, keys, noise} from '../lib';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {CityKitchen} from '../environments/CityApartment';
import {MomKitchen, MomLampGlow} from '../environments/ParentsKitchen';
import {Finger, Phone} from '../inserts/PhoneUI';
import {MomHalfLamp, SplitCall} from './family';
import {MOM, SAM, useT} from './kit';

const ALARM = {kind: 'alarm' as const, date: 'Sun, Nov 9', time: '18:00', label: 'CALL MOM · 10 MIN'};
// HOOK 1:44 — the alarm; finger hovers over SNOOZE… presses STOP
const A: React.FC = () => {
  const {t} = useT();
  const fy = keys(t, [0, 24, 44, 52], [700, 60, 60, 170], EASE);
  const fx = t < 44 ? noise('sn', t * 0.6) * 5 : 0;
  return (
    <Shot bg="#222" zoom={[1.05, 1.1]}>
      <Layer depth={0.5} blur={8}>
        <CityKitchen mood="night" />
      </Layer>
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={{...ALARM, pressed: t > 50 && t < 58 ? 'stop' : undefined}} buzz={t < 50 ? 1 : 0} hand={false} />
        <g transform={`translate(${960 + fx} ${560 + 1.05 * 110 + fy})`}>
          <Finger x={0} y={0} />
        </g>
      </Layer>
      <Sfx name="alarm" at={0} volume={0.5} dur={50} />
      <Sfx name="tap" at={50} volume={0.9} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot zoom={[1.0, 1.03]} ungraded={<MomHalfLamp />} overlay={<><Line text="Hi, Mom." from={4} to={30} /><Line text="Son?! Is everything okay?" from={34} to={75} /></>}>
      <SplitCall g={g} samExpr="awkward" momExpr="surprised" samTalk={t < 24 ? 0.8 : 0} momTalk={t > 34 && t < 64 ? 1 : 0} />
      <Sfx name="ringback" at={0} volume={0.5} dur={4} />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 2.2, fx: 960, fy: 520})} overlay={<Line text="Yeah. I just… wanted to hear you." from={6} to={75} />}>
      <Layer depth={0.7} blur={4}>
        <CityKitchen mood="night" />
      </Layer>
      <Layer depth={1}>{SAM({x: 960, y: 1060, frame: g, scale: 2.0, expr: 'sad', talk: t > 6 && t < 50 ? 0.7 : 0, look: [0, 3], rig: {armB: [-168, -150], armF: [10, 6], head: 8}, handItemBack: <Phone x={0} y={-20} scale={0.1} mode={{kind: 'off'}} hand={false} glow={0} />})}</Layer>
    </Shot>
  );
};
const D: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 2.2, fx: 960, fy: 520})} ungraded={<Layer depth={0.7}><MomLampGlow x={960} y={300} /></Layer>}>
      <Layer depth={0.7} blur={4}>
        <MomKitchen noLampGlow table={false} />
      </Layer>
      <Layer depth={1}>{MOM({x: 960, y: 1060, frame: g, scale: 2.1, expr: t > 16 ? 'happy' : 'surprised', facing: -1, tilt: t > 16 ? 8 : 0, rig: {armB: [-168, -150], armF: [10, 6], head: 6}, handItemBack: <Phone x={0} y={-20} scale={0.1} mode={{kind: 'off'}} hand={false} glow={0} />})}</Layer>
    </Shot>
  );
};
export const S16 = [A, B, C3, D];
