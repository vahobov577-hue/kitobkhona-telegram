import React from 'react';
import {EASE, keys} from '../lib';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Houses, SIDEWALK_Y, SkyBg, StreetFront} from '../environments/Street';
import {Silhouette} from '../characters/Silhouette';
import {LEO, useT} from './kit';

export const RUNNERS = [
  {acc: 'pony' as const, dx: 0},
  {acc: 'none' as const, dx: 90},
  {acc: 'dan' as const, dx: 180},
  {acc: 'none' as const, dx: 260},
  {acc: 'pony' as const, dx: 350},
  {acc: 'none' as const, dx: 440},
  {acc: 'none' as const, dx: 520},
  {acc: 'pony' as const, dx: 610},
];

const Dawn: React.FC<{blur?: number}> = ({blur = 2}) => (
  <Layer depth={0.75} blur={blur}>
    <SkyBg sky="dawn" />
    <Houses sky="dawn" offset={200} />
    <StreetFront sky="dawn" lamps={1} leaves={1} />
  </Layer>
);

// far: 8 runners warming up at the corner, Leo apart
const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot zoom={[1.0, 1.03]}>
      <Dawn />
      <Layer depth={1}>
        {RUNNERS.map((r, i) => (
          <Silhouette key={i} seed={'rn' + i} acc={r.acc} x={980 + r.dx} y={SIDEWALK_Y + 20} frame={g + i * 13} scale={0.75} pose={i % 3 === 0 ? 'tie' : 'stand'} expr="happy" />
        ))}
        {LEO({x: 520, y: SIDEWALK_Y + 20, frame: g, scale: 0.75, expr: 'worried', look: [6, 0]})}
      </Layer>
      <Sfx name="birds" at={0} volume={0.4} dur={100} />
    </Shot>
  );
};
// insert: his sneakers, shifting on the spot
const B: React.FC = () => {
  const {t} = useT();
  const shift = Math.sin(t * 0.25);
  const shoe = (x: number, lift: number) => (
    <g transform={`translate(${x} ${SIDEWALK_Y + 160 - lift})`}>
      <rect x={-12} y={-600} width={24} height={600} rx={12} fill={C.sil} />
      <path d="M -60 -10 Q -50 -70 20 -64 L 120 -40 Q 150 -30 150 0 L -60 0 Z" fill="#e9e9e6" />
      <path d="M -60 0 L 150 0" stroke="#9a9a96" strokeWidth={10} />
      <path d="M 0 -56 L 60 -46 M 10 -44 L 70 -36" stroke="#b9b9b5" strokeWidth={5} />
    </g>
  );
  return (
    <Shot cam={() => ({zoom: 1.0})} zoom={[1.0, 1.03]}>
      <Layer depth={0.6} blur={8}>
        <SkyBg sky="dawn" />
        <StreetFront sky="dawn" lamps={1} trees={false} />
      </Layer>
      <Layer depth={1}>
        {shoe(800, Math.max(0, shift) * 30)}
        {shoe(1060, Math.max(0, -shift) * 30)}
      </Layer>
    </Shot>
  );
};
// medium: he steps forward
const C3: React.FC = () => {
  const {t, g} = useT();
  const x = keys(t, [30, 70], [700, 860], EASE);
  return (
    <Shot cam={() => ({zoom: 1.4, fx: 960, fy: 640})}>
      <Dawn blur={3} />
      <Layer depth={1}>
        {RUNNERS.slice(0, 3).map((r, i) => (
          <Silhouette key={i} seed={'rn' + i} acc={r.acc} x={1200 + i * 150} y={SIDEWALK_Y + 20} frame={g + i * 13} scale={1.3} facing={-1} expr="happy" />
        ))}
        {LEO({x, y: SIDEWALK_Y + 20, frame: g, scale: 1.4, pose: t > 30 && t < 70 ? 'walk' : 'stand', speed: 0.7, expr: t > 50 ? 'determined' : 'worried', look: [6, 0]})}
      </Layer>
      <Sfx name="steps" at={30} volume={0.4} />
    </Shot>
  );
};
export const S21 = [A, B, C3];
