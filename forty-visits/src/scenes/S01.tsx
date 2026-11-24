import React from 'react';
import {Sfx, Shot} from '../effects/Shot';
import {DeskCall} from './common';
import {useT} from './kit';

export const DESK_ZOOM: [number, number] = [1.0, 1.04];
const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot zoom={DESK_ZOOM}>
      <DeskCall t={t} mode="incoming" press="red" pressAt={40} />
      <Sfx name="buzz" at={0} volume={0.8} dur={40} />
      <Sfx name="decline" at={40} volume={0.9} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot zoom={[1.06, 1.14]}>
      <DeskCall t={t} mode="missed" />
      <Sfx name="ping" at={4} volume={0.6} />
    </Shot>
  );
};
export const S01 = [A, B];
