import React from 'react';
import {EASE, keys, noise} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Finger, Phone} from '../inserts/PhoneUI';
import {InBed} from './S11';
import {useT} from './kit';

const ALARM = {kind: 'alarm' as const, date: 'Tue, Nov 4', time: '7:30', label: 'SAY HI TO 1 PERSON'};

const Bg: React.FC = () => (
  <Layer depth={0.5} blur={8}>
    <rect x={-500} y={-500} width={3000} height={2200} fill="#2a2c31" />
    <rect x={-500} y={700} width={3000} height={700} fill="#3a3d46" />
  </Layer>
);
// insert: the alarm, finger hovers over SNOOZE
const A: React.FC = () => {
  const {t} = useT();
  const fy = keys(t, [0, 40], [700, 0], EASE);
  return (
    <Shot bg="#222" zoom={[1.05, 1.1]}>
      <Bg />
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={ALARM} buzz={1} hand={false} />
        <g transform={`translate(${960 + noise('f14', t * 0.6) * 4} ${560 + 1.05 * (-390 + 500) + fy})`}>
          <Finger x={0} y={0} />
        </g>
      </Layer>
      <Sfx name="alarm" at={0} volume={0.5} dur={80} />
    </Shot>
  );
};
// close: Leo in bed, early light
const B: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 2.4, fx: 700, fy: 430})}>
      <InBed frame={g} expr="tired" mood="dawn" light="#f4f4f0" />
      <Sfx name="alarm" at={0} volume={0.35} dur={80} />
    </Shot>
  );
};
// insert: …and presses STOP
const C3: React.FC = () => {
  const {t} = useT();
  const pressed = t > 30;
  const fy = keys(t, [0, 28, 32, 70], [40, 100, 96, 600], EASE);
  return (
    <Shot bg="#222" zoom={[1.1, 1.13]}>
      <Bg />
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={{...ALARM, pressed: pressed && t < 40 ? 'stop' : undefined}} buzz={pressed ? 0 : 1} hand={false} />
        <g transform={`translate(960 ${560 + 1.05 * (-390 + 500) + fy})`}>
          <Finger x={0} y={0} />
        </g>
      </Layer>
      <Sfx name="tap" at={30} volume={0.9} />
    </Shot>
  );
};
export const S14 = [A, B, C3];
