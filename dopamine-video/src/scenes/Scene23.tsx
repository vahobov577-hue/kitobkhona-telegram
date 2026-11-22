import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FLOOR_Y, FONT_BOLD} from '../theme';
import {EASE, keys, ramp} from '../lib';
import {Hero, heroJoint} from '../components/Hero';
import {Chain, PhoneMonster} from '../components/Monster';
import {Glow, HandPhone} from '../components/Things';
import {Layer, SceneFrame, ShadowText, Sfx} from '../components/Stage';
import {Glitch} from '../effects/Glitch';
import {cameraShake, hitEnvelope} from '../effects/CameraShake';
import {Bedroom, NS_TOP, NS_X} from './Room';

const GRAB = 70;
const ROLL = 150;

// 5190–5430: HOOK 3:09 — DAY 15, night. The drawer opens, he scrolls, a chain snaps onto his wrist,
// the monster laughs "told you." and the counter glitches back to DAY 1.
export const Scene23: React.FC = () => {
  const f = useCurrentFrame();
  const hp = {x: 980, y: FLOOR_Y, frame: f, pose: 'sit' as const, scale: 1.3, rig: {armF: [36, 112] as [number, number], head: 18}};
  const hand = heroJoint(hp, 'haF');
  const sh = cameraShake(f, hitEnvelope(f, GRAB, 12, 14) + hitEnvelope(f, ROLL, 10, 12), 'c23');
  const glitchAmt = Math.max(f < 8 ? 0.8 : 0, f >= ROLL && f < ROLL + 16 ? 0.8 : 0);
  const rolled = f >= ROLL + 4;
  return (
    <SceneFrame
      dur={240}
      fadeIn={0}
      cam={(t) => ({zoom: keys(t, [0, GRAB, GRAB + 6, 240], [1.15, 1.25, 1.45, 1.3], EASE), x: sh.x, y: sh.y, rot: sh.rot, fx: hand[0], fy: hand[1] - 60})}
      overlay={
        <>
          <Glitch amount={f >= ROLL - 2 && f < ROLL + 18 ? 1 : 0} seed="cnt">
            <div style={{position: 'absolute', left: 64, top: 48, fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: rolled ? C.red : '#fff', opacity: 0.85}}>{rolled ? 'DAY 1' : 'DAY 15'}</div>
          </Glitch>
          <ShadowText text="told you." from={96} to={230} y={170} size={120} />
          {f >= GRAB && f < GRAB + 3 ? <AbsoluteFill style={{background: C.red, opacity: 0.3}} /> : null}
        </>
      }
    >
      <Glitch amount={glitchAmt} seed="g23">
        <Bedroom phone={false} clockMin={f * 2} clockHour={90} />
        <Layer depth={1}>
          <rect x={NS_X - 40} y={NS_TOP + 30} width={80} height={6} fill={C.red} opacity={0.6} style={{filter: 'blur(3px)'}} />
          <Glow cx={hand[0]} cy={hand[1] - 40} r={220} color={C.screen} opacity={0.5} />
          {f > 80 ? <PhoneMonster x={hand[0] + 170} y={hand[1] - 30} scale={keys(f, [80, 110], [0.4, 1.6], EASE)} laugh={1} glow={1} smirk={1} /> : null}
          <Hero {...hp} emotion={f < GRAB ? 'empty' : 'shocked'} saturation={0.8} handItem={<HandPhone rot={160} screen="feed" scroll={f * 3} />} />
          {f >= GRAB - 4 ? <Chain from={[hand[0] + 160, hand[1] - 60]} to={[hand[0], hand[1]]} sag={10} width={5} link={18} grow={ramp(f, GRAB - 4, GRAB)} seed="g23c" /> : null}
          {f >= GRAB ? <circle cx={hand[0]} cy={hand[1]} r={12} fill="none" stroke={C.red} strokeWidth={6} /> : null}
        </Layer>
      </Glitch>
      <Sfx name="drawer" at={0} volume={0.7} />
      <Sfx name="chainclick" at={GRAB} volume={1} />
      <Sfx name="monsterlaugh" at={90} volume={0.9} />
      <Sfx name="glitch" at={ROLL} volume={0.9} />
    </SceneFrame>
  );
};
