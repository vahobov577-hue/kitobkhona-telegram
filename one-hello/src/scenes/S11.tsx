import React from 'react';
import {keys} from '../lib';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Line, Shot} from '../effects/Shot';
import {Bedroom, BED_TOP} from '../environments/Bedroom';
import {Glow} from '../environments/common';
import {Clock} from '../inserts/Watch';
import {Phone} from '../inserts/PhoneUI';
import {LEO, useT} from './kit';

export const InBed: React.FC<{frame: number; expr?: 'neutral' | 'sad' | 'tired' | 'surprised' | 'happy' | 'worried'; phone?: React.ReactNode; light?: string; lamp?: number; warm?: number; mood?: 'night' | 'dawn' | 'day'}> = ({frame, expr = 'tired', phone, light = '#cfe0ff', lamp = 0, warm = 0, mood = 'night'}) => (
  <>
    <Layer depth={0.8} blur={2.5}>
      <Bedroom mood={mood} lamp={lamp} warm={warm} />
    </Layer>
    <Layer depth={1}>
      {LEO({x: 640, y: BED_TOP + 70, frame, scale: 1.5, pose: 'sit', expr, eyeGlow: light, rig: {armF: [110, 50], armB: [100, 60], head: 10, legF: [86, 4], legB: [84, 4]}, handItem: phone})}
      <path d={`M 560 ${BED_TOP + 6} Q 840 ${BED_TOP - 22} 1120 ${BED_TOP + 6} L 1120 ${BED_TOP + 110} L 560 ${BED_TOP + 110} Z`} fill={mood === 'night' ? '#30333b' : '#9fb0bd'} />
      <Glow cx={760} cy={BED_TOP - 170} r={260} color={light} opacity={0.35} />
      <Clock x={1225} y={BED_TOP - 4} s={0.22} time="1:40" />
    </Layer>
  </>
);

const A: React.FC = () => {
  const {g} = useT();
  return (
    <Shot drift={[-30, 0]} zoom={[1.0, 1.05]}>
      <InBed frame={g} phone={<Phone x={0} y={-30} scale={0.09} mode={{kind: 'photos', scroll: 0}} hand={false} glow={0} />} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#111" zoom={[1.08, 1.12]}>
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.0} rot={-4} mode={{kind: 'photos', scroll: keys(t, [0, 70], [0, 700])}} />
      </Layer>
    </Shot>
  );
};
const C3: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 2.5, fx: 700, fy: 420})} overlay={<Line text="Maybe tomorrow?" from={16} to={70} color={C.orange} />}>
      <InBed frame={g} expr="sad" phone={<Phone x={0} y={-30} scale={0.09} mode={{kind: 'photos', scroll: 0}} hand={false} glow={0} />} />
    </Shot>
  );
};
export const S11 = [A, B, C3];
