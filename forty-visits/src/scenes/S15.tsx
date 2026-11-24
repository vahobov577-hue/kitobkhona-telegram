import React from 'react';
import {EASE, keys, ramp} from '../lib';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {CityFridge, CityKitchen, COUNTER_TOP} from '../environments/CityApartment';
import {Sheet} from '../inserts/Calendar';
import {MarbleJar} from '../inserts/Inserts';
import {SAM, useT} from './kit';

export const RULE = (k: number) => [
  {text: 'EVERY SUNDAY', size: 60, font: 'title' as const, color: k > 0 ? '#222' : '#222'},
  {text: 'CALL MOM', size: 84, color: C.red},
  {text: '10 MIN', size: 64},
];
const A: React.FC = () => {
  const {t} = useT();
  const k = ramp(t, 4, 70);
  return (
    <Shot cam={() => ({zoom: 1.9, fx: 780, fy: 230, x: 780 - 960, y: 230 - 540})}>
      <Layer depth={1}>
        <CityFridge>
          <clipPath id="ruleclip">
            <rect x={-300} y={-400} width={600} height={180 + k * 520} />
          </clipPath>
          <g clipPath="url(#ruleclip)">
            <Sheet x={0} y={0} s={0.55} lines={RULE(k)} h={520} />
          </g>
        </CityFridge>
      </Layer>
      <Sfx name="marker" at={4} volume={0.5} dur={70} />
    </Shot>
  );
};
// insert: one white marble in his palm
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#2a2c31" zoom={[1.05, 1.12]}>
      <Layer depth={0.5} blur={10}>
        <CityKitchen mood="night" />
      </Layer>
      <Layer depth={1}>
        <g fill={C.sil} transform={`translate(960 ${keys(t, [0, 20], [700, 640], EASE)})`}>
          <rect x={60} y={20} width={180} height={700} rx={80} transform="rotate(-25 150 20)" />
          <ellipse cx={0} cy={40} rx={190} ry={95} />
          {[-130, -60, 10, 80].map((fx, i) => (
            <rect key={i} x={fx} y={-30 - (i === 1 || i === 2 ? 14 : 0)} width={56} height={110} rx={28} transform={`rotate(${-12 + i * 8} ${fx + 28} 40)`} />
          ))}
          <rect x={-230} y={10} width={120} height={50} rx={25} transform="rotate(-30 -170 35)" />
        </g>
        <g transform={`translate(960 ${keys(t, [0, 20], [640, 580], EASE) - 30})`}>
          <circle r={34} fill="#f4f4f0" />
          <circle cx={-10} cy={-12} r={9} fill="#fff" />
        </g>
      </Layer>
    </Shot>
  );
};
// medium: he sets the empty jar on the counter
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.4, fx: 900, fy: 540})}>
      <Layer depth={1}>
        <CityKitchen mood="night">
          <MarbleJar x={1080} y={COUNTER_TOP + 10 - keys(t, [0, 24], [80, 0], EASE)} s={0.7} n={0} />
        </CityKitchen>
        {SAM({x: 760, y: 1080, frame: g, scale: 2.0, expr: 'determined', look: [6, 2], rig: {armF: [keys(t, [0, 24, 50], [80, 80, 20], EASE), 10]}})}
      </Layer>
      <Sfx name="clink" at={24} volume={0.4} />
    </Shot>
  );
};
export const S15 = [A, B, C3];
