import React from 'react';
import {Line, Shot} from '../effects/Shot';
import {CoffeeOTS, useT} from './kit';

const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot overlay={<Line text="There's one I can't do." from={10} to={96} />} drift={[20, 0]}>
      <CoffeeOTS subject="leo" expr="sad" talk={t > 10 && t < 60 ? 1 : 0} look={[0, 3]} leaves={1} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot overlay={<><Line text="Who?" from={6} to={36} /><Line text="My best friend. I just… stopped answering." from={42} to={100} /></>} drift={[-20, 0]}>
      <CoffeeOTS subject="mia" expr={t < 40 ? 'surprised' : 'worried'} talk={t < 24 ? 0.6 : 0} tilt={t > 40 ? -6 : 0} />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 1.6, fx: 960, fy: 380})} overlay={<Line text="Then that's tomorrow's hello." from={14} to={100} />}>
      <CoffeeOTS subject="mia" expr={t > 30 ? 'happy' : 'neutral'} talk={t > 14 && t < 70 ? 1 : 0} close fg={false} tilt={6} />
    </Shot>
  );
};
export const S26 = [A, B, C3];
