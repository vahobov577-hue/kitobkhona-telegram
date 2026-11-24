import React from 'react';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Hill} from '../environments/Hill';
import {DAD, MOM, SAM, useT} from './kit';

// far: three tiny figures walking up the path, Dad slowest
const A: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot zoom={[1.0, 1.05]} sat={1}>
      <Layer depth={1}>
        <Hill view="top" />
        {SAM({x: 1000 - t * 0.3, y: 840 - t * 0.9, frame: g, scale: 0.42, pose: 'walk', expr: 'happy', facing: -1})}
        {MOM({x: 960 - t * 0.2, y: 900 - t * 0.8, frame: g, scale: 0.42, pose: 'walk', expr: 'happy', facing: -1})}
        {DAD({x: 950 - t * 0.15, y: 980 - t * 0.6, frame: g, scale: 0.44, pose: 'walk', expr: 'happy', speed: 0.5, facing: -1})}
      </Layer>
      <Sfx name="birds" at={0} volume={0.4} dur={120} />
    </Shot>
  );
};
// from behind: the path to the top, sky opens
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot zoom={[1.0, 1.06]} sat={1} cam={() => ({zoom: 1, fx: 960, fy: 540, x: 0, y: -t * 0.4})}>
      <Layer depth={1}>
        <Hill view="back" />
        {MOM({x: 860, y: 1000 - t * 1.4, frame: g, scale: 1.4 - t * 0.003, pose: 'walk', back: true})}
        {SAM({x: 1060, y: 1010 - t * 1.4, frame: g, scale: 1.45 - t * 0.003, pose: 'walk', back: true, rig: {armB: [-40, -10]}})}
        {DAD({x: 1180, y: 1100 - t * 1.0, frame: g, scale: 1.6 - t * 0.003, pose: 'walk', back: true, speed: 0.5})}
      </Layer>
      <Sfx name="birds" at={0} volume={0.4} dur={120} />
    </Shot>
  );
};
export const S33 = [A, B];
