import React from 'react';
import {keys} from '../lib';
import {Layer} from '../effects/Parallax';
import {Day, Line, Sfx, Shot} from '../effects/Shot';
import {BusFront, Gym, Office} from '../environments/Misc';
import {Houses, SIDEWALK_Y, SkyBg, StreetFront} from '../environments/Street';
import {CoffeeFront} from '../environments/CoffeeShop';
import {Kitchen} from '../environments/Apartment';
import {Leaves} from '../effects/Leaves';
import {Dog, Silhouette} from '../characters/Silhouette';
import {CalendarOnFridge} from './S13';
import {LEO, useT} from './kit';

const Hi: React.FC<{text: string}> = ({text}) => <Line text={text} from={4} to={44} />;
const LeafLayer: React.FC<{amount?: number}> = ({amount = 1}) => (
  <Layer depth={1.1}>
    <Leaves amount={amount} n={20} />
  </Layer>
);

// DAY 8 — bus driver
const A: React.FC = () => {
  const {g, t} = useT();
  return (
    <Shot overlay={<><Day n="DAY 8" /><Hi text="Morning!" /></>} ungraded={<LeafLayer amount={0.4} />}>
      <Layer depth={0.8} blur={2}>
        <BusFront />
      </Layer>
      <Layer depth={1}>
        <rect x={520} y={820} width={170} height={30} rx={10} fill="#2c2f33" />
        <rect x={500} y={600} width={30} height={240} rx={10} fill="#2c2f33" />
        <rect x={590} y={850} width={14} height={160} fill="#2c2f33" />
        <ellipse cx={760} cy={700} rx={70} ry={20} fill="none" stroke="#1b1c1f" strokeWidth={12} transform="rotate(-60 760 700)" />
        <Silhouette seed="drv" acc="dan" x={600} y={1000} frame={g} scale={1.7} pose="sitDesk" expr={t > 16 ? 'happy' : 'neutral'} look={[6, 0]} rig={{armF: [80, 20]}} />
        {LEO({x: 1150, y: 1000, frame: g, scale: 1.8, facing: -1, expr: 'happy', talk: t < 20 ? 0.7 : 0})}
      </Layer>
      <Sfx name="hello1" at={4} volume={0.5} />
    </Shot>
  );
};
// insert: the dog wags
const B: React.FC = () => {
  const {g} = useT();
  return (
    <Shot overlay={<Day n="DAY 10" />} cam={() => ({zoom: 1.6, fx: 960, fy: 700})} ungraded={<LeafLayer amount={0.5} />}>
      <Layer depth={0.7} blur={4}>
        <SkyBg sky="grey" />
        <Houses sky="grey" offset={600} />
        <StreetFront sky="grey" leaves={0.6} />
      </Layer>
      <Layer depth={1}>
        <Dog x={920} y={SIDEWALK_Y + 20} frame={g} scale={1.6} wag={1.5} />
      </Layer>
      <Sfx name="bark" at={12} volume={0.5} />
    </Shot>
  );
};
// man with the dog, Leo says hi
const C3: React.FC = () => {
  const {g, t} = useT();
  return (
    <Shot overlay={<><Day n="DAY 11" /><Hi text="Hey! Cute dog." /></>} ungraded={<LeafLayer amount={0.6} />}>
      <Layer depth={0.7} blur={2.5}>
        <SkyBg sky="grey" />
        <Houses sky="grey" offset={900} />
        <StreetFront sky="grey" leaves={0.7} />
      </Layer>
      <Layer depth={1}>
        <Silhouette seed="dogman" acc="dan" x={1150} y={SIDEWALK_Y + 20} frame={g} scale={1.6} facing={-1} expr={t > 18 ? 'happy' : 'neutral'} rig={{armF: [40, 10]}} />
        <Dog x={1330} y={SIDEWALK_Y + 20} frame={g} scale={0.9} facing={-1} wag={1.5} />
        {LEO({x: 760, y: SIDEWALK_Y + 20, frame: g, scale: 1.6, expr: 'happy', talk: t < 20 ? 0.7 : 0, look: [5, 0]})}
      </Layer>
    </Shot>
  );
};
// coworker at the copier (over Leo's shoulder)
const D: React.FC = () => {
  const {g, t} = useT();
  return (
    <Shot overlay={<><Day n="DAY 13" /><Hi text="How was your weekend?" /></>} ungraded={<LeafLayer amount={0.7} />}>
      <Layer depth={0.75} blur={3}>
        <Office />
      </Layer>
      <Layer depth={1}>
        <Silhouette seed="cw" acc="pony" x={1150} y={1000} frame={g} scale={1.8} facing={-1} expr={t > 20 ? 'happy' : 'surprised'} look={[-4, 0]} />
      </Layer>
      <Layer depth={1.35} blur={16}>
        {LEO({x: 420, y: 1800, frame: g, scale: 3.4, back: true})}
      </Layer>
    </Shot>
  );
};
// gym
const E: React.FC = () => {
  const {g, t} = useT();
  return (
    <Shot overlay={<><Day n="DAY 16" /><Hi text="Need a spot?" /></>}>
      <Layer depth={0.75} blur={2.5}>
        <Gym />
      </Layer>
      <Layer depth={1}>
        <Silhouette seed="gym" x={1180} y={1000} frame={g} scale={1.9} facing={-1} expr={t > 16 ? 'happy' : 'neutral'} rig={{armF: [150, 30], armB: [-150, -30]}} />
        {LEO({x: 760, y: 1000, frame: g, scale: 1.8, expr: 'happy', talk: t < 20 ? 0.7 : 0})}
      </Layer>
    </Shot>
  );
};
// insert: the calendar fills with green
const F: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#cfcdc8" overlay={<Day n="DAY 18" />} cam={() => ({zoom: 1.9, fx: 520, fy: 330})}>
      <Layer depth={1}>
        <Kitchen>
          <CalendarOnFridge checks={Math.floor(keys(t, [0, 40], [12, 18]))} draw={(t % 6) / 6 + 0.3} hello={false} />
        </Kitchen>
      </Layer>
      <Sfx name="marker" at={2} volume={0.4} />
    </Shot>
  );
};
// window: orange leaves outside
const G: React.FC = () => (
  <Shot overlay={<Day n="DAY 20" />} ungraded={<Layer depth={1.05}><Leaves amount={1} n={30} x0={200} x1={1720} y0={140} y1={660} size={1.4} /></Layer>}>
    <Layer depth={1}>
      <CoffeeFront leaves={1} mood="dusk" />
    </Layer>
  </Shot>
);
export const S19 = [A, B, C3, D, E, F, G];
