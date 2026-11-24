import React from 'react';
import {Layer} from '../effects/Parallax';
import {Line, Shot} from '../effects/Shot';
import {Hill} from '../environments/Hill';
import {DAD, MOM, SAM, useT} from './kit';

// OTS over Mom's shoulder on the hilltop
const A: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot sat={1} overlay={<Line text="So how many visits left?" from={10} to={74} />}>
      <Layer depth={0.5} blur={3}>
        <Hill view="back" />
      </Layer>
      <Layer depth={1}>
        {SAM({x: 1180, y: 1000, frame: g, scale: 2.2, pose: 'stand', facing: -1, expr: 'neutral', look: [-5, 0]})}
        {DAD({x: 1500, y: 1040, frame: g, scale: 2.0, pose: 'stand', facing: -1, expr: 'happy', look: [-6, 0]})}
      </Layer>
      <Layer depth={1.3} blur={14}>
        {MOM({x: 520, y: 1400, frame: g, scale: 3.6, pose: 'stand', back: true, talk: t > 10 && t < 50 ? 0.6 : 0})}
      </Layer>
    </Shot>
  );
};
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot sat={1} cam={() => ({zoom: 2.0, fx: 960, fy: 520, x: 0, y: -20})} overlay={<Line text="I stopped counting." from={14} to={78} />}>
      <Layer depth={0.5} blur={5}>
        <Hill view="back" />
      </Layer>
      <Layer depth={1}>
        {SAM({x: 960, y: 1000, frame: g, scale: 2.2, pose: 'stand', expr: 'neutral', talk: t > 14 && t < 46 ? 0.6 : 0, look: [-3, -1], tilt: 4})}
      </Layer>
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot sat={1} cam={() => ({zoom: 2.6, fx: 960, fy: 450, x: 0, y: 0})} overlay={<Line text="I just go." from={22} to={80} />}>
      <Layer depth={0.5} blur={6}>
        <Hill view="back" />
      </Layer>
      <Layer depth={1}>
        {SAM({x: 960, y: 1000, frame: g, scale: 2.2, pose: 'stand', expr: t > 20 ? 'happy' : 'closed', talk: t > 22 && t < 44 ? 0.5 : 0, look: [0, -2]})}
      </Layer>
    </Shot>
  );
};
export const S34 = [A, B, C3];
