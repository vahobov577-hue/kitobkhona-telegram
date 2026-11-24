import React from 'react';
import {ramp} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {ChildhoodRoom} from '../environments/ChildhoodRoom';
import {Napkin} from '../inserts/Inserts';
import {SAM, useT} from './kit';

const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot zoom={[1.0, 1.04]} sat={1}>
      <Layer depth={1}>
        <ChildhoodRoom />
        {SAM({x: 1180, y: 900, frame: g, scale: 1.5, pose: 'sit', expr: 'neutral', look: [3, 3], rig: {armF: [60, 10]}})}
      </Layer>
      <Sfx name="tick" at={0} volume={0.3} dur={90} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#2a2420" zoom={[1.02, 1.06]} sat={1}>
      <Layer depth={1}>
        <rect x={-300} y={-300} width={2600} height={1700} fill="#5a4636" />
        <Napkin x={960} y={540} s={1.15} rot={-3} reveal={5} circle={1} strike={ramp(t, 10, 30)} extra={ramp(t, 40, 75)} />
      </Layer>
      <Sfx name="pencil" at={10} volume={0.6} dur={20} />
      <Sfx name="pencil" at={40} volume={0.6} dur={35} />
    </Shot>
  );
};
export const S30 = [A, B];
