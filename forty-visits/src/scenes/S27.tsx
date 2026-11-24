import React from 'react';
import {EASE, keys, ramp} from '../lib';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {MomKitchen} from '../environments/ParentsKitchen';
import {Glow} from '../environments/common';
import {DAD, MOM, SAM, useT} from './kit';

/** standing hug: lean in, arms around the other */
const HUG = {body: 12, head: 16, armF: [78, 55] as [number, number], armB: [72, 60] as [number, number]};

const Doorway: React.FC<{open: number}> = ({open}) => (
  <g>
    <rect x={-400} y={-300} width={2800} height={1700} fill="#bda886" />
    <rect x={640} y={80} width={640} height={900} fill="#ffd28a" />
    <Glow cx={960} cy={500} r={700} color="#FFC873" opacity={0.6} />
    <g transform={`translate(640 80) scale(${1 - open * 0.85} 1)`}>
      <rect x={0} y={0} width={640} height={900} fill="#4a3a2e" />
      <circle cx={580} cy={520} r={16} fill="#c8a86a" />
    </g>
    <rect x={620} y={60} width={680} height={24} fill="#3a2c22" />
    <rect x={-400} y={980} width={2800} height={500} fill="#5a4a3a" />
  </g>
);
// door opens: Mom freezes, "...son?", the towel drops
const A: React.FC = () => {
  const {t, g} = useT();
  const open = keys(t, [0, 20], [0, 1], EASE);
  const towelY = keys(t, [56, 74], [0, 330], EASE);
  return (
    <Shot zoom={[1.0, 1.04]} sat={0.6 + ramp(t, 0, 100) * 0.2} overlay={<Line text="…son?" from={34} to={96} />}>
      <Layer depth={1}>
        <Doorway open={open} />
        {MOM({x: 960, y: 980, frame: g, scale: 2.4, pose: 'stand', expr: t > 30 ? 'surprised' : 'neutral', look: [0, 0], rig: {armF: [30, 20]}})}
        {t < 74 ? <rect x={1040} y={720 + towelY} width={60} height={110} rx={6} fill="#e9e2d2" transform={`rotate(${towelY * 0.2} 1070 ${760 + towelY})`} /> : <rect x={1000} y={1040} width={140} height={30} rx={8} fill="#e9e2d2" />}
      </Layer>
      <Layer depth={1.3} blur={16}>
        {SAM({x: 420, y: 1400, frame: g, scale: 3.4, pose: 'stand', back: true})}
      </Layer>
      <Sfx name="dooropen" at={0} volume={0.6} />
      <Sfx name="softthud" at={74} volume={0.5} />
    </Shot>
  );
};
// close: the hug
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.7, fx: 960, fy: 640, x: 0, y: 640 - 540})} sat={0.85}>
      <Layer depth={0.5} blur={6}>
        <MomKitchen table={false} />
      </Layer>
      <Layer depth={1}>
        {MOM({x: 850, y: 1000, frame: g, scale: 2.0, pose: 'stand', rig: HUG, expr: t > 20 ? 'closed' : 'happy'})}
        {SAM({x: 1070, y: 1000, frame: g, scale: 2.0, pose: 'stand', rig: HUG, facing: -1, expr: 'closed'})}
      </Layer>
    </Shot>
  );
};
// wide: Dad comes slowly, joins — triple hug, full warm colour
const C3: React.FC = () => {
  const {t, g} = useT();
  const dx = keys(t, [0, 60], [1500, 1090], EASE);
  return (
    <Shot zoom={[1.0, 1.04]} sat={1}>
      <Layer depth={0.5} blur={3}>
        <MomKitchen />
      </Layer>
      <Layer depth={1}>
        {MOM({x: 720, y: 960, frame: g, scale: 1.7, pose: 'stand', rig: HUG, expr: 'closed'})}
        {SAM({x: 900, y: 960, frame: g, scale: 1.7, pose: 'stand', rig: HUG, facing: -1, expr: 'closed'})}
        {DAD({x: dx, y: 960, frame: g, scale: 1.75, pose: t > 60 ? 'stand' : 'walk', rig: t > 60 ? {...HUG, armF: [85, 45]} : undefined, facing: -1, expr: t > 60 ? 'closed' : 'happy', speed: 0.5})}
      </Layer>
    </Shot>
  );
};
export const S27 = [A, B, C3];
