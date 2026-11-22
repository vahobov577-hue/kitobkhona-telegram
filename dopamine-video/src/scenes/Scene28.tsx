import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, SYNC} from '../theme';
import {EASE, EASE_IN, keys, ramp} from '../lib';
import {heroJoint} from '../components/Hero';
import {Layer, SceneFrame, Sfx} from '../components/Stage';
import {cameraShake, hitEnvelope} from '../effects/CameraShake';
import {slowTime} from '../effects/SlowMo';
import {Burst} from '../effects/Particles';
import {MONSTER, Showdown, stairY} from './Showdown';

const SNAP = SYNC.snap - 6660; // 114, on the downbeat
const HX = 700;

// 6660–6960: he pulls — the chains SNAP (on the beat), 50% slow motion, the monster shrinks
// to an ordinary phone and drops into his hand. White flash.
export const Scene28: React.FC = () => {
  const f = useCurrentFrame();
  const t = slowTime(f, SNAP, 0.5, SNAP + 110); // slow-mo for ~3.7 s
  const snap = ramp(t, SNAP, SNAP + 22, 0, 1, EASE);
  const shrink = ramp(t, SNAP + 8, SNAP + 50, 0, 1, EASE_IN);
  const fall = ramp(t, SNAP + 46, SNAP + 72, 0, 1, EASE_IN);
  const hp = {x: HX, y: stairY(HX), frame: f, pose: 'stand' as const, scale: 1.3};
  const hand = heroJoint(hp, 'haF');
  const mScale = keys(shrink, [0, 1], [6, 0.32]);
  const mx = keys(fall, [0, 1], [MONSTER.x, hand[0] + 6]);
  const my = keys(fall, [0, 1], [MONSTER.y, hand[1] + 14]) - Math.sin(fall * Math.PI) * 160;
  const sh = cameraShake(f, f < SNAP ? keys(f, [0, SNAP], [8, 20]) : hitEnvelope(f, SNAP, 24, 30), 'c28');
  const flash = f >= SNAP && f < SNAP + 5 ? 1 - (f - SNAP) / 5 : 0;
  const pulling = f < SNAP;
  return (
    <SceneFrame
      dur={300}
      fadeIn={0}
      fadeOut={26}
      fadeOutColor="#fff"
      floor={false}
      breathe={false}
      cam={(tt) => ({zoom: tt < SNAP ? keys(tt, [0, SNAP], [1.25, 1.7], EASE) : keys(tt, [SNAP, SNAP + 120, 300], [1.7, 1.1, 1.0], EASE), fx: tt < SNAP ? 1000 : 960, fy: tt < SNAP ? 520 : 560, x: sh.x, y: sh.y, rot: sh.rot})}
      overlay={
        <>
          {flash > 0 ? <AbsoluteFill style={{background: '#fff', opacity: flash}} /> : null}
          {f >= SNAP && f < SNAP + 110 ? <AbsoluteFill style={{boxShadow: 'inset 0 0 200px rgba(255,255,255,0.12)'}} /> : null}
        </>
      }
    >
      <Showdown
        frame={Math.round(t)}
        heroX={HX}
        heroPose={pulling ? 'pull' : 'stand'}
        emotion="determined"
        headband
        monsterScale={mScale}
        monsterY={my}
        monsterX={mx}
        monsterGlow={1 - shrink * 0.8}
        monsterEyes={1 - fall * 0.7}
        roar={pulling ? 1 : 1 - shrink}
        sag={pulling ? keys(f, [0, SNAP], [6, -6]) : 0}
        snap={snap}
        tremble={pulling ? 3 : 0}
        chainCount={snap >= 1 ? 0 : 3}
      />
      <Layer depth={1}>
        {f >= SNAP ? (
          <>
            <Burst x={1030} y={470} t={t - SNAP} n={50} shape="link" color={C.red} speed={14} life={60} gravity={0.4} seed="links" size={7} />
            <Burst x={1030} y={470} t={t - SNAP} n={60} shape="spark" color={C.gold} speed={20} life={40} gravity={0.3} seed="sp28" size={6} />
          </>
        ) : null}
      </Layer>
      <Sfx name="strain" at={0} volume={0.8} />
      <Sfx name="chainsnap" at={SNAP} volume={1} />
      <Sfx name="screech" at={SNAP + 20} volume={0.8} />
      <Sfx name="flash" at={270} volume={0.7} />
    </SceneFrame>
  );
};
