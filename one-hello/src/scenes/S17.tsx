import React from 'react';
import {ramp} from '../lib';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Day, Line, Sfx, Shot} from '../effects/Shot';
import {BusStop} from '../environments/BusStop';
import {Rain} from '../effects/Rain';
import {LEO, useT} from './kit';
import {Silhouette} from '../characters/Silhouette';

const Stop: React.FC<{leoX?: number; leoPose?: 'stand' | 'sit'; leoExpr?: 'neutral' | 'awkward' | 'sad'; leoTalk?: number; rain?: number; stranger?: boolean}> = ({leoX = 760, leoPose = 'stand', leoExpr = 'neutral', leoTalk = 0, rain = 0, stranger = true}) => {
  const {g} = useT();
  return (
    <>
      <Layer depth={0.8} blur={2.5}>
        <BusStop dark={rain * 0.25} />
      </Layer>
      <Layer depth={1}>
        {stranger ? <Silhouette seed="hp" acc="headphones" x={1180} y={880} frame={g} scale={1.7} expr="closed" tilt={Math.sin(g * 0.25) * 5} look={[0, 0]} /> : null}
        {LEO({x: leoX, y: leoPose === 'sit' ? 856 : 880, frame: g, scale: 1.7, pose: leoPose, expr: leoExpr, talk: leoTalk, look: [6, 0], rig: leoPose === 'sit' ? {head: 14} : undefined})}
        <Rain amount={rain} />
      </Layer>
    </>
  );
};

const A: React.FC = () => (
  <Shot drift={[30, 0]} overlay={<Day n="DAY 6" />}>
    <Stop />
    <Sfx name="street" at={0} volume={0.4} dur={70} />
  </Shot>
);
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 1.5, fx: 960, fy: 520})} overlay={<Line text="Hi." from={10} to={50} />}>
      <Stop leoTalk={t > 10 && t < 26 ? 0.8 : 0} leoExpr="neutral" />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 2.5, fx: 770, fy: 500})}>
      <Stop leoExpr="awkward" rain={ramp(t, 30, 60)} />
      <Sfx name="rain" at={28} volume={0.6} dur={40} />
    </Shot>
  );
};
const D: React.FC = () => (
  <Shot zoom={[0.98, 1.0]} overlay={<Line text="Maybe tomorrow?" from={8} to={50} color={C.orange} />}>
    <Stop leoX={760} leoPose="sit" leoExpr="sad" rain={1} stranger={false} />
    <Sfx name="rain" at={0} volume={0.8} dur={60} />
  </Shot>
);
export const S17 = [A, B, C3, D];
