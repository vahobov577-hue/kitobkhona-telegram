import React from 'react';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {Park} from '../environments/ParkBench';
import {DeskPhone} from '../inserts/Inserts';
import {C} from '../theme';
import {BenchWide} from './common';
import {useT} from './kit';

const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot drift={[-30, 0]}>
      <BenchWide g={g} samExpr="tired" />
      <Sfx name="city" at={0} volume={0.5} dur={240} />
      <Sfx name="pigeons" at={10} volume={0.4} />
    </Shot>
  );
};
// insert: MOM calling in his hand — he declines
const B: React.FC = () => {
  const {t} = useT();
  const press = t > 44;
  return (
    <Shot zoom={[1.02, 1.08]}>
      <Layer depth={0.5} blur={10}>
        <Park mood="grey" />
      </Layer>
      <Layer depth={1}>
        <DeskPhone x={960} y={560} s={0.9} mode="incoming" pressed={press && t < 52 ? 'red' : undefined} buzz={press ? 0 : 1} frame={t} />
        <g fill={C.sil}>
          <path d="M 1230 1180 L 1200 760 Q 1190 640 1080 650 L 1120 1180 Z" />
          <path d={`M 700 1180 Q 760 900 ${press ? 870 : 760} ${press ? 820 : 900}`} stroke={C.sil} strokeWidth={60} strokeLinecap="round" fill="none" />
        </g>
      </Layer>
      <Sfx name="buzz" at={0} volume={0.7} dur={44} />
      <Sfx name="decline" at={44} volume={0.9} />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.5, fx: 960, fy: 560})} overlay={<><Line text="You should get that." from={4} to={36} /><Line text="She just wants to talk about the weather." from={40} to={80} /></>}>
      <BenchWide g={g} samExpr="tired" arthurExpr="neutral" arthurTalk={t < 30 ? 0.7 : 0} samTalk={t > 40 && t < 70 ? 0.8 : 0} />
    </Shot>
  );
};
export const S06 = [A, B, C3];
