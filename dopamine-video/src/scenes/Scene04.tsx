import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_BOLD} from '../theme';
import {EASE_OUT, ramp} from '../lib';
import {SceneFrame, Sfx} from '../components/Stage';
import {Glitch} from '../effects/Glitch';

// 390–450: title flash with glitch.
export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const g = f < 8 ? 1 : f > 50 ? 0.9 : (f % 17 < 2 ? 0.7 : 0.08);
  const sc = ramp(f, 0, 12, 1.25, 1, EASE_OUT) * (1 + f * 0.0015);
  return (
    <SceneFrame dur={60} fadeIn={0} fadeOut={0} floor={false}>
      <Glitch amount={g} seed="title">
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <div style={{fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 230, color: '#fff', letterSpacing: 14, transform: `scale(${sc})`}}>DOPAMINE</div>
          <div style={{position: 'absolute', top: 680, width: 300, height: 8, background: C.gold, borderRadius: 4, opacity: ramp(f, 10, 20), boxShadow: `0 0 20px ${C.gold}`}} />
        </AbsoluteFill>
      </Glitch>
      <Sfx name="glitch" at={0} volume={0.9} />
      <Sfx name="boom" at={0} volume={0.7} />
    </SceneFrame>
  );
};
