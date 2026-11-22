import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {EASE, keys, ramp} from '../lib';
import {Hero} from '../components/Hero';
import {HILL_TOP, Hill} from '../components/Things';
import {Layer, Narration, SceneFrame, Sfx} from '../components/Stage';

// 6960–7320: dawn on the hill, orange sky, wind in the headband. Two lines.
export const Scene29: React.FC = () => {
  const f = useCurrentFrame();
  const sunY = keys(f, [0, 300], [900, 560], EASE);
  return (
    <SceneFrame
      dur={360}
      floor={false}
      fadeIn={20}
      fadeInColor="#fff"
      vignette={0.55}
      cam={(t) => ({zoom: keys(t, [0, 360], [1.15, 1.0], EASE), y: keys(t, [0, 360], [70, -10], EASE), fx: 1000, fy: 640})}
      bg={<AbsoluteFill style={{background: 'linear-gradient(180deg, #2a1838 0%, #6b2d58 30%, #d2566a 55%, #f6994d 75%, #ffc070 100%)'}} />}
      overlay={
        <>
          <Narration text="The phone was never the enemy." from={30} to={170} y={130} />
          <Narration text="Losing control was." from={180} to={354} y={130} bold size={76} />
        </>
      }
    >
      <Layer depth={0.3}>
        <g transform={`translate(1240 ${sunY}) rotate(${f * 0.15})`}>
          {Array.from({length: 16}).map((_, i) => (
            <polygon key={i} points="0,0 -26,-760 26,-760" fill="#ffe3a0" opacity={0.06} transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
        <circle cx={1240} cy={sunY} r={300} fill={C.sun} opacity={0.25} style={{filter: 'blur(40px)'}} />
        <circle cx={1240} cy={sunY} r={92} fill="#fff1c4" />
      </Layer>
      <Layer depth={1}>
        <Hill />
        {Array.from({length: 40}).map((_, i) => {
          const x = 640 + i * 18;
          const dy = Math.pow((x - 1000) / 420, 2) * 55;
          const sway = Math.sin(f * 0.12 + i * 0.7) * 6;
          return <path key={i} d={`M ${x} ${HILL_TOP + dy + 4} q ${sway / 2} -8 ${sway} -16`} stroke="#1a1020" strokeWidth={3} fill="none" strokeLinecap="round" />;
        })}
        <Hero x={1000} y={HILL_TOP + 2} frame={f} scale={1.15} pose="stand" headband emotion="neutral" emotionTo="smile" emotionT={ramp(f, 190, 196)} wind={2.2} />
      </Layer>
      <Layer depth={1.35}>
        {Array.from({length: 12}).map((_, i) => {
          const x = ((i * 173 + f * (3 + (i % 3))) % 2200) - 140;
          const y = 300 + ((i * 97) % 500);
          return <path key={i} d={`M ${x} ${y} q 40 -6 80 0`} stroke="#fff" strokeWidth={2} opacity={0.18} fill="none" strokeLinecap="round" />;
        })}
      </Layer>
      <Sfx name="wind" at={0} volume={0.35} dur={360} />
    </SceneFrame>
  );
};
