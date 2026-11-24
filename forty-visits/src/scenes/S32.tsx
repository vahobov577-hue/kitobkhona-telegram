import React from 'react';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {Park} from '../environments/ParkBench';
import {Pigeon, Sandwich} from '../characters/Extras';
import {BenchOTS, SEAT_Y} from './common';
import {ARTHUR, MOM, SAM, useT} from './kit';

const A: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot zoom={[1.0, 1.04]} sat={1} overlay={<Line text="Arthur, this is my mom." from={14} to={76} />}>
      <Layer depth={1}>
        <Park mood="day" />
        {ARTHUR({x: 1180, y: SEAT_Y + 62, frame: g, scale: 1.3, pose: 'sit', facing: -1, expr: 'happy', look: [-4, 0]})}
        {MOM({x: 860, y: 860, frame: g, scale: 1.35, pose: 'stand', expr: 'happy', look: [5, 0], rig: {armF: [70, 10]}})}
        {SAM({x: 700, y: 860, frame: g, scale: 1.35, pose: 'stand', expr: 'happy', talk: t > 14 && t < 50 ? 0.6 : 0, look: [5, 0], rig: {armF: [60, 20]}})}
        {[0, 1, 2].map((i) => (
          <Pigeon key={i} x={1380 + i * 70} y={862} frame={g} s={0.9} facing={i % 2 ? 1 : -1} seed={'p' + i} />
        ))}
      </Layer>
      <Sfx name="pigeons" at={0} volume={0.4} dur={80} />
    </Shot>
  );
};
// medium: three on the bench, sandwiches shared
const B: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.6, fx: 960, fy: 700, x: 0, y: 700 - 540})} sat={1}>
      <Layer depth={1}>
        <Park mood="day" />
        {MOM({x: 700, y: SEAT_Y + 62, frame: g, scale: 1.3, pose: 'sit', expr: 'happy', look: [5, 0], handItem: <Sandwich />})}
        {ARTHUR({x: 1010, y: SEAT_Y + 62, frame: g, scale: 1.3, pose: 'sit', facing: -1, expr: 'happy', look: [-4, 0], handItem: <Sandwich />})}
        {SAM({x: 1250, y: SEAT_Y + 62, frame: g, scale: 1.3, pose: 'sit', facing: -1, expr: 'happy', look: [-4, 0]})}
      </Layer>
      <Sfx name="city" at={0} volume={0.2} dur={80} />
    </Shot>
  );
};
// close: Arthur laughs ^ ^
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot sat={1}>
      <BenchOTS g={g} subject="arthur" mood="day" expr="happy" talk={t > 10 && t < 60 ? 1 : 0} tilt={-4} />
      <Sfx name="laugh" at={10} volume={0.5} />
    </Shot>
  );
};
export const S32 = [A, B, C3];
