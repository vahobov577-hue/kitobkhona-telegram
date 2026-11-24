import React from 'react';
import {EASE, keys, ramp} from '../lib';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Park} from '../environments/ParkBench';
import {Napkin} from '../inserts/Inserts';
import {BenchWide} from './common';
import {useT} from './kit';

const NapkinBg: React.FC = () => (
  <Layer depth={0.5} blur={10}>
    <Park mood="grey" />
  </Layer>
);
const Pen: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-6} y={-140} width={12} height={150} rx={4} fill="#22324a" transform="rotate(28)" />
    <g fill={C.sil} transform="rotate(28)">
      <ellipse cx={20} cy={-90} rx={60} ry={50} />
      <rect x={0} y={-80} width={120} height={700} rx={55} transform="rotate(-40)" />
    </g>
  </g>
);
// insert: his hand writes the numbers
const A: React.FC = () => {
  const {t} = useT();
  const r = ramp(t, 4, 76, 0, 4);
  const line = Math.min(3, Math.floor(r));
  const px = 960 - 250 * 0.95 + (r - line) * 380 * 0.95 + 30;
  const py = 560 - 200 * 0.95 + line * 90 * 0.95 - 20;
  return (
    <Shot zoom={[1.0, 1.04]}>
      <NapkinBg />
      <Layer depth={1}>
        <Napkin x={960} y={560} s={0.95} rot={-3} reveal={r} />
        <Pen x={px} y={py} />
      </Layer>
      <Sfx name="pencil" at={4} volume={0.6} dur={72} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.55, fx: 960, fy: 640})}>
      <BenchWide g={g} samExpr="worried" arthurExpr="neutral" pigeons={false} samHand={<rect x={-30} y={-20} width={60} height={50} fill="#f4f1ea" />} />
    </Shot>
  );
};
// insert: "= 40" circled, Arthur's finger taps on it
const C3: React.FC = () => {
  const {t} = useT();
  const tap = t > 40 ? Math.max(0, Math.sin((t - 40) * 0.6)) * 18 : 0;
  return (
    <Shot cam={() => ({zoom: 1.5, fx: 1000, fy: 720, x: 40, y: 180})}>
      <NapkinBg />
      <Layer depth={1}>
        <Napkin x={960} y={560} s={0.95} rot={-3} reveal={5} circle={ramp(t, 4, 30, 0, 1, EASE)} />
        <g transform={`translate(${keys(t, [20, 40], [1700, 1130], EASE)} ${740 - tap})`} fill={C.sil}>
          <rect x={-18} y={-20} width={36} height={120} rx={18} />
          <ellipse cx={30} cy={120} rx={80} ry={90} />
          <rect x={0} y={150} width={700} height={130} rx={60} />
        </g>
      </Layer>
      <Sfx name="marker" at={4} volume={0.4} />
      <Sfx name="tap" at={42} volume={0.6} />
      <Sfx name="tap" at={52} volume={0.6} />
    </Shot>
  );
};
export const S13 = [A, B, C3];
