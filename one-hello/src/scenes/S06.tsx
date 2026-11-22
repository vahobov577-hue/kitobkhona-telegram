import React from 'react';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {CoffeeBack, Counter, COUNTER_Y} from '../environments/CoffeeShop';
import {Contact} from '../environments/common';
import {CoffeeOTS, LEO, MIA, useT} from './kit';

// wide: the coffee shop, Leo at the counter (back to us), Mia behind it
export const CoffeeWide: React.FC<{leoExpr?: 'neutral' | 'tired'; miaExpr?: 'neutral' | 'happy'; leaves?: number}> = ({miaExpr = 'neutral'}) => {
  const {g} = useT();
  return (
    <>
      <Layer depth={0.7} blur={2}>
        <CoffeeBack />
      </Layer>
      <Layer depth={1}>
        {MIA({x: 1160, y: 900, frame: g, scale: 1.55, expr: miaExpr, rig: {armF: [30, 20]}})}
        <Counter y={COUNTER_Y + 60} />
        <Contact x={760} y={1060} w={140} />
        {LEO({x: 760, y: 1060, frame: g, scale: 1.75, back: true, rig: {armF: [10, 6]}})}
      </Layer>
    </>
  );
};

const A: React.FC = () => (
  <Shot drift={[-40, 0]} zoom={[1.0, 1.05]}>
    <CoffeeWide />
    <Sfx name="cafe" at={0} volume={0.5} dur={210} />
    <Sfx name="cup" at={30} volume={0.4} />
  </Shot>
);
const B: React.FC = () => (
  <Shot overlay={<Line text="Rough night?" from={6} to={66} />} drift={[20, 0]}>
    <CoffeeOTS subject="leo" expr="tired" look={[3, 0]} />
  </Shot>
);
const C: React.FC = () => (
  <Shot cam={() => ({zoom: 1.6, fx: 960, fy: 380})} overlay={<Line text="Birthday." from={14} to={68} />}>
    <CoffeeOTS subject="leo" expr="sad" talk={1} close fg={false} look={[0, 3]} />
  </Shot>
);
export const S06 = [A, B, C];
