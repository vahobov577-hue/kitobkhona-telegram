import React from 'react';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {Umbrella} from '../environments/ParkBench';
import {Rain} from '../effects/Rain';
import {BenchOTS, BenchWide} from './common';
import {useT} from './kit';

const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot drift={[-20, 0]}>
      <BenchWide g={g} mood="rain" samExpr="sad" pigeons={false} samHand={<g />} extra={<Umbrella x={960} y={480} />} />
      <Sfx name="rain" at={0} volume={0.7} dur={240} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot overlay={<Line text="Missed one?" from={10} to={70} />} drift={[-20, 0]}>
      <BenchOTS g={g} subject="arthur" mood="rain" expr="neutral" talk={t > 10 && t < 30 ? 0.8 : 0} tilt={-6} />
      <Layer depth={1.1}>
        <Rain n={60} amount={0.6} />
      </Layer>
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot overlay={<><Line text="Yeah." from={6} to={30} /><Line text="Then call Monday." from={36} to={80} /></>} drift={[20, 0]}>
      <BenchOTS g={g} subject="sam" mood="rain" expr={t > 40 ? 'neutral' : 'sad'} talk={t > 6 && t < 16 ? 0.7 : 0} look={[5, 2]} />
      <Layer depth={1.1}>
        <Rain n={60} amount={0.6} />
      </Layer>
    </Shot>
  );
};
export const S20 = [A, B, C3];
