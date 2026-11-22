import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FLOOR_Y} from '../theme';
import {EASE, keys, ramp, rectPath, wobbler} from '../lib';
import {Hero} from '../components/Hero';
import {Friend, Glow} from '../components/Things';
import {Layer, SceneFrame, Sfx} from '../components/Stage';
import {DinnerTable} from './Dinner';

const DOORS = [560, 960, 1360];
const KNOCK = [28, 74, 120];
const TABLE_CUT = 180;

// 6000–6300: he knocks on doors; friends light up warm one by one. Hard cut to the full, laughing table.
export const Scene26: React.FC = () => {
  const f = useCurrentFrame();
  const w = wobbler(f, 'd26', 1);
  const hx = keys(f, [0, 20, 40, 66, 86, 112, 132, 170], [300, 440, 440, 840, 840, 1240, 1240, 1240], EASE);
  const walking = [0, 40, 86, 132].some((s, i) => f >= s && f < [20, 66, 112, 170][i]) && f < 132;
  if (f >= TABLE_CUT) {
    const lt = f - TABLE_CUT;
    return (
      <SceneFrame dur={300} fadeIn={0} cam={(t) => ({zoom: keys(t, [TABLE_CUT, 300], [1.2, 1.3]), x: keys(t, [TABLE_CUT, 300], [-40, 40]), fx: 1000, fy: 540})}>
        <Layer depth={0.8}>
          <Glow cx={1000} cy={350} r={700} color="#ffb661" opacity={0.25} />
        </Layer>
        <Layer depth={1}>
          <DinnerTable f={lt + 600} warm={[1, 1, 1]} laugh={[1, 1, 1]} heroPhone={false} heroEmotion="smile" chains={false} />
        </Layer>
        <Sfx name="laughs" at={TABLE_CUT} volume={0.8} />
      </SceneFrame>
    );
  }
  return (
    <SceneFrame dur={300} fadeOut={0} cam={(t) => ({zoom: 1.15, x: keys(t, [0, 170], [-260, 260], EASE), fx: 960, fy: 560})}>
      <Layer depth={1}>
        {DOORS.map((x, i) => {
          const open = ramp(f, KNOCK[i] + 10, KNOCK[i] + 24, 0, 1, EASE);
          return (
            <g key={i}>
              <path d={rectPath(w, x - 90, FLOOR_Y - 330, 180, 330, 3)} fill={C.grey2} stroke={C.ink} strokeWidth={3} />
              <rect x={x - 80} y={FLOOR_Y - 320} width={160} height={320} fill="#ffcf7a" opacity={open} />
              {open > 0 ? <Glow cx={x} cy={FLOOR_Y - 150} r={330} color="#ffb661" opacity={0.45 * open} /> : null}
              {open > 0 ? <Friend x={x} y={FLOOR_Y} frame={f} pose="stand" warm={open} facing={-1} seed={'k' + i} scale={1.25} laugh={open} /> : null}
              <g transform={`translate(${x - 80} ${FLOOR_Y - 320}) scale(${1 - open * 0.85} 1)`}>
                <rect x={0} y={0} width={160} height={320} fill={C.furn} stroke={C.ink} strokeWidth={3} />
                <circle cx={140} cy={170} r={7} fill="#c9b98a" />
              </g>
            </g>
          );
        })}
        <Hero x={hx} y={FLOOR_Y} frame={f} pose={walking ? 'walk' : 'stand'} headband emotion="smile" rig={KNOCK.some((k) => f >= k && f < k + 10) ? {armF: [100 + 20 * Math.sin(f * 2), 30]} : undefined} />
      </Layer>
      {KNOCK.map((k) => (
        <Sfx key={k} name="knock" at={k} volume={0.9} />
      ))}
      {KNOCK.map((k) => (
        <Sfx key={'o' + k} name="door" at={k + 10} volume={0.6} />
      ))}
    </SceneFrame>
  );
};
