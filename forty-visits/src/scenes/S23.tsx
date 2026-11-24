import React from 'react';
import {EASE, keys} from '../lib';
import {C, FONT_HAND} from '../theme';
import {Layer} from '../effects/Parallax';
import {Line, Shot} from '../effects/Shot';
import {Park} from '../environments/ParkBench';
import {Silhouette} from '../characters/Silhouette';
import {BenchOTS} from './common';
import {useT} from './kit';

const OldPhoto: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-160} y={-200} width={320} height={400} fill="#efe2c4" />
    <rect x={-136} y={-176} width={272} height={300} fill="#b89a6a" />
    <rect x={-136} y={-176} width={272} height={300} fill="#5a4026" opacity={0.25} />
    <g transform="translate(0 120) scale(0.55)">
      <Silhouette x={0} y={0} frame={0} scale={1.3} seed="wife" acc="mom" expr="happy" fill="#2a1e14" />
    </g>
    <text x={0} y={175} textAnchor="middle" fontFamily={FONT_HAND} fontSize={28} fill="#7a6650">1971</text>
  </g>
);
const A: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot drift={[-20, 0]} overlay={<Line text="I had forty too." from={40} to={116} />}>
      <BenchOTS g={g} subject="arthur" expr="sad" talk={t > 40 && t < 80 ? 0.7 : 0} tilt={-6} hand={t > 10 ? <g transform={`translate(0 ${keys(t, [10, 36], [60, 0], EASE)})`}><OldPhoto x={0} y={-60} s={0.3} rot={-10} /></g> : undefined} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 2.4, fx: 960, fy: 400, x: 0, y: 0})} overlay={<Line text="I used six." from={56} to={118} />}>
      <BenchOTS g={g} subject="arthur" expr={t > 56 ? 'sad' : 'closed'} talk={t > 56 && t < 80 ? 0.6 : 0} fg={false} tilt={-8} />
    </Shot>
  );
};
const C3: React.FC = () => (
  <Shot zoom={[1.0, 1.06]}>
    <Layer depth={0.5} blur={10}>
      <Park mood="grey" />
    </Layer>
    <Layer depth={1}>
      <OldPhoto x={960} y={540} s={1.7} rot={-4} />
      <g fill={C.sil}>
        <rect x={1180} y={600} width={80} height={60} rx={30} />
        <rect x={1230} y={560} width={700} height={160} rx={70} />
        <rect x={640} y={640} width={80} height={60} rx={30} />
      </g>
    </Layer>
  </Shot>
);
export const S23 = [A, B, C3];
