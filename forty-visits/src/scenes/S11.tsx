import React from 'react';
import {ramp} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Bedroom, BED_TOP} from '../environments/Bedroom';
import {Glow} from '../environments/common';
import {Phone} from '../inserts/PhoneUI';
import {VoiceMessage} from '../inserts/Inserts';
import {Expr} from '../characters/Silhouette';
import {SAM, useT} from './kit';

export const SamInBed: React.FC<{g: number; expr?: Expr; look?: [number, number]; tilt?: number}> = ({g, expr = 'tired', look = [3, 4], tilt = 0}) => (
  <>
    <Layer depth={0.8} blur={2.5}>
      <Bedroom mood="night" />
    </Layer>
    <Layer depth={1}>
      {SAM({x: 640, y: BED_TOP + 70, frame: g, scale: 1.5, pose: 'sit', expr, look, tilt, eyeGlow: '#e3ecff', rig: {armF: [110, 50], armB: [100, 60], head: 12, legF: [86, 4], legB: [84, 4]}, handItem: <Phone x={0} y={-30} scale={0.09} mode={{kind: 'off'}} hand={false} glow={0} />})}
      <path d={`M 560 ${BED_TOP + 6} Q 840 ${BED_TOP - 22} 1120 ${BED_TOP + 6} L 1120 ${BED_TOP + 110} L 560 ${BED_TOP + 110} Z`} fill="#30333b" />
      <Glow cx={760} cy={BED_TOP - 170} r={260} color="#cfe0ff" opacity={0.4} />
    </Layer>
  </>
);
const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot drift={[-30, 0]} zoom={[1.0, 1.05]}>
      <SamInBed g={g} />
      <Sfx name="tap" at={80} volume={0.7} />
    </Shot>
  );
};
// insert: the voice message plays, mom's words appear
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#0c0d10" zoom={[1.0, 1.04]}>
      <Layer depth={1}>
        <VoiceMessage x={960} y={420} s={1.0} progress={ramp(t, 0, 100)} lines={['"Hi son… nothing important…"', '"I just wanted to hear you."']} shown={ramp(t, 6, 18) + ramp(t, 52, 64)} />
      </Layer>
      <Sfx name="momvoice" at={0} volume={0.7} dur={100} />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 3.0, fx: 700, fy: 420})}>
      <SamInBed g={g} expr="sad" look={[2, 2]} tilt={6} />
    </Shot>
  );
};
export const S11 = [A, B, C3];
