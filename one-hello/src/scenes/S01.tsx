import React from 'react';
import {Narr, Sfx, Shot} from '../effects/Shot';

const A: React.FC = () => (
  <Shot bg="#000" grain vignette={0} overlay={<Narr text="143 people wished me happy birthday." from={4} to={90} size={70} />}>
    <Sfx name="buzz" at={50} volume={0.35} />
  </Shot>
);
export const S01 = [A];
