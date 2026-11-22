import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_BOLD, FONT_HAND} from '../theme';
import {EASE_OUT, jitter, keys, ramp, wobbler} from '../lib';
import {SceneFrame, Sfx} from '../components/Stage';

const BLACK_AT = 180; // last 2 s: black + notification
const END_CUT = 234;

// 7860–8100: final card, then on black: "1 new notification" — hard cut (loops to the start).
export const Scene32: React.FC = () => {
  const f = useCurrentFrame();
  const w = wobbler(f, 'ul32', 1.2);
  const ul = ramp(f, 22, 62, 0, 1, EASE_OUT);
  const push = keys(f, [0, BLACK_AT], [1, 1.05]);
  if (f >= BLACK_AT) {
    const j = jitter(f, 'n32', f < 214 ? 6 : 2, 1);
    const show = f >= BLACK_AT + 8 && f < END_CUT;
    const pop = ramp(f, BLACK_AT + 8, BLACK_AT + 14, 0.6, 1, EASE_OUT);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        {show ? (
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
            <div style={{transform: `translate(${j.x}px, ${j.y}px) scale(${pop})`, padding: '22px 44px', background: '#f1ebdd', borderRadius: 26, border: '4px solid #151515', fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 58, color: C.ink, boxShadow: '0 0 60px rgba(111,168,255,0.35)'}}>
              <span style={{color: C.red}}>●</span> 1 new notification
            </div>
          </AbsoluteFill>
        ) : null}
        <Sfx name="buzz" at={BLACK_AT + 8} volume={1} />
        <Sfx name="ding" at={BLACK_AT + 8} volume={0.8} />
      </AbsoluteFill>
    );
  }
  return (
    <SceneFrame dur={BLACK_AT} floor={false} fadeIn={8} fadeOut={0}>
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        <div style={{position: 'absolute', top: 250, width: 1920, textAlign: 'center', fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 220, color: '#fff', letterSpacing: 14, opacity: ramp(f, 2, 18), transform: `scale(${ramp(f, 2, 22, 1.08, 1, EASE_OUT)})`}}>
          DOPAMINE
        </div>
        <svg width={1920} height={1080} style={{position: 'absolute'}}>
          <path
            d={w`M 520 ${530} C 760 ${518} 1100 ${522} 1330 ${526} S 1420 ${538} 1440 ${516} M 620 ${558} C 860 ${546} 1140 ${550} 1360 ${554}`}
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
        <div style={{position: 'absolute', top: 640, width: 1920, textAlign: 'center', fontFamily: FONT_HAND, fontSize: 80, color: '#fff', opacity: ramp(f, 76, 90), transform: `translateY(${ramp(f, 76, 94, 14, 0, EASE_OUT)}px)`}}>
          Your attention is your life.
        </div>
        <div style={{position: 'absolute', top: 760, width: 1920, textAlign: 'center', fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 64, color: C.red, opacity: ramp(f, 120, 134), transform: `translateY(${ramp(f, 120, 138, 14, 0, EASE_OUT)}px)`, textShadow: '0 0 14px rgba(229,57,53,0.45)'}}>
          Spend it wisely.
        </div>
      </AbsoluteFill>
      <Sfx name="scribble" at={22} volume={0.5} />
    </SceneFrame>
  );
};
