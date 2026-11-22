import React from 'react';
import {Line, Shot} from '../effects/Shot';
import {CoffeeOTS, useT} from './kit';

const CLOSE = () => ({zoom: 1.6, fx: 960, fy: 380});

const A: React.FC = () => (
  <Shot overlay={<Line text="I couldn't even start." from={10} to={96} />} drift={[20, 0]}>
    <CoffeeOTS subject="leo" expr="sad" talk={1} look={[0, 3]} />
  </Shot>
);
const B: React.FC = () => (
  <Shot overlay={<Line text="You tried to make twenty friends at once." from={8} to={88} />} drift={[-20, 0]}>
    <CoffeeOTS subject="mia" expr="neutral" talk={1} tilt={-5} />
  </Shot>
);
const C3: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={CLOSE} overlay={<Line text="Yeah." from={30} to={90} />}>
      <CoffeeOTS subject="leo" expr="awkward" talk={t > 30 ? 0.6 : 0} close fg={false} look={[-5, 2]} />
    </Shot>
  );
};
const D: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={CLOSE} overlay={<Line text="Try one hello. One a day." from={18} to={100} />}>
      <CoffeeOTS subject="mia" expr={t > 10 ? 'happy' : 'neutral'} talk={t > 18 ? 1 : 0} close fg={false} tilt={6} />
    </Shot>
  );
};
export const S12 = [A, B, C3, D];
