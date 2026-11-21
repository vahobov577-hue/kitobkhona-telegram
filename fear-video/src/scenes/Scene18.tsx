import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_BOLD, FONT_HAND} from '../theme';
import {EASE_OUT, keys, ramp, wobbler} from '../lib';
import {SceneFrame, Sfx} from '../components/Stage';

// 4260–4500: final card. FEAR + hand-drawn red underline, two lines, fade to black (last 20 frames).
export const Scene18: React.FC = () => {
  const f = useCurrentFrame();
  const w = wobbler(f, 'ul', 1.2);
  const ul = ramp(f, 24, 66, 0, 1, EASE_OUT);
  const push = keys(f, [0, 240], [1, 1.05]);
  const op = ramp(f, 4, 22, 0, 1, EASE_OUT);
  const sc = ramp(f, 4, 26, 1.08, 1, EASE_OUT);
  return (
    <SceneFrame dur={240} floor={false} fadeIn={10} fadeOut={20}>
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        <div style={{position: 'absolute', top: 260, width: 1920, textAlign: 'center', fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 250, color: '#fff', letterSpacing: 18, opacity: op, transform: `scale(${sc})`}}>
          FEAR
        </div>
        <svg width={1920} height={1080} style={{position: 'absolute'}}>
          <path
            d={w`M 690 ${560} C 820 ${548} 1000 ${552} 1110 ${556} S 1220 ${566} 1240 ${548} M 760 ${586} C 900 ${574} 1060 ${578} 1180 ${582}`}
            stroke={C.red}
            strokeWidth={13}
            fill="none"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - ul}
            style={{filter: 'drop-shadow(0 0 6px rgba(229,57,53,0.5))'}}
          />
        </svg>
        <div style={{position: 'absolute', top: 650, width: 1920, textAlign: 'center', fontFamily: FONT_HAND, fontSize: 82, color: '#fff', opacity: ramp(f, 92, 106), transform: `translateY(${ramp(f, 92, 110, 14, 0, EASE_OUT)}px)`}}>
          Start scared.
        </div>
        <div style={{position: 'absolute', top: 760, width: 1920, textAlign: 'center', fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 60, color: C.red, opacity: ramp(f, 140, 154), transform: `translateY(${ramp(f, 140, 158, 14, 0, EASE_OUT)}px)`, textShadow: '0 0 14px rgba(229,57,53,0.45)'}}>
          Or never start. You decide.
        </div>
      </AbsoluteFill>
      <Sfx name="scribble" at={24} volume={0.5} />
    </SceneFrame>
  );
};
