import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_HAND} from '../theme';
import {EASE, EASE_OUT, keys, ramp} from '../lib';
import {Layer, SceneFrame, Sfx} from '../components/Stage';

// 0–150: black, "He always had a dream." — words arrive one by one, a cream spark rises above them.
export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const words = 'He always had a dream.'.split(' ');
  const sy = keys(f, [0, 110], [820, 380], EASE);
  const sOp = ramp(f, 0, 30, 0, 1) * (0.75 + 0.25 * Math.sin(f * 0.25));
  const push = ramp(f, 0, 150, 1, 1.07, EASE);
  return (
    <SceneFrame
      dur={150}
      floor={false}
      fadeIn={0}
      fadeOut={10}
      cam={(t) => ({zoom: 1 + t * 0.0003, y: -t * 0.08})}
      overlay={
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${push})`}}>
          <div style={{fontFamily: FONT_HAND, fontSize: 92, color: '#fff', display: 'flex', gap: 26, marginTop: 40}}>
            {words.map((wd, i) => {
              const st = 22 + i * 9;
              const op = ramp(f, st, st + 14, 0, 1, EASE_OUT);
              const dy = ramp(f, st, st + 20, 22, 0, EASE_OUT);
              const bl = ramp(f, st, st + 14, 8, 0, EASE_OUT);
              return (
                <span key={i} style={{opacity: op, transform: `translateY(${dy}px)`, filter: `blur(${bl}px)`, display: 'inline-block'}}>
                  {wd}
                </span>
              );
            })}
          </div>
        </AbsoluteFill>
      }
    >
      <Layer depth={0.6}>
        <defs>
          <radialGradient id="spark">
            <stop offset="0%" stopColor={C.hero} stopOpacity={1} />
            <stop offset="35%" stopColor={C.hero} stopOpacity={0.35} />
            <stop offset="100%" stopColor={C.hero} stopOpacity={0} />
          </radialGradient>
        </defs>
        <path d={`M 960 ${sy + 8} Q ${960 + Math.sin(f * 0.08) * 10} ${sy + 80} 960 ${sy + 170}`} stroke={C.hero} strokeWidth={2} opacity={0.15 * sOp} fill="none" />
        <circle cx={960 + Math.sin(f * 0.06) * 6} cy={sy} r={46} fill="url(#spark)" opacity={sOp} />
        <circle cx={960 + Math.sin(f * 0.06) * 6} cy={sy} r={5} fill="#fff" opacity={sOp} />
      </Layer>
      <Sfx name="shimmer" at={20} volume={0.5} />
    </SceneFrame>
  );
};
