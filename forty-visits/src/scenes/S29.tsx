import React from 'react';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {Porch} from '../environments/Porch';
import {DAD, SAM, useT} from './kit';

const A: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot zoom={[1.0, 1.04]} sat={1} overlay={<Line text="Thank you for coming." from={24} to={78} />}>
      <Layer depth={1}>
        <Porch />
        {SAM({x: 860, y: 760, frame: g, scale: 1.45, pose: 'sit', expr: 'neutral', look: [4, -1]})}
        {DAD({x: 1060, y: 760, frame: g, scale: 1.5, pose: 'sit', facing: -1, expr: 'happy', talk: t > 24 && t < 60 ? 0.6 : 0, rig: {armF: [140, 70]}})}
      </Layer>
      <Sfx name="crickets" at={0} volume={0.4} dur={80} />
    </Shot>
  );
};
// insert: Dad's trembling hand on Sam's shoulder
const B: React.FC = () => {
  const {t, g} = useT();
  const tr = Math.sin(g * 1.9) * 1.2 + Math.sin(g * 3.1) * 0.6;
  return (
    <Shot zoom={[1.03, 1.07]} sat={1}>
      <Layer depth={0.5} blur={10}>
        <Porch />
      </Layer>
      <Layer depth={1} >
        <g fill="#0E0E0E">
          <path d="M 300 1200 Q 360 700 760 620 Q 1100 580 1320 700 L 1520 1200 Z" />
          <circle cx={1020} cy={360} r={220} />
        </g>
        <g transform={`translate(${tr} ${tr * 0.5 + Math.sin(t * 0.05) * 3})`} fill="#151515">
          <rect x={1500} y={560} width={700} height={120} rx={60} transform="rotate(-12 1500 620)" />
          <ellipse cx={1330} cy={640} rx={130} ry={70} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={1180 + i * 40} y={630} width={34} height={110} rx={17} />
          ))}
        </g>
      </Layer>
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.9, fx: 860, fy: 560, x: 860 - 960, y: 560 - 540})} sat={1} overlay={<Line text="I'll come more." from={14} to={76} />}>
      <Layer depth={0.5} blur={3}>
        <Porch />
      </Layer>
      <Layer depth={1}>
        {SAM({x: 860, y: 760, frame: g, scale: 1.45, pose: 'sit', expr: 'determined', talk: t > 14 && t < 44 ? 0.6 : 0, look: [5, -1]})}
      </Layer>
      <Layer depth={1.3} blur={14}>
        {DAD({x: 1280, y: 1000, frame: g, scale: 2.3, pose: 'sit', back: true})}
      </Layer>
    </Shot>
  );
};
export const S29 = [A, B, C3];
