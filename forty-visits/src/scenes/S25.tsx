import React from 'react';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Landscape, Wagon} from '../environments/Train';
import {Glow} from '../environments/common';
import {SAM, useT} from './kit';

const A: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot zoom={[1.0, 1.02]}>
      <Layer depth={1}>
        <Landscape x={-100} y={-100} w={2120} h={1280} offset={g * 14} phase={t / 100 * 0.45} />
        <rect x={-200} y={-200} width={2320} height={220} fill="#7a6650" />
        <rect x={-200} y={960} width={2320} height={300} fill="#7a6650" />
        <rect x={-200} y={-200} width={240} height={1600} fill="#7a6650" />
        <rect x={1880} y={-200} width={240} height={1600} fill="#7a6650" />
      </Layer>
      <Sfx name="train" at={0} volume={0.7} dur={100} />
    </Shot>
  );
};
// insert: hands holding the cake box, golden light
const B: React.FC = () => (
  <Shot zoom={[1.02, 1.06]}>
    <Layer depth={0.5} blur={8}>
      <rect x={-500} y={-500} width={3000} height={2200} fill="#8a6a48" />
    </Layer>
    <Layer depth={1}>
      <Glow cx={1300} cy={300} r={900} color="#FFC873" opacity={0.6} />
      <rect x={660} y={380} width={600} height={360} rx={10} fill="#f6efe0" />
      <rect x={660} y={380} width={600} height={60} fill="#e9dcc4" />
      <rect x={940} y={380} width={40} height={360} fill="#c96d5a" />
      <path d="M 960 380 q -60 -70 -100 -10 q 40 30 100 10 q 60 -70 100 -10 q -40 30 -100 10 Z" fill="#c96d5a" />
      <g fill={C.sil}>
        <ellipse cx={640} cy={640} rx={70} ry={110} />
        <rect x={400} y={600} width={260} height={110} rx={55} transform="rotate(20 530 655)" />
        <ellipse cx={1280} cy={640} rx={70} ry={110} />
        <rect x={1260} y={600} width={260} height={110} rx={55} transform="rotate(-20 1390 655)" />
      </g>
    </Layer>
    <Sfx name="train" at={0} volume={0.6} dur={100} />
  </Shot>
);
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot drift={[30, 0]}>
      <Layer depth={1}>
        <Wagon offset={g * 14} phase={0.5 + (t / 100) * 0.5} />
        {SAM({x: 760, y: 900, frame: g, scale: 1.6, pose: 'sit', expr: 'neutral', look: [5, -2], rig: {armF: [70, 20], armB: [60, 30]}, handItem: <rect x={-40} y={-50} width={90} height={60} rx={4} fill="#f6efe0" />})}
      </Layer>
      <Sfx name="train" at={0} volume={0.6} dur={100} />
    </Shot>
  );
};
export const S25 = [A, B, C3];
