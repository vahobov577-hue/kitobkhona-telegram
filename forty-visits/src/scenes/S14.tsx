import React from 'react';
import {Line, Shot} from '../effects/Shot';
import {BenchOTS} from './common';
import {useT} from './kit';

const A: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot drift={[-20, 0]} overlay={<Line text="Most people never count." from={6} to={76} />}>
      <BenchOTS g={g} subject="arthur" expr="neutral" talk={t > 6 && t < 50 ? 0.8 : 0} tilt={-5} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.7, fx: 960, fy: 420})} overlay={<Line text="Forty is… nothing." from={10} to={78} />}>
      <BenchOTS g={g} subject="sam" expr="sad" talk={t > 10 && t < 50 ? 0.7 : 0} fg={false} look={[0, 4]} />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot drift={[-20, 0]} overlay={<Line text="Then don't make it forty. Make it more." from={6} to={78} />}>
      <BenchOTS g={g} subject="arthur" expr={t > 40 ? 'happy' : 'neutral'} talk={t > 6 && t < 60 ? 0.8 : 0} tilt={6} />
    </Shot>
  );
};
export const S14 = [A, B, C3];
