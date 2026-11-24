import React from 'react';
import {EASE, keys, ramp} from '../lib';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {CityKitchen, LaptopDesk} from '../environments/CityApartment';
import {Finger, Phone} from '../inserts/PhoneUI';
import {Rain} from '../effects/Rain';
import {SamAtLaptop} from './S03';
import {useT} from './kit';

const ALARM = {kind: 'alarm' as const, date: 'Sun, Nov 30', time: '18:00', label: 'CALL MOM · 10 MIN'};
const Bg: React.FC = () => (
  <Layer depth={0.5} blur={8}>
    <CityKitchen mood="night" />
  </Layer>
);
// HOOK 2:10 — SNOOZE
const A: React.FC = () => {
  const {t} = useT();
  const fy = keys(t, [0, 20, 26, 60], [600, 0, 0, 600], EASE);
  return (
    <Shot bg="#222" zoom={[1.06, 1.1]}>
      <Bg />
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={{...ALARM, pressed: t > 20 && t < 30 ? 'snooze' : undefined}} buzz={t < 22 ? 1 : 0} hand={false} />
        <g transform={`translate(960 ${560 + 1.05 * 110 + fy})`}>
          <Finger x={0} y={0} />
        </g>
      </Layer>
      <Sfx name="alarm" at={0} volume={0.5} dur={22} />
      <Sfx name="tap" at={22} volume={0.9} />
    </Shot>
  );
};
// insert: declines, types "busy, next week", mom answers
const B: React.FC = () => {
  const {t} = useT();
  const typed = 'busy, next week';
  const msgs = [
    {text: typed.slice(0, Math.floor(ramp(t, 6, 26) * typed.length)) || ' ', me: true, meta: 'Missed call · Mom'},
    ...(t > 34 ? [{text: "Okay ♥ don't work too hard"}] : []),
  ];
  return (
    <Shot bg="#222" zoom={[1.08, 1.12]}>
      <Bg />
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={{kind: 'chat', title: 'Mom', msgs}} />
      </Layer>
      <Sfx name="decline" at={0} volume={0.7} />
      {[8, 12, 16, 20, 24].map((a) => (
        <Sfx key={a} name="key" at={a} volume={0.35} dur={8} />
      ))}
      <Sfx name="ping" at={34} volume={0.5} />
    </Shot>
  );
};
// wide: rain on the window, he works
const C3: React.FC = () => (
  <Shot zoom={[1.0, 1.03]}>
    <Layer depth={1}>
      <LaptopDesk>
        <rect x={0} y={0} width={760} height={40} fill="#3a6a4a" />
        {Array.from({length: 12}).map((_, r) =>
          Array.from({length: 6}).map((__, c) => <rect key={r + '-' + c} x={10 + c * 124} y={50 + r * 34} width={118} height={28} fill={(r + c) % 5 === 0 ? '#cfe3d6' : '#fff'} stroke="#cfd6dc" />),
        )}
      </LaptopDesk>
      <g>
        <clipPath id="rwin">
          <rect x={1300} y={120} width={520} height={420} />
        </clipPath>
        <g clipPath="url(#rwin)">
          <rect x={1300} y={120} width={520} height={420} fill="#0a0e18" opacity={0.4} />
          <Rain n={120} color="#e8eef4" len={50} />
        </g>
      </g>
    </Layer>
    <Sfx name="rain" at={0} volume={0.7} dur={60} />
  </Shot>
);
const D: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 2.2, fx: 960, fy: 520, x: 0, y: 0})} overlay={<Line text="Next week?" from={6} to={58} color={C.orange} />}>
      <SamAtLaptop g={g} expr="tired" look={[0, 2]} />
      <Sfx name="rain" at={0} volume={0.5} dur={60} />
    </Shot>
  );
};
export const S19 = [A, B, C3, D];
