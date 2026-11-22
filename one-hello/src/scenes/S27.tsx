import React from 'react';
import {EASE, keys} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Finger, Phone} from '../inserts/PhoneUI';
import {InBed} from './S11';
import {useT} from './kit';

// HOOK 3:23 — total silence; the same ringback as S5 (the loop closes: it was him calling)
const RING = [40, 100];
const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot drift={[-20, 0]} zoom={[1.0, 1.05]}>
      <InBed frame={g} expr="worried" phone={<g transform="rotate(-40)"><Phone x={0} y={-30} scale={0.09} mode={{kind: 'calling', name: 'DAN', t: 0}} hand={false} glow={0} /></g>} />
      <Sfx name="ringback" at={RING[0]} volume={0.9} dur={46} />
      <Sfx name="ringback" at={RING[1]} volume={0.9} dur={20} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#111" zoom={[1.02, 1.08]}>
      <Layer depth={0.5} blur={8}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#1b1d22" />
      </Layer>
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={{kind: 'calling', name: 'DAN', t}} />
      </Layer>
      <Sfx name="ringback" at={20} volume={0.9} dur={46} />
      <Sfx name="ringback" at={80} volume={0.9} dur={40} />
    </Shot>
  );
};
// insert: the finger moves towards END…
const C3: React.FC = () => {
  const {t} = useT();
  const fy = keys(t, [0, 100], [600, 40], EASE);
  return (
    <Shot bg="#111" cam={() => ({zoom: keys(t, [0, 120], [1.3, 1.7]), fx: 960, fy: 760})}>
      <Layer depth={0.5} blur={8}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#1b1d22" />
      </Layer>
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={{kind: 'calling', name: 'DAN', t: t + 120, endPress: 0}} hand={false} />
        <g transform={`translate(960 ${560 + 1.05 * 250 + fy})`}>
          <Finger x={0} y={0} />
        </g>
      </Layer>
      <Sfx name="ringback" at={20} volume={0.9} dur={46} />
      <Sfx name="ringback" at={80} volume={0.9} dur={38} />
    </Shot>
  );
};
export const S27 = [A, B, C3];
