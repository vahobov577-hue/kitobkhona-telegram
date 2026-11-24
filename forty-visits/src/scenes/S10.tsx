import React from 'react';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {OfficeNight, DeskTop} from '../environments/Office';
import {Clock} from '../inserts/Watch';
import {Glow} from '../environments/common';
import {Silhouette} from '../characters/Silhouette';
import {C} from '../theme';
import {SAM, useT} from './kit';

const A: React.FC = () => (
  <Shot bg="#141518" zoom={[1.0, 1.05]}>
    <Layer depth={0.5} blur={8}>
      <rect x={-500} y={-500} width={3000} height={2200} fill="#22252b" />
    </Layer>
    <Layer depth={1}>
      <Clock x={960} y={540} s={1.6} time="21:40" />
    </Layer>
    <Sfx name="tick" at={0} volume={0.4} dur={10} />
    <Sfx name="tick" at={30} volume={0.4} dur={10} />
  </Shot>
);
const B: React.FC = () => {
  const {g} = useT();
  return (
    <Shot drift={[30, 0]}>
      <Layer depth={0.8} blur={2}>
        <OfficeNight />
      </Layer>
      <Layer depth={1}>
        {SAM({x: 860, y: 1010, frame: g, scale: 1.6, pose: 'sitDesk', expr: 'tired', eyeGlow: '#dfe8ff', rig: {armF: [75, 15]}})}
        <rect x={760} y={850} width={460} height={18} fill="#3a3c42" />
        <rect x={960} y={720} width={180} height={120} rx={8} fill="#aecbe0" />
        <Silhouette seed="boss" acc="boss" x={1650} y={880} frame={g} scale={1.7} expr="neutral" rig={{armF: [40, 30], armB: [-40, -30]}} />
      </Layer>
      <Sfx name="office" at={0} volume={0.4} dur={70} />
    </Shot>
  );
};
// insert: phone face down, vibrating "MOM" (light leaks around the edges)
const C3: React.FC = () => {
  const {t} = useT();
  const bx = Math.sin(t * 2.4) * 5;
  return (
    <Shot zoom={[1.05, 1.1]}>
      <Layer depth={1}>
        <DeskTop />
        <g transform={`translate(${960 + bx} 540) rotate(-8)`}>
          <Glow cx={0} cy={0} r={300} color="#cfe0ff" opacity={0.45} />
          <rect x={-200} y={-400} width={400} height={800} rx={58} fill="#18191c" />
          <circle cx={-110} cy={-310} r={36} fill="#26272b" />
          <circle cx={-110} cy={-310} r={20} fill="#0a0a0b" />
        </g>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M ${1210 + i * 30} ${480 - i * 20} q 18 30 0 60`} stroke={C.sil} strokeWidth={6} fill="none" opacity={Math.abs(Math.sin(t * 0.5 + i))} />
        ))}
      </Layer>
      <Sfx name="buzz" at={0} volume={0.8} dur={70} />
    </Shot>
  );
};
export const S10 = [A, B, C3];
