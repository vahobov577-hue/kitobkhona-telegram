import React from 'react';
import {Layer} from '../effects/Parallax';
import {Shot} from '../effects/Shot';
import {Clock} from '../inserts/Watch';
import {Phone} from '../inserts/PhoneUI';
import {InBed} from './S11';
import {useT} from './kit';
import {Glow} from '../environments/common';

const fmt = (m: number) => `${Math.floor(m / 60) % 24}:${String(Math.floor(m % 60)).padStart(2, '0')}`;

// insert: clock 22:10 → 01:30
const A: React.FC = () => {
  const {t} = useT();
  const m = 22 * 60 + 10 + (t / 150) * (200);
  return (
    <Shot bg="#16120e" zoom={[1.0, 1.06]} ungraded={<Layer depth={1}><Glow cx={960} cy={560} r={600} color="#FFB347" opacity={0.25} /></Layer>}>
      <Layer depth={0.5} blur={8}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#241d17" />
      </Layer>
      <Layer depth={1}>
        <Clock x={960} y={560} s={1.6} time={fmt(m)} />
      </Layer>
    </Shot>
  );
};
// wide: window night → dawn, he's still talking
const B: React.FC = () => {
  const {t, g} = useT();
  const k = t / 150;
  return (
    <Shot zoom={[1.0, 1.04]} sat={0.7}>
      <InBed frame={g} expr="happy" light="#ffe2b0" warm={0.8} mood="night" phone={<g transform="rotate(-40)"><Phone x={0} y={-30} scale={0.09} mode={{kind: 'connected', name: 'DAN', timer: '2:40:10'}} hand={false} glow={0} /></g>} />
      <Layer depth={1} opacity={Math.min(1, Math.max(0, (k - 0.35) / 0.5))}>
        <g />
      </Layer>
      <div style={{position: 'absolute', inset: 0, opacity: Math.min(1, Math.max(0, (k - 0.35) / 0.5))}}>
        <InBed frame={g} expr="happy" light="#ffe2b0" warm={0.6} mood="dawn" phone={<g transform="rotate(-40)"><Phone x={0} y={-30} scale={0.09} mode={{kind: 'connected', name: 'DAN', timer: '3:05:00'}} hand={false} glow={0} /></g>} />
      </div>
    </Shot>
  );
};
// insert: call timer
const C3: React.FC = () => {
  const {t} = useT();
  const s = 3 * 3600 + 12 * 60 + 15 + Math.floor(t / 5);
  const timer = `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return (
    <Shot bg="#16120e" zoom={[1.05, 1.1]} ungraded={<Layer depth={1}><Glow cx={960} cy={560} r={600} color="#FFB347" opacity={0.3} /></Layer>}>
      <Layer depth={0.5} blur={8}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#2a2119" />
      </Layer>
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={{kind: 'connected', name: 'DAN', timer}} />
      </Layer>
    </Shot>
  );
};
export const S29 = [A, B, C3];
