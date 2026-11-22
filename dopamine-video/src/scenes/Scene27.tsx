import React from 'react';
import {useCurrentFrame} from 'remotion';
import {keys, ramp} from '../lib';
import {DayCounter, SceneFrame, ShadowText, Sfx} from '../components/Stage';
import {cameraShake} from '../effects/CameraShake';
import {Showdown} from './Showdown';
import {showdownCam, showdownHeroX} from './Scene01';

// 6300–6660: HOOK 3:30 — the exact opening frame again (same component, same camera, same line).
// Then something is different: his fear turns into resolve.
export const Scene27: React.FC = () => {
  const f = useCurrentFrame();
  const same = f < 120;
  const resolve = ramp(f, 170, 230);
  return (
    <SceneFrame
      dur={360}
      fadeIn={0}
      fadeOut={0}
      floor={false}
      breathe={false}
      cam={(t) => {
        if (t < 120) return showdownCam(t);
        const s = cameraShake(t, keys(t, [120, 360], [12, 18]), 'sd');
        return {x: s.x + 10, y: s.y - 20, rot: s.rot, zoom: keys(t, [120, 360], [1.05, 1.3]), fx: 900, fy: 600};
      }}
      overlay={
        <>
          <DayCounter label="DAY 120" from={-20} />
          <ShadowText text="you can't live without me." from={14} to={118} y={150} size={100} fadeOut={4} />
          <ShadowText text="you can't live without me." from={250} to={358} y={150} size={112} fadeOut={4} seed="again" />
        </>
      }
    >
      <Showdown
        frame={same ? f : f}
        heroX={same ? showdownHeroX(f) : keys(f, [120, 360], [742, 700])}
        roar={0.85 + 0.15 * Math.sin(f * 0.3)}
        sag={same ? keys(f, [0, 120], [40, 18]) : keys(f, [120, 360], [18, 6])}
        emotion={resolve > 0.5 ? 'determined' : 'scared'}
        headband={f > 200}
        tremble={same ? 2 : 2 - resolve * 1.5}
      />
      <Sfx name="roar" at={0} volume={0.9} />
      <Sfx name="chainrattle" at={30} volume={0.6} />
      <Sfx name="roar" at={240} volume={1} />
      <Sfx name="tie" at={198} volume={0.6} />
    </SceneFrame>
  );
};
