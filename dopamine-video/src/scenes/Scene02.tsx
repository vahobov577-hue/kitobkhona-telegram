import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT_HAND} from '../theme';
import {EASE_OUT, keys, ramp} from '../lib';
import {SceneFrame, Sfx} from '../components/Stage';
import {cameraShake} from '../effects/CameraShake';
import {FreezeFrame} from '../effects/FreezeFrame';
import {Burst} from '../effects/Particles';
import {Showdown} from './Showdown';
import {Layer} from '../components/Stage';

export const FREEZE_AT = 30;
const FACTS = ['9 hours a day.', 'every day.', 'for 2 years.'];

/** the frozen showdown, reused by scene 3 at the start of the rewind */
export const ShowdownAt2: React.FC = () => {
  const f = useCurrentFrame();
  return (
  <>
    <Showdown frame={120 + f} heroX={742 + f * 0.6} roar={1} sag={keys(f, [0, FREEZE_AT], [18, 2])} tremble={4} />
    <Layer depth={1}>
      <Burst x={1060} y={520} t={f - 16} n={18} shape="spark" color="#ff8a7a" speed={9} life={16} gravity={0.2} seed="pre" />
    </Layer>
  </>
  );
};

// 120–240: the chain is about to snap — FREEZE, colour drains, three facts.
export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame
      dur={120}
      fadeIn={0}
      fadeOut={0}
      floor={false}
      breathe={false}
      cam={(t) => {
        const s = cameraShake(t, t < FREEZE_AT ? 14 : 0, 'sd2');
        const z = keys(t, [0, FREEZE_AT, 120], [1.1, 1.35, 1.5], EASE_OUT);
        return {x: s.x, y: s.y, rot: s.rot, zoom: z, fx: 1020, fy: 520};
      }}
      overlay={
        <AbsoluteFill>
          {FACTS.map((t, i) => {
            const a = FREEZE_AT + 8 + i * 28;
            const op = f >= a && f < a + 30 ? Math.min(ramp(f, a, a + 6), i === 2 ? 1 : ramp(f, a + 24, a + 30, 1, 0)) : 0;
            return (
              <div key={t} style={{position: 'absolute', top: 470, width: 1920, textAlign: 'center', fontFamily: FONT_HAND, fontSize: 110, color: '#fff', opacity: op, transform: `scale(${ramp(f, a, a + 8, 1.15, 1, EASE_OUT)})`, textShadow: '0 4px 30px rgba(0,0,0,0.9)'}}>
                {t}
              </div>
            );
          })}
        </AbsoluteFill>
      }
    >
      <FreezeFrame at={FREEZE_AT} drain={8}>
        <ShowdownAt2 />
      </FreezeFrame>
      <Sfx name="strain" at={0} volume={0.7} />
      <Sfx name="scratch" at={FREEZE_AT} volume={1} />
      <Sfx name="tick" at={FREEZE_AT + 8} volume={0.5} />
      <Sfx name="tick" at={FREEZE_AT + 36} volume={0.5} />
      <Sfx name="tick" at={FREEZE_AT + 64} volume={0.6} />
    </SceneFrame>
  );
};
