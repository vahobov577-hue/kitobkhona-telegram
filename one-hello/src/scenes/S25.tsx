import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE, keys, noise, ramp} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Finger, Phone} from '../inserts/PhoneUI';
import {Kitchen} from '../environments/Apartment';
import {CalendarSheet, cellsOf} from '../inserts/Calendar';
import {Birthday, BIRTHDAY_LEO} from './common';
import {useT} from './kit';

// insert: thumb over CALL, heartbeat
const A: React.FC = () => {
  const {t} = useT();
  const fy = keys(t, [0, 30], [600, 60], EASE);
  return (
    <Shot bg="#111" cam={() => ({zoom: 1.6, fx: 1060, fy: 300})}>
      <Layer depth={0.5} blur={8}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#1d1e22" />
      </Layer>
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={{kind: 'contact', typed: 'Hey', caret: false}} hand={false} />
        <g transform={`translate(${960 + 1.05 * 130 + noise('cf', t * 0.7) * 5} ${560 + 1.05 * -330 + fy})`}>
          <Finger x={0} y={0} />
        </g>
      </Layer>
      <Sfx name="heartbeat" at={0} volume={0.9} dur={80} />
    </Shot>
  );
};
// close: his face — he locks the phone (light goes out)
const B: React.FC = () => {
  const {t, g} = useT();
  const off = ramp(t, 56, 60);
  return (
    <Shot cam={() => ({zoom: 3.0, fx: BIRTHDAY_LEO.x + 80, fy: 520})} overlay={<AbsoluteFill style={{background: '#000', opacity: off * 0.45}} />}>
      <Birthday frame={g} mood="dark" phone="hand" candle={0} cake={false} screen="contact" expr={t < 56 ? 'worried' : 'sad'} look={[5, 3]} />
      <Sfx name="heartbeat" at={0} volume={0.9} dur={56} />
      <Sfx name="lock" at={56} volume={0.8} />
    </Shot>
  );
};
// insert: one empty cell — DAY 29
const C3: React.FC = () => (
  <Shot bg="#cfcdc8" cam={() => ({zoom: 1.9, fx: 500, fy: 320, x: 500 - 960, y: 320 - 540})}>
    <Layer depth={1}>
      <Kitchen>
        <CalendarSheet x={-60} y={10} s={0.5} title="1 HELLO A DAY" cells={cellsOf((i) => (i < 28 ? 'check' : i === 28 ? 'today' : 'empty'))} label={(i) => (i === 28 ? 'DAY 29' : undefined)} />
      </Kitchen>
    </Layer>
  </Shot>
);
export const S25 = [A, B, C3];
