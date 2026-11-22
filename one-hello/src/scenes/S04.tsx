import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ramp} from '../lib';
import {Narr, Sfx, Shot} from '../effects/Shot';
import {Birthday, BIRTHDAY_LEO} from './common';
import {useT} from './kit';

// close: eyes in candlelight
const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot bg="#16171a" zoom={[1, 1.03]} cam={() => ({zoom: 3.4, fx: BIRTHDAY_LEO.x + 70, fy: 520})} overlay={<Narr text="Not one of them called." from={8} to={60} y={860} size={58} />}>
      <Birthday frame={g} mood="dark" phone="down" expr="sad" look={[6, 2]} />
    </Shot>
  );
};
// close: he leans in and blows — darkness
const B: React.FC = () => {
  const {t, g} = useT();
  const out = ramp(t, 26, 30);
  return (
    <Shot bg="#16171a" zoom={[1, 1.03]} cam={() => ({zoom: 2.4, fx: 880, fy: 540})} overlay={<AbsoluteFill style={{background: '#000', opacity: ramp(t, 28, 40)}} />}>
      <Birthday frame={g} mood="dark" phone="down" expr="closed" candle={1 - out} />
      <Sfx name="blow" at={22} volume={0.8} />
    </Shot>
  );
};
export const S04 = [A, B];
