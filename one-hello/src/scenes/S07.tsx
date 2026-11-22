import React from 'react';
import {Line, Shot} from '../effects/Shot';
import {CoffeeOTS, useT} from './kit';

const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot overlay={<Line text="Happy birthday! Doing anything?" from={8} to={88} />} drift={[-20, 0]}>
      <CoffeeOTS subject="mia" expr={t < 40 ? 'happy' : 'neutral'} talk={t < 70 ? 1 : 0} tilt={t > 40 ? 6 : 0} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 1.6, fx: 960, fy: 380})} overlay={<Line text="…Working." from={46} to={90} />}>
      <CoffeeOTS subject="leo" expr={t < 40 ? 'awkward' : 'sad'} look={t < 40 ? [-6, 2] : [0, 4]} talk={t > 46 ? 0.6 : 0} close fg={false} />
    </Shot>
  );
};
export const S07 = [A, B];
