import React from 'react';
import {Line, Shot} from '../effects/Shot';
import {CoffeeOTS, useT} from './kit';

const A: React.FC = () => (
  <Shot overlay={<Line text="Someone ignored you?" from={8} to={76} />} drift={[-20, 0]}>
    <CoffeeOTS subject="mia" expr="worried" talk={1} tilt={-6} />
  </Shot>
);
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot overlay={<Line text="Yeah." from={24} to={78} />} drift={[20, 0]}>
      <CoffeeOTS subject="leo" expr="sad" talk={t > 24 && t < 40 ? 0.6 : 0} look={[0, 4]} />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 1.6, fx: 960, fy: 380})} overlay={<Line text="Good. That means you said it." from={10} to={80} />}>
      <CoffeeOTS subject="mia" expr={t > 30 ? 'happy' : 'neutral'} talk={t < 60 ? 1 : 0} close fg={false} tilt={5} />
    </Shot>
  );
};
export const S18 = [A, B, C3];
