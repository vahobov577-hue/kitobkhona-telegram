import React from 'react';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {MomKitchen} from '../environments/ParentsKitchen';
import {DAD, MOM, SAM, useT} from './kit';

const Plates: React.FC = () => (
  <g>
    {[700, 960, 1220].map((x) => (
      <g key={x}>
        <ellipse cx={x} cy={688} rx={70} ry={14} fill="#f6efe0" />
        <ellipse cx={x} cy={684} rx={38} ry={7} fill="#c96d5a" />
      </g>
    ))}
    <ellipse cx={960} cy={680} rx={40} ry={10} fill="#f6efe0" />
    <rect x={940} y={640} width={40} height={40} rx={4} fill="#f6efe0" />
    <rect x={958} y={624} width={4} height={16} fill="#fff" />
  </g>
);
const A: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot zoom={[1.0, 1.04]} sat={1} overlay={<Line text="You're too thin." from={14} to={80} />}>
      <Layer depth={1}>
        <MomKitchen />
        {MOM({x: 620, y: 900, frame: g, scale: 1.5, pose: 'sit', expr: 'worried', talk: t > 14 && t < 50 ? 1 : 0, look: [5, 0]})}
        {SAM({x: 960, y: 900, frame: g, scale: 1.55, pose: 'sit', expr: 'awkward', look: [-4, 0]})}
        {DAD({x: 1300, y: 900, frame: g, scale: 1.55, pose: 'sit', facing: -1, expr: 'happy', look: [-4, 0]})}
        <Plates />
      </Layer>
      <Sfx name="cutlery" at={4} volume={0.4} />
    </Shot>
  );
};
// Dad tells his old story (hands moving)
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 2.0, fx: 1300, fy: 600, x: 1300 - 960, y: 600 - 540})} sat={1}>
      <Layer depth={0.5} blur={4}>
        <MomKitchen table={false} />
      </Layer>
      <Layer depth={1}>
        {DAD({x: 1300, y: 900, frame: g, scale: 1.55, pose: 'sit', facing: -1, expr: 'happy', talk: 1, rig: {armF: [70 + Math.sin(t * 0.2) * 30, -20]}})}
        <rect x={560} y={700} width={1200} height={20} fill="#6a4a36" />
      </Layer>
      <Layer depth={1.3} blur={16}>
        {SAM({x: 860, y: 1100, frame: g, scale: 2.4, pose: 'sit', back: true})}
      </Layer>
    </Shot>
  );
};
// close: Sam laughs
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 2.6, fx: 960, fy: 640, x: 0, y: 40})} sat={1}>
      <Layer depth={0.5} blur={5}>
        <MomKitchen table={false} />
      </Layer>
      <Layer depth={1}>
        {SAM({x: 960, y: 900, frame: g, scale: 1.55, pose: 'sit', expr: t > 16 ? 'happy' : 'neutral', talk: t > 16 && t < 70 ? 0.8 : 0, look: [4, 0]})}
      </Layer>
      <Sfx name="laugh" at={18} volume={0.6} />
    </Shot>
  );
};
export const S28 = [A, B, C3];
