import React from 'react';
import {Sfx, Shot} from '../effects/Shot';
import {Birthday, BIRTHDAY_LEO} from './common';
import {useT} from './kit';

/** the exact S3 framing (re-used by S31) */
export const BIRTHDAY_CAM = {drift: [30, 0] as [number, number], zoom: [1.0, 1.08] as [number, number]};

const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot bg="#16171a" drift={BIRTHDAY_CAM.drift} zoom={BIRTHDAY_CAM.zoom}>
      <Birthday frame={g} mood="dark" phone="hand" />
      <Sfx name="clock" at={0} volume={0.4} dur={80} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {g} = useT();
  return (
    <Shot bg="#16171a" zoom={[1.0, 1.04]} cam={() => ({zoom: 2.0, fx: BIRTHDAY_LEO.x + 90, fy: 480})}>
      <Birthday frame={g} mood="dark" phone="hand" look={[3, 4]} />
    </Shot>
  );
};
export const S03 = [A, B];
