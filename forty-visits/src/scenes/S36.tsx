import React from 'react';
import {Sfx, Shot, Title} from '../effects/Shot';

const A: React.FC = () => (
  <Shot bg="#000" grain={false} vignette={0} fadeIn={10} overlay={<Title text="40 VISITS" from={6} sub="Call them. While you still can." subFrom={40} />} />
);
const B: React.FC = () => (
  <Shot bg="#000" grain={false} vignette={0} overlay={<Title text="40 VISITS" from={-99} sub="Call them. While you still can." subFrom={-99} />}>
    <Sfx name="ringtone" at={60} volume={0.8} dur={30} />
  </Shot>
);
export const S36 = [A, B];
