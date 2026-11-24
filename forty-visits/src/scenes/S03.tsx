import React from 'react';
import {ramp} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {LaptopDesk} from '../environments/CityApartment';
import {Room, Glow, Window} from '../environments/common';
import {CalcScreen} from '../inserts/Inserts';
import {SAM, useT} from './kit';

const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#111" cam={() => ({zoom: 1.45, fx: 960, fy: 520, x: 0, y: -20})}>
      <Layer depth={1}>
        <LaptopDesk>
          <CalcScreen reveal={ramp(t, 4, 44)} result={ramp(t, 52, 62)} />
        </LaptopDesk>
      </Layer>
      {Array.from({length: 9}).map((_, i) => (
        <Sfx key={i} name="key" at={6 + i * 4} volume={0.4} dur={8} />
      ))}
      <Sfx name="thud" at={52} volume={0.7} />
    </Shot>
  );
};
/** Sam at the laptop, seen from the screen (lid back blurred in the foreground) */
export const SamAtLaptop: React.FC<{g: number; expr: 'surprised' | 'sad' | 'worried' | 'tired' | 'determined' | 'neutral'; look?: [number, number]; lid?: boolean}> = ({g, expr, look = [0, 2], lid = true}) => (
  <>
    <Layer depth={0.6} blur={4}>
      <Room wall="#1f2227" wall2="#272a31" floor="#141518" floorY={980} />
      <Window x={1300} y={120} w={520} h={420} mood="night" frame="#121316" seed="ld" />
    </Layer>
    <Layer depth={1}>
      {SAM({x: 960, y: 980, frame: g, scale: 2.4, pose: 'sitDesk', expr, look, eyeGlow: '#e3ecff', rig: {head: 4, body: 4}})}
      <Glow cx={960} cy={560} r={420} color="#cfe0ff" opacity={0.35} />
    </Layer>
    {lid ? (
      <Layer depth={1.3} blur={14}>
        <rect x={500} y={760} width={920} height={500} rx={20} fill="#2a2c31" />
        <circle cx={960} cy={900} r={30} fill="#3a3c42" />
      </Layer>
    ) : null}
  </>
);
const B: React.FC = () => {
  const {g} = useT();
  return (
    <Shot bg="#111" cam={() => ({zoom: 2.2, fx: 960, fy: 520, x: 0, y: 0})}>
      <SamAtLaptop g={g} expr="surprised" />
    </Shot>
  );
};
export const S03 = [A, B];
