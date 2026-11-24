import React from 'react';
import {Sfx, Shot, Title} from '../effects/Shot';
const A: React.FC = () => (
  <Shot bg="#000" vignette={0} overlay={<Title text="40 VISITS" size={130} />}>
    <Sfx name="oldring" at={18} volume={0.8} dur={30} />
  </Shot>
);
export const S05 = [A];
