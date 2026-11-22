import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Sfx, Shot, Title} from '../effects/Shot';
import {ramp} from '../lib';

const A: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <Shot bg="#000" vignette={0} overlay={<div style={{opacity: 1 - ramp(t, 46, 56)}}><Title text="ONE HELLO" size={130} /></div>}>
      <Sfx name="ringback" at={44} volume={0.9} dur={46} />
    </Shot>
  );
};
export const S05 = [A];
