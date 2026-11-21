import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {EASE, keys, ramp, wobbler} from '../lib';
import {Hero} from '../components/Hero';
import {Layer, Narration, SceneFrame} from '../components/Stage';

const HILL_TOP = 700;

// 3750–4050: from white into sunrise. Hill, sun, wind in the headband.
export const Scene16: React.FC = () => {
  const f = useCurrentFrame();
  const w = wobbler(f, 'hill', 1);
  const sunY = keys(f, [0, 260], [880, 560], EASE);
  const grass = Array.from({length: 40}).map((_, i) => {
    const x = 640 + i * 18;
    const dy = Math.pow((x - 1000) / 420, 2) * 55;
    const sway = Math.sin(f * 0.12 + i * 0.7) * 6;
    return `M ${x} ${HILL_TOP + dy + 4} q ${sway / 2} -8 ${sway} -16`;
  });
  return (
    <SceneFrame
      dur={300}
      floor={false}
      fadeIn={20}
      fadeInColor="#fff"
      vignette={0.55}
      cam={(t) => ({zoom: keys(t, [0, 300], [1.12, 1.0], EASE), y: keys(t, [0, 300], [70, -10], EASE), fx: 1000, fy: 640})}
      bg={
        <AbsoluteFill style={{background: 'linear-gradient(180deg, #2a1838 0%, #6b2d58 30%, #d2566a 55%, #f6994d 75%, #ffc070 100%)'}} />
      }
      overlay={
        <>
          <Narration text="Fear didn't disappear." from={36} to={150} y={130} />
          <Narration text="He just stopped obeying it." from={158} to={296} y={130} />
        </>
      }
    >
      <Layer depth={0.3}>
        <defs>
          <radialGradient id="sun16">
            <stop offset="0%" stopColor="#fff4c8" stopOpacity={1} />
            <stop offset="30%" stopColor="#ffd27a" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#ffb05a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g transform={`translate(1240 ${sunY}) rotate(${f * 0.15})`}>
          {Array.from({length: 16}).map((_, i) => (
            <polygon key={i} points="0,0 -26,-760 26,-760" fill="#ffe3a0" opacity={0.06} transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
        <circle cx={1240} cy={sunY} r={340} fill="url(#sun16)" />
        <circle cx={1240} cy={sunY} r={92} fill="#fff1c4" />
      </Layer>
      <Layer depth={0.6}>
        <path d={w`M -400 ${HILL_TOP + 120} Q 300 ${HILL_TOP + 30} 900 ${HILL_TOP + 150} T 2400 ${HILL_TOP + 90} L 2400 1400 L -400 1400 Z`} fill="#3a1d34" />
      </Layer>
      <Layer depth={1}>
        <path d={w`M -300 1300 L -300 ${HILL_TOP + 200} Q 600 ${HILL_TOP - 14} 1000 ${HILL_TOP} Q 1400 ${HILL_TOP + 14} 2300 ${HILL_TOP + 220} L 2300 1300 Z`} fill="#1a1020" stroke={C.ink} strokeWidth={3} />
        {grass.map((d, i) => (
          <path key={i} d={d} stroke="#1a1020" strokeWidth={3} fill="none" strokeLinecap="round" />
        ))}
        {/* long cast shadow of the hero, still there — fear didn't disappear */}
        <g transform={`translate(990 ${HILL_TOP + 4}) scale(1 -0.13) skewX(56)`} opacity={0.55}>
          <ellipse cx={0} cy={-150} rx={48} ry={165} fill="#07040b" />
        </g>
        {[-8, 8].map((dx) => (
          <ellipse key={dx} cx={990 - 455 + dx} cy={HILL_TOP + 4 + 40} rx={4} ry={1.6} fill={C.red} opacity={0.75 * ramp(f, 60, 120)} />
        ))}
        <Hero x={1000} y={HILL_TOP + 2} frame={f} scale={1.15} pose="stand" headband emotion="neutral" emotionTo="smile" emotionT={ramp(f, 170, 176)} wind={2.2} />
      </Layer>
      <Layer depth={1.35}>
        {Array.from({length: 12}).map((_, i) => {
          const x = ((i * 173 + f * (3 + (i % 3))) % 2200) - 140;
          const y = 300 + ((i * 97) % 500);
          return <path key={i} d={`M ${x} ${y} q 40 -6 80 0`} stroke="#fff" strokeWidth={2} opacity={0.18} fill="none" strokeLinecap="round" />;
        })}
      </Layer>
    </SceneFrame>
  );
};
