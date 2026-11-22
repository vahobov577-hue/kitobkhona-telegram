import React from 'react';
import {Layer} from '../effects/Parallax';
import {Narr, Sfx, Shot} from '../effects/Shot';
import {Phone} from '../inserts/PhoneUI';
import {Birthday, BIRTHDAY_LEO} from './common';
import {useT} from './kit';

const typedAt = (t: number) => {
  const word = 'Hey';
  if (t < 10) return '';
  if (t < 34) return word.slice(0, Math.min(3, Math.floor((t - 10) / 6) + 1));
  if (t < 52) return word.slice(0, Math.max(0, 3 - Math.floor((t - 34) / 5)));
  if (t < 64) return '';
  return word.slice(0, Math.min(3, Math.floor((t - 64) / 6) + 1));
};

const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.35, fx: 860, fy: 520})} drift={[20, 0]}>
      <Birthday frame={g} mood="dark" phone="hand" candle={0} cake={false} screen="contact" expr="worried" />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#111" zoom={[1.08, 1.12]}>
      <Layer depth={0.5} blur={8}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#1d1e22" />
      </Layer>
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={{kind: 'contact', typed: typedAt(t), caret: Math.floor(t / 10) % 2 === 0}} />
      </Layer>
      {[12, 18, 24, 66, 72, 78].map((a) => (
        <Sfx key={a} name="key" at={a} volume={0.4} dur={8} />
      ))}
      {[36, 41, 46].map((a) => (
        <Sfx key={a} name="key" at={a} volume={0.3} dur={8} />
      ))}
    </Shot>
  );
};
const C3: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 3.0, fx: BIRTHDAY_LEO.x + 80, fy: 520})} overlay={<Narr text="Some hellos are harder." from={14} to={100} y={880} size={58} />}>
      <Birthday frame={g} mood="dark" phone="hand" candle={0} cake={false} screen="contact" expr="sad" look={[5, 3]} />
    </Shot>
  );
};
export const S23 = [A, B, C3];
