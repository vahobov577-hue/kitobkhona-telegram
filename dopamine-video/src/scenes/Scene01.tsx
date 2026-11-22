import React from 'react';
import {useCurrentFrame} from 'remotion';
import {keys} from '../lib';
import {SceneFrame, ShadowText, Sfx} from '../components/Stage';
import {cameraShake} from '../effects/CameraShake';
import {Showdown} from './Showdown';

/** camera used by scene 1 and (identically) scene 27 */
export const showdownCam = (t: number, amp = 12) => {
  const s = cameraShake(t, amp, 'sd');
  return {x: s.x + keys(t, [0, 120], [-20, 10]), y: s.y - 20, rot: s.rot, zoom: keys(t, [0, 120], [1.0, 1.05]), fx: 900, fy: 620};
};
export const showdownHeroX = (t: number) => keys(t, [0, 120], [700, 742]);

// 0–120: cold open at the climax.
export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame dur={120} fadeIn={0} fadeOut={0} floor={false} breathe={false} cam={(t) => showdownCam(t)}
      overlay={<ShadowText text="you can't live without me." from={14} to={118} y={150} size={100} fadeOut={4} />}
    >
      <Showdown frame={f} heroX={showdownHeroX(f)} roar={0.85 + 0.15 * Math.sin(f * 0.3)} sag={keys(f, [0, 120], [40, 18])} />
      <Sfx name="roar" at={0} volume={0.9} />
      <Sfx name="chainrattle" at={30} volume={0.6} />
    </SceneFrame>
  );
};
