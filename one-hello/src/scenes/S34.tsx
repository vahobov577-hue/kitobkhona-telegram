import React from 'react';
import {Line, Shot} from '../effects/Shot';
import {CoffeeOTS, useT} from './kit';

const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot overlay={<Line text="So you made twenty friends?" from={6} to={76} />} drift={[-20, 0]}>
      <CoffeeOTS subject="mia" expr={t > 40 ? 'happy' : 'neutral'} talk={t < 50 ? 1 : 0} tilt={-5} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 1.6, fx: 960, fy: 380})} overlay={<><Line text="No." from={4} to={30} /><Line text="Seven. Real ones." from={36} to={80} /></>}>
      <CoffeeOTS subject="leo" expr={t > 40 ? 'happy' : 'neutral'} talk={(t > 4 && t < 14) || (t > 36 && t < 60) ? 0.8 : 0} close fg={false} leaves={0} />
    </Shot>
  );
};
const C3: React.FC = () => (
  <Shot cam={() => ({zoom: 1.6, fx: 960, fy: 380})}>
    <CoffeeOTS subject="mia" expr="happy" close fg={false} tilt={7} />
  </Shot>
);
export const S34 = [A, B, C3];
