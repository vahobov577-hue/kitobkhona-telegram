import React from 'react';
import {EASE, keys} from '../lib';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Line, Shot} from '../effects/Shot';
import {Park} from '../environments/ParkBench';
import {Napkin} from '../inserts/Inserts';
import {BenchOTS} from './common';
import {useT} from './kit';

const A: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot drift={[20, 0]} overlay={<Line text="I'll go home when work calms down." from={10} to={110} />}>
      <BenchOTS g={g} subject="sam" expr="tired" talk={t > 10 && t < 70 ? 0.8 : 0} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot drift={[-20, 0]} overlay={<><Line text="It never calms down." from={6} to={46} /><Line text="How many times will you see her again?" from={62} to={118} /></>}>
      <BenchOTS g={g} subject="arthur" expr={t > 60 ? 'sad' : 'neutral'} talk={(t > 6 && t < 36) || (t > 62 && t < 100) ? 0.8 : 0} tilt={t > 60 ? -8 : 0} />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.7, fx: 960, fy: 420})} overlay={<Line text="Lots." from={30} to={90} />}>
      <BenchOTS g={g} subject="sam" expr={t > 30 ? 'neutral' : 'surprised'} talk={t > 30 && t < 44 ? 0.8 : 0} fg={false} look={[-6, 0]} />
    </Shot>
  );
};
// insert: Arthur hands over a napkin and a pen — "Count."
const D: React.FC = () => {
  const {t} = useT();
  const x = keys(t, [0, 30], [1500, 1000], EASE);
  return (
    <Shot zoom={[1.0, 1.04]} overlay={<Line text="Count." from={40} to={118} />}>
      <Layer depth={0.5} blur={10}>
        <Park mood="grey" />
      </Layer>
      <Layer depth={1}>
        <g transform={`translate(${x - 1000} 0)`}>
          <Napkin x={960} y={560} s={0.9} rot={-6} reveal={0} />
          <rect x={1080} y={520} width={300} height={16} rx={8} fill="#22324a" transform="rotate(-20 1230 528)" />
          <g fill={C.sil}>
            <ellipse cx={1260} cy={640} rx={90} ry={70} />
            <rect x={1240} y={600} width={900} height={120} rx={60} />
          </g>
        </g>
      </Layer>
    </Shot>
  );
};
export const S12 = [A, B, C3, D];
