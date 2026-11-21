import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {EASE, keys, ramp} from '../lib';
import {Hero} from '../components/Hero';
import {Shadow} from '../components/Shadow';
import {Layer, Motes, Narration, SceneFrame} from '../components/Stage';

// 1710–2010: alone in a cone of light. Three narrator lines.
export const Scene08: React.FC = () => {
  const f = useCurrentFrame();
  const lift = ramp(f, 205, 260, 0, 1, EASE);
  return (
    <SceneFrame
      dur={300}
      cam={(t) => ({zoom: keys(t, [0, 300], [1.0, 1.14]), y: keys(t, [0, 300], [-30, 30]), fx: 960, fy: 620})}
      overlay={
        <>
          <Narration text="He waited for the fear to leave." from={12} to={100} />
          <Narration text="But fear never leaves." from={106} to={190} />
          <Narration text="You walk through it." from={196} to={298} bold size={76} />
        </>
      }
    >
      <Layer depth={1}>
        <defs>
          <linearGradient id="cone8" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0.05} />
          </linearGradient>
          <radialGradient id="pool8">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0} />
          </radialGradient>
          <clipPath id="coneClip8">
            <polygon points={`905,-80 1015,-80 1230,${FLOOR_Y} 690,${FLOOR_Y}`} />
          </clipPath>
        </defs>
        <polygon points={`905,-80 1015,-80 1230,${FLOOR_Y} 690,${FLOOR_Y}`} fill="url(#cone8)" />
        <ellipse cx={960} cy={FLOOR_Y + 4} rx={300} ry={34} fill="url(#pool8)" />
        <Shadow x={430} y={FLOOR_Y} frame={f} opacity={0.22 + 0.2 * ramp(f, 106, 150) - 0.15 * lift} scale={1.1} glow={0.5} smile={0.6} />
        <Hero
          x={960}
          y={FLOOR_Y}
          frame={f}
          pose="hug"
          rig={{head: 22 - 18 * lift, body: 24 - 8 * lift}}
          emotion="sad"
          emotionTo="determined"
          emotionT={ramp(f, 230, 236)}
        />
        <g clipPath="url(#coneClip8)">
          <Motes n={36} x0={700} x1={1220} y0={-60} y1={FLOOR_Y} seed="cone" fall={0.25} size={2.2} opacity={0.6} />
        </g>
      </Layer>
    </SceneFrame>
  );
};
