import React from 'react';
import {Layer} from '../effects/Parallax';
import {Day, Line, Sfx, Shot} from '../effects/Shot';
import {Checkout, Store} from '../environments/Store';
import {Glow, PendantLamp} from '../environments/common';
import {LEO, useT} from './kit';
import {Silhouette} from '../characters/Silhouette';

// the first colour in the film: a warm lamp over the till (drawn outside the grade)
const WarmLamp: React.FC<{x?: number; y?: number; k?: number}> = ({x = 1180, y = 120, k = 1}) => (
  <Layer depth={1}>
    <Glow cx={x} cy={y + 260} r={520} color="#FFB347" opacity={0.45 * k} />
    <Glow cx={x} cy={y + 60} r={140} color="#FFD27A" opacity={0.8 * k} />
  </Layer>
);

const Till: React.FC<{cashierExpr?: 'neutral' | 'happy'; nod?: number; leoTalk?: number}> = ({cashierExpr = 'neutral', nod = 0, leoTalk = 0}) => {
  const {g} = useT();
  return (
    <>
      <Layer depth={0.75} blur={3}>
        <Store />
      </Layer>
      <Layer depth={1}>
        <PendantLamp x={1180} y={120} on={0} len={140} />
        <Silhouette seed="cash" x={1180} y={880} frame={g} scale={1.7} expr={cashierExpr} tilt={nod} look={[-5, 0]} />
        <Checkout />
        {LEO({x: 640, y: 1040, frame: g, scale: 1.9, facing: 1, expr: 'neutral', talk: leoTalk, look: [5, 0]})}
      </Layer>
    </>
  );
};

const A: React.FC = () => (
  <Shot drift={[-30, 0]} overlay={<Day n="DAY 3" />} ungraded={<WarmLamp />}>
    <Till />
    <Sfx name="beep" at={20} volume={0.4} />
    <Sfx name="beep" at={44} volume={0.4} />
  </Shot>
);
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot drift={[20, 0]} overlay={<Line text="Have a good one." from={14} to={76} />} ungraded={<WarmLamp x={1500} y={-60} k={0.8} />}>
      <Layer depth={0.75} blur={3}>
        <Store />
      </Layer>
      <Layer depth={1}>
        {LEO({x: 820, y: 900, frame: g, scale: 2.3, expr: 'neutral', talk: t > 14 && t < 50 ? 1 : 0, look: [4, 0]})}
        <Checkout />
      </Layer>
      <Layer depth={1.35} blur={16}>
        <Silhouette seed="cash" x={1600} y={1800} frame={g} scale={3.4} back />
      </Layer>
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t} = useT();
  const nod = t > 10 && t < 30 ? Math.sin(((t - 10) / 20) * Math.PI) * 10 : 0;
  return (
    <Shot cam={() => ({zoom: 1.9, fx: 1180, fy: 470})} ungraded={<WarmLamp />}>
      <Till cashierExpr={t > 12 ? 'happy' : 'neutral'} nod={nod} />
    </Shot>
  );
};
export const S16 = [A, B, C3];
