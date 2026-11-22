import React from 'react';
import {EASE, ramp} from '../lib';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {BikeRoad, Rooftop} from '../environments/Misc';
import {Polaroid} from '../inserts/Polaroid';
import {Silhouette} from '../characters/Silhouette';
import {useT} from './kit';

const WARM = {sat: 0.55, tint: '#ffcf8a', tintOpacity: 0.45};

export const RoofKids: React.FC<{frame: number; laugh?: boolean}> = ({frame, laugh = true}) => (
  <>
    <Rooftop />
    <Silhouette seed="yl" x={820} y={760} frame={frame} scale={1.05} pose="sit" expr={laugh ? 'happy' : 'neutral'} talk={laugh ? 0.6 : 0} rig={{armB: [-30, 0]}} />
    <Silhouette seed="yd" acc="dan" x={1040} y={760} frame={frame + 30} scale={1.05} pose="sit" facing={-1} expr={laugh ? 'happy' : 'neutral'} talk={laugh ? 0.8 : 0} rig={{armF: [120, 40]}} />
  </>
);
const Bike: React.FC<{x: number; y: number; frame: number; seed: string; acc?: 'dan' | 'none'}> = ({x, y, frame, seed, acc = 'none'}) => (
  <g>
    <g transform={`translate(${x} ${y})`} stroke={C.sil} strokeWidth={6} fill="none">
      <circle cx={-60} cy={-40} r={40} />
      <circle cx={70} cy={-40} r={40} />
      <path d="M -60 -40 L -10 -40 L 30 -100 L -30 -100 Z M 30 -100 L 70 -40 M 30 -100 L 40 -130 L 60 -130" />
    </g>
    <Silhouette seed={seed} acc={acc} x={x - 10} y={y - 40} frame={frame} scale={0.95} pose="sit" expr="happy" rig={{hipY: -110, legF: [40 + 30 * Math.sin(frame * 0.3), 60], legB: [40 - 30 * Math.sin(frame * 0.3), 60], armF: [100, 0], body: 14}} />
  </g>
);
export const BikeKids: React.FC<{frame: number}> = ({frame}) => (
  <>
    <BikeRoad />
    <Bike x={760 + frame * 0.6} y={860} frame={frame} seed="yl" />
    <Bike x={1060 + frame * 0.6} y={860} frame={frame + 9} seed="yd" acc="dan" />
  </>
);

const Flip: React.FC<{children: React.ReactNode; caption: string; rot: number}> = ({children, caption, rot}) => {
  const {t} = useT();
  return (
    <Shot {...WARM} bg="#2a2420" zoom={[1.0, 1.06]}>
      <Layer depth={0.5} blur={8}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#3a322b" />
        <rect x={300} y={700} width={1400} height={700} fill="#4a3f35" />
      </Layer>
      <Layer depth={1}>
        <Polaroid x={960} y={560} s={1.2} rot={rot} flip={ramp(t, 4, 22, 0, 1, EASE)} caption={caption}>
          {children}
        </Polaroid>
      </Layer>
      <Sfx name="flip" at={4} volume={0.7} />
    </Shot>
  );
};

const A: React.FC = () => (
  <Flip caption="the roof, 2014" rot={-4}>
    <RoofKids frame={0} />
  </Flip>
);
const B: React.FC = () => {
  const {g} = useT();
  return (
    <Shot {...WARM} drift={[40, 0]}>
      <Layer depth={1}>
        <RoofKids frame={g} />
      </Layer>
      <Sfx name="kidslaugh" at={6} volume={0.4} />
    </Shot>
  );
};
const C3: React.FC = () => (
  <Flip caption="us" rot={5}>
    <BikeKids frame={0} />
  </Flip>
);
const D: React.FC = () => {
  const {t} = useT();
  return (
    <Shot {...WARM} cam={() => ({zoom: 0.9, fx: 960, fy: 700})}>
      <Layer depth={1}>
        <BikeKids frame={t * 2} />
      </Layer>
    </Shot>
  );
};
export const S24 = [A, B, C3, D];
