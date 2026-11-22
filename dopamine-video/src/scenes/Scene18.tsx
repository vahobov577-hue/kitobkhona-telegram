import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {keys, ramp} from '../lib';
import {Hero} from '../components/Hero';
import {HandPhone} from '../components/Things';
import {Layer, Motes, Narration, SceneFrame, Sfx} from '../components/Stage';

// 3900–4200: he sits hugging his knees in a beam of light. Three lines.
export const Scene18: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame
      dur={300}
      cam={(t) => ({zoom: keys(t, [0, 300], [0.96, 1.1]), y: keys(t, [0, 300], [-40, 30]), fx: 960, fy: 620})}
      overlay={
        <>
          <Narration text="It didn't steal his time." from={12} to={100} />
          <Narration text="He gave it away." from={106} to={190} />
          <Narration text="Every single day." from={196} to={298} bold size={78} />
        </>
      }
    >
      <Layer depth={1}>
        <defs>
          <linearGradient id="cone18" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0.05} />
          </linearGradient>
          <radialGradient id="pool18">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0} />
          </radialGradient>
          <clipPath id="cc18">
            <polygon points={`905,-80 1015,-80 1230,${FLOOR_Y} 690,${FLOOR_Y}`} />
          </clipPath>
        </defs>
        <polygon points={`905,-80 1015,-80 1230,${FLOOR_Y} 690,${FLOOR_Y}`} fill="url(#cone18)" />
        <ellipse cx={960} cy={FLOOR_Y + 4} rx={300} ry={34} fill="url(#pool18)" />
        <g transform={`translate(1150 ${FLOOR_Y - 4})`}>
          <HandPhone rot={-90} scale={1.4} screen="black" />
        </g>
        <Hero x={940} y={FLOOR_Y} frame={f} pose="hug" age={0.6} saturation={keys(f, [0, 300], [0.5, 0.65])} emotion="sad" rig={{head: 22 - 8 * ramp(f, 200, 260)}} />
        <g clipPath="url(#cc18)">
          <Motes n={36} x0={700} x1={1220} y0={-60} y1={FLOOR_Y} seed="c18" fall={0.25} size={2.2} opacity={0.6} />
        </g>
      </Layer>
      <Sfx name="tick" at={0} volume={0.3} dur={10} />
    </SceneFrame>
  );
};
