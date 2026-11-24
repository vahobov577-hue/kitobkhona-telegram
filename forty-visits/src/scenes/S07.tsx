import React from 'react';
import {Line, Sfx, Shot} from '../effects/Shot';
import {BenchOTS, BenchWide} from './common';
import {useT} from './kit';

const A: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot drift={[-20, 0]} overlay={<Line text="I'd give anything to hear about the weather." from={10} to={84} />}>
      <BenchOTS g={g} subject="arthur" expr={t > 40 ? 'sad' : 'neutral'} talk={t > 10 && t < 70 ? 0.8 : 0} tilt={-6} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {g} = useT();
  return (
    <Shot zoom={[0.98, 1.0]} cam={() => ({zoom: 0.95, fx: 960, fy: 600})}>
      <BenchWide g={g} samExpr="sad" arthurExpr="sad" flyAt={g - 10} />
      <Sfx name="flap" at={8} volume={0.8} />
    </Shot>
  );
};
export const S07 = [A, B];
