import React from 'react';
import {keys} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Park} from '../environments/ParkBench';
import {MomChat} from '../inserts/Inserts';
import {BenchOTS} from './common';
import {useT} from './kit';

const Bg: React.FC = () => (
  <Layer depth={0.5} blur={10}>
    <Park mood="grey" />
  </Layer>
);
const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot zoom={[1.0, 1.05]}>
      <Bg />
      <Layer depth={1}>
        <MomChat x={960} y={560} s={1.05} rot={-3} scroll={keys(t, [0, 70], [0, 40])} />
      </Layer>
      <Sfx name="scroll" at={8} volume={0.4} />
    </Shot>
  );
};
// insert: the unplayed voice message (blue dot)
const B: React.FC = () => (
  <Shot cam={(t) => ({zoom: keys(t, [0, 70], [1.6, 1.9]), fx: 960, fy: 640})}>
    <Bg />
    <Layer depth={1}>
      <MomChat x={960} y={560} s={1.05} rot={-3} scroll={40} />
    </Layer>
  </Shot>
);
const C3: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.2, fx: 960, fy: 420})}>
      <BenchOTS g={g} subject="sam" expr="tired" look={[0, 5]} fg={false} />
    </Shot>
  );
};
export const S08 = [A, B, C3];
