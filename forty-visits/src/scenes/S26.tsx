import React from 'react';
import {EASE, keys} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {HomeOutside} from '../environments/HometownGate';
import {Glow} from '../environments/common';
import {DAD, MOM, SAM, useT} from './kit';

/** what we see through the window: Mom & Dad alone at a small table, a tiny cake with one candle */
const Inside: React.FC<{g: number}> = ({g}) => (
  <g>
    <rect x={900} y={430} width={440} height={260} fill="#f0c47a" />
    <rect x={960} y={620} width={320} height={10} fill="#6a4a36" />
    {MOM({x: 1030, y: 720, frame: g, scale: 0.62, pose: 'sit', expr: 'sad', look: [3, 2], rig: {head: 10}})}
    {DAD({x: 1210, y: 720, frame: g, scale: 0.66, pose: 'sit', facing: -1, expr: 'tired', look: [-3, 2]})}
    <rect x={1105} y={598} width={30} height={22} rx={3} fill="#f6efe0" />
    <rect x={1118} y={584} width={4} height={14} fill="#fff" />
    <ellipse cx={1120} cy={578} rx={3} ry={6} fill="#ffcf5a" opacity={0.6 + Math.sin(g * 0.4) * 0.3} />
    <Glow cx={1120} cy={580} r={60} color="#ffcf5a" opacity={0.5} />
  </g>
);

// HOOK 3:30 — total silence: only a clock tick & the wind. The gate creaks.
const A: React.FC = () => {
  const {t, g} = useT();
  const gate = keys(t, [40, 80], [0, 1], EASE);
  return (
    <Shot zoom={[1.0, 1.03]}>
      <Layer depth={1}>
        <HomeOutside gate={gate} inWindow={<Inside g={g} />} />
        {SAM({x: keys(t, [0, 40, 80, 100], [380, 540, 600, 660], EASE), y: 900, frame: g, scale: 1.5, pose: t < 40 || t > 80 ? 'walk' : 'stand', back: true, handItem: <rect x={-30} y={-10} width={70} height={50} rx={3} fill="#f6efe0" />})}
      </Layer>
      <Sfx name="wind" at={0} volume={0.5} dur={100} />
      <Sfx name="creak" at={44} volume={0.8} />
    </Shot>
  );
};
// far: from behind Sam, the lit window pulls him in
const B: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.8, fx: 1120, fy: 560, x: 1120 - 960, y: 560 - 540})} zoom={[1.0, 1.06]}>
      <Layer depth={1}>
        <HomeOutside gate={1} inWindow={<Inside g={g} />} />
      </Layer>
      <Layer depth={1.25} blur={14}>
        {SAM({x: 860, y: 1300, frame: g, scale: 3.2, pose: 'stand', back: true})}
      </Layer>
      <Sfx name="wind" at={0} volume={0.4} dur={100} />
      <Sfx name="tick" at={0} volume={0.5} dur={100} />
    </Shot>
  );
};
// insert: knuckles on the door, three knocks
const C3: React.FC = () => {
  const {t} = useT();
  const knock = [30, 46, 62].reduce((a, k) => a + Math.max(0, 1 - Math.abs(t - k) / 5), 0);
  return (
    <Shot zoom={[1.02, 1.05]}>
      <Layer depth={1}>
        <rect x={-300} y={-300} width={2600} height={1700} fill="#bda886" />
        <rect x={560} y={-100} width={760} height={1300} fill="#4a3a2e" />
        {[0, 1].map((i) => (
          <rect key={i} x={620 + i * 340} y={40 + 0} width={300} height={440} fill="none" stroke="#3a2c22" strokeWidth={14} />
        ))}
        <circle cx={1220} cy={620} r={22} fill="#c8a86a" />
        <g transform={`translate(${900 - knock * 40} 600)`} fill="#0E0E0E">
          <rect x={-900} y={-70} width={900} height={140} rx={60} />
          <ellipse cx={20} cy={0} rx={90} ry={95} />
        </g>
        <Glow cx={960} cy={1200} r={600} color="#ffcf7a" opacity={0.25} />
      </Layer>
      {[30, 46, 62].map((a) => (
        <Sfx key={a} name="knock" at={a} volume={0.9} />
      ))}
      <Sfx name="wind" at={0} volume={0.3} dur={100} />
    </Shot>
  );
};
export const S26 = [A, B, C3];
