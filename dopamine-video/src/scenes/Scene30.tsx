import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {EASE, keys, ramp, rectPath, wobbler} from '../lib';
import {Hero} from '../components/Hero';
import {PhoneMonster} from '../components/Monster';
import {Glow, HandPhone} from '../components/Things';
import {Layer, SceneFrame, Sfx} from '../components/Stage';
import {Bedroom} from './Room';

const DOOR = 1700;

// 7320–7560: morning. He calls someone, pockets the phone and walks out the door into the light.
// The little phone-monster in the corner sulks.
export const Scene30: React.FC = () => {
  const f = useCurrentFrame();
  const w = wobbler(f, 'd30', 1);
  const calling = f < 96;
  const pocket = ramp(f, 96, 116, 0, 1, EASE);
  const x = keys(f, [124, 210], [1020, DOOR + 40], EASE);
  const open = ramp(f, 150, 172, 0, 1, EASE);
  const armF: [number, number] = calling ? [150, 70] : [keys(pocket, [0, 1], [150, 10]), keys(pocket, [0, 1], [70, 6])];
  return (
    <SceneFrame dur={240} wipeOut={12} cam={(t) => ({zoom: keys(t, [0, 240], [1.12, 1.05]), x: keys(t, [0, 240], [-60, 160], EASE), fx: 1000, fy: 560})}>
      <Bedroom sky="morning" phone={false} clockMin={30} clockHour={240} />
      <Layer depth={1}>
        <path d={rectPath(w, DOOR - 90, FLOOR_Y - 330, 180, 330, 3)} fill="#ffd98a" stroke={'#151515'} strokeWidth={3} />
        <Glow cx={DOOR} cy={FLOOR_Y - 160} r={420} color="#ffc56b" opacity={0.6 * open} />
        <g transform={`translate(${DOOR - 80} ${FLOOR_Y - 320}) scale(${1 - open * 0.85} 1)`}>
          <rect x={0} y={0} width={160} height={320} fill="#4a4a55" stroke="#151515" strokeWidth={3} />
          <circle cx={140} cy={170} r={7} fill="#c9b98a" />
        </g>
        <PhoneMonster x={520} y={FLOOR_Y} scale={0.8 * (1 + 0.1 * Math.abs(Math.sin(f * 0.12)))} sulk={1} glow={0.7} />
        <Hero
          x={x}
          y={FLOOR_Y}
          frame={f}
          pose={f > 124 && f < 210 ? 'walk' : 'stand'}
          headband
          emotion="smile"
          mouth={calling && f > 20 ? Math.abs(Math.sin(f * 0.4)) * 0.8 : undefined}
          rig={f <= 124 ? {armF} : undefined}
          handItem={pocket < 0.9 ? <HandPhone rot={70} screen="lock" glow={0.2} /> : undefined}
          opacity={1 - ramp(f, 205, 228)}
        />
      </Layer>
      <Sfx name="dialtone" at={6} volume={0.4} />
      <Sfx name="door" at={150} volume={0.7} />
      <Sfx name="pout" at={60} volume={0.5} />
    </SceneFrame>
  );
};
