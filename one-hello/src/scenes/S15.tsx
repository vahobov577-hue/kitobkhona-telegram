import React from 'react';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {Elevator} from '../environments/Elevator';
import {CalendarOnFridge} from './S13';
import {Kitchen} from '../environments/Apartment';
import {LEO, useT} from './kit';
import {Silhouette} from '../characters/Silhouette';

const Bag = <g fill="#0E0E0E"><rect x={-28} y={0} width={56} height={60} rx={8} /><path d="M -14 0 Q 0 -26 14 0" stroke="#0E0E0E" strokeWidth={5} fill="none" /></g>;

const Lift: React.FC<{floor: number; leoExpr: 'neutral' | 'awkward' | 'happy'; nExpr: 'neutral' | 'happy'; leoTalk?: number; nTalk?: number; leoLook?: [number, number]}> = ({floor, leoExpr, nExpr, leoTalk = 0, nTalk = 0, leoLook = [0, 0]}) => {
  const {g} = useT();
  return (
    <>
      <Layer depth={0.85} blur={2}>
        <Elevator floor={floor} />
      </Layer>
      <Layer depth={1}>
        {LEO({x: 760, y: 1000, frame: g, scale: 1.8, expr: leoExpr, talk: leoTalk, look: leoLook})}
        <Silhouette seed="nb" acc="neighbor" x={1180} y={1000} frame={g} scale={1.6} expr={nExpr} talk={nTalk} pose="stand" rig={{body: 6, head: 6, armF: [10, 8]}} handItem={Bag} look={[-4, 0]} />
      </Layer>
    </>
  );
};

const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot zoom={[1.0, 1.03]}>
      <Lift floor={7 - Math.floor(t / 30)} leoExpr="awkward" nExpr="neutral" leoLook={[4, 0]} />
      <Sfx name="tick" at={0} volume={0.4} />
      <Sfx name="tick" at={30} volume={0.4} />
      <Sfx name="tick" at={60} volume={0.4} />
      <Sfx name="hum" at={0} volume={0.4} dur={70} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 2.4, fx: 760, fy: 470})} overlay={<Line text="…hi." from={22} to={60} />}>
      <Lift floor={5} leoExpr="awkward" nExpr="neutral" leoTalk={t > 22 && t < 40 ? 0.5 : 0} leoLook={[6, 0]} />
      <Sfx name="hum" at={0} volume={0.35} dur={60} />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 1.9, fx: 1150, fy: 520})} overlay={<Line text="Hi, dear." from={12} to={60} />}>
      <Lift floor={4} leoExpr="neutral" nExpr={t > 10 ? 'happy' : 'neutral'} nTalk={t > 12 && t < 36 ? 0.7 : 0} />
    </Shot>
  );
};
// insert: first green check
const D: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#cfcdc8" cam={() => ({zoom: 2.2, fx: 520, fy: 330})}>
      <Layer depth={1}>
        <Kitchen>
          <CalendarOnFridge checks={1} draw={Math.min(1, t / 16)} hello={false} />
        </Kitchen>
      </Layer>
      <Sfx name="marker" at={0} volume={0.6} />
      <Sfx name="ding" at={14} volume={0.4} />
    </Shot>
  );
};
export const S15 = [A, B, C3, D];
