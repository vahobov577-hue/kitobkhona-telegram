import React from 'react';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {Houses, SIDEWALK_Y, SkyBg, StreetFront} from '../environments/Street';
import {Leaves} from '../effects/Leaves';
import {Silhouette} from '../characters/Silhouette';
import {Watch} from '../inserts/Watch';
import {LEO, useT} from './kit';
import {RUNNERS} from './S21';

const Run: React.FC<{children: React.ReactNode; speed?: number}> = ({children, speed = 9}) => {
  const {g} = useT();
  const o = g * speed;
  return (
    <>
      <Layer depth={0.3} blur={3}>
        <SkyBg sky="day" />
      </Layer>
      <Layer depth={0.6} blur={2.5}>
        <Houses sky="day" offset={o * 0.4} />
      </Layer>
      <Layer depth={1}>
        <StreetFront sky="day" offset={o} leaves={1} />
        {children}
      </Layer>
    </>
  );
};

// wide: the club runs, parallax
const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot ungraded={<Layer depth={1.2}><Leaves n={16} amount={0.8} /></Layer>}>
      <Run>
        {RUNNERS.map((r, i) => (
          <Silhouette key={i} seed={'rn' + i} acc={r.acc} x={700 + r.dx * 0.9} y={SIDEWALK_Y + 20} frame={g + i * 7} scale={0.85} pose="run" speed={0.9} expr="happy" />
        ))}
        {LEO({x: 520, y: SIDEWALK_Y + 20, frame: g, scale: 0.85, pose: 'run', speed: 0.9, expr: 'determined'})}
      </Run>
      <Sfx name="run" at={0} volume={0.6} dur={100} />
    </Shot>
  );
};
// medium: one runner falls back with Leo — "First time?" / "Yeah."
const B: React.FC = () => {
  const {g, t} = useT();
  return (
    <Shot cam={() => ({zoom: 1.6, fx: 900, fy: 640})} overlay={<><Line text="First time?" from={6} to={50} /><Line text="Yeah." from={58} to={100} /></>}>
      <Run speed={6}>
        <Silhouette seed="rn1" x={1000} y={SIDEWALK_Y + 20} frame={g} scale={1.2} pose="run" speed={0.7} expr="tired" talk={t < 40 ? 0.8 : 0} look={[-4, 0]} />
        {LEO({x: 780, y: SIDEWALK_Y + 20, frame: g + 9, scale: 1.2, pose: 'run', speed: 0.7, expr: 'tired', talk: t > 58 && t < 80 ? 0.7 : 0, look: [4, 0]})}
      </Run>
      <Sfx name="breath" at={0} volume={0.5} dur={100} />
    </Shot>
  );
};
// close: "Me too." (smile)
const C3: React.FC = () => {
  const {g, t} = useT();
  return (
    <Shot cam={() => ({zoom: 2.6, fx: 1010, fy: 540})} overlay={<Line text="Me too." from={18} to={96} />}>
      <Run speed={6}>
        <Silhouette seed="rn1" x={1000} y={SIDEWALK_Y + 20} frame={g} scale={1.2} pose="run" speed={0.7} expr={t > 26 ? 'happy' : 'tired'} talk={t > 18 && t < 40 ? 0.8 : 0} look={[-4, 0]} />
      </Run>
    </Shot>
  );
};
// insert: watch
const D: React.FC = () => (
  <Shot zoom={[1.0, 1.05]}>
    <Layer depth={0.5} blur={12}>
      <SkyBg sky="day" />
      <StreetFront sky="day" leaves={1} />
    </Layer>
    <Layer depth={1}>
      <Watch x={960} y={560} s={1.4} km="3.1" min="24 min" rot={-6} />
    </Layer>
    <Sfx name="ding" at={10} volume={0.5} />
  </Shot>
);
export const S22 = [A, B, C3, D];
