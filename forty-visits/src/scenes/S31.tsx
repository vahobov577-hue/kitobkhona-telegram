import React from 'react';
import {EASE_IN, keys, ramp, rnd} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {CityKitchen} from '../environments/CityApartment';
import {Park} from '../environments/ParkBench';
import {MarbleJar, PlanCalendar} from '../inserts/Inserts';
import {JAR, JAR_CAM} from './S04';
import {SAM, useT} from './kit';

// LOOP ↔ S4: the same jar frame — this time the marble lands INSIDE a nearly full jar
const A: React.FC = () => {
  const {t} = useT();
  const N = 58;
  const land = -22 - Math.floor(N / 6) * 38;
  const y = keys(t, [4, 25], [-900, land], EASE_IN);
  return (
    <Shot bg="#111" cam={JAR_CAM} zoom={[1.0, 1.02]}>
      <Layer depth={1}>
        <CityKitchen mood="warm">
          <MarbleJar x={JAR.x} y={JAR.y} s={JAR.s} n={t >= 25 ? N + 1 : N} falling={t < 25 ? [-110 + (N % 6) * 44, y] : null} />
        </CityKitchen>
      </Layer>
      <Sfx name="clink" at={25} volume={0.9} />
    </Shot>
  );
};
const Flakes: React.FC<{t: number; color: string; n: number; fall: number; r: number}> = ({t, color, n, fall, r}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const x = rnd('fx' + i) * 2200 - 140 + Math.sin(t * 0.05 + i) * 20;
      const y = ((rnd('fy' + i) * 1200 + t * fall * (0.6 + rnd('fs' + i))) % 1200) - 60;
      return <circle key={i} cx={x} cy={y} r={r * (0.6 + rnd('fr' + i))} fill={color} opacity={0.85} />;
    })}
  </g>
);
// seasons dissolve on the bench: winter → spring → summer
const B: React.FC = () => {
  const {t, g} = useT();
  const sp = ramp(t, 25, 45);
  const su = ramp(t, 60, 80);
  return (
    <Shot zoom={[1.0, 1.04]}>
      <Layer depth={1}>
        <Park mood="grey" />
        <rect x={-300} y={860} width={2600} height={400} fill="#f4f6f8" opacity={0.9 * (1 - sp)} />
        <g opacity={sp}>
          <Park mood="day" />
        </g>
        <g opacity={1 - sp}>
          <Flakes t={t} color="#fff" n={90} fall={3} r={5} />
        </g>
        <g opacity={sp * (1 - su)}>
          <Flakes t={t} color="#f6b8cf" n={40} fall={1.5} r={7} />
        </g>
        {SAM({x: 860, y: 860, frame: g, scale: 1.3, pose: 'sit', expr: 'happy', look: [3, -1]})}
      </Layer>
    </Shot>
  );
};
// the calendar now: VISIT HOME, regularly, nothing crossed
const C3: React.FC = () => {
  const {t} = useT();
  return (
    <Shot zoom={[1.0, 1.05]}>
      <Layer depth={0.5} blur={8}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#e8dcc4" />
      </Layer>
      <Layer depth={1}>
        <PlanCalendar x={960} y={560} s={1.25} month="NEXT YEAR" entries={[
          {text: 'VISIT HOME · Apr', cross: 0, show: ramp(t, 4, 14)},
          {text: 'VISIT HOME · Aug', cross: 0, show: ramp(t, 24, 34)},
          {text: 'VISIT HOME · Dec', cross: 0, show: ramp(t, 44, 54)},
        ]} />
      </Layer>
      {[4, 24, 44].map((a) => (
        <Sfx key={a} name="pencil" at={a} volume={0.4} dur={10} />
      ))}
    </Shot>
  );
};
export const S31 = [A, B, C3];
