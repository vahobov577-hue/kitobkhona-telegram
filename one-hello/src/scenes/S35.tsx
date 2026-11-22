import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Sfx, Shot, Title} from '../effects/Shot';
import {useT} from './kit';

const A: React.FC = () => (
  <Shot bg="#000" vignette={0} overlay={<Title text="ONE HELLO" sub="Just say hi. See who answers." from={6} subFrom={60} />} />
);
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#000" vignette={0} overlay={t < 128 ? <Title text="ONE HELLO" sub="Just say hi. See who answers." from={-60} subFrom={-60} /> : <AbsoluteFill style={{background: '#000'}} />}>
      <Sfx name="ringtone" at={118} volume={0.9} dur={32} />
    </Shot>
  );
};
export const S35 = [A, B];
