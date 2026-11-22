import React from 'react';
import {EASE, keys, noise} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Phone} from '../inserts/PhoneUI';
import {useT} from './kit';

// insert: notifications avalanche
const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#0c0d10" cam={(tt) => ({x: noise('s2', tt) * 4, y: noise('s2y', tt) * 4})} zoom={[1.0, 1.06]}>
      <Layer depth={0.5} blur={6}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#141518" />
        <rect x={200} y={700} width={1500} height={20} fill="#2a2b2f" />
      </Layer>
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={{kind: 'notifs', t: t * 1.6}} buzz={1} />
      </Layer>
      <Sfx name="buzz" at={0} volume={0.7} />
      {Array.from({length: 12}).map((_, i) => (
        <Sfx key={i} name="ping" at={i * 6} volume={0.25} dur={20} />
      ))}
    </Shot>
  );
};
// insert: push on the counter
const B: React.FC = () => {
  const {t} = useT();
  const v = keys(t, [0, 60], [41, 143], EASE);
  return (
    <Shot bg="#0c0d10" zoom={[1, 1]} cam={(tt) => ({zoom: keys(tt, [0, 75], [1.0, 1.7], EASE), fx: 960, fy: 480})}>
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={{kind: 'counter', value: v}} buzz={0.6} />
      </Layer>
      {Array.from({length: 8}).map((_, i) => (
        <Sfx key={i} name="ping" at={i * 7} volume={0.25} dur={20} />
      ))}
    </Shot>
  );
};
export const S02 = [A, B];
