import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FLOOR_Y} from '../theme';
import {EASE, EASE_OUT, keys, noise, ramp} from '../lib';
import {Hero} from '../components/Hero';
import {Shadow} from '../components/Shadow';
import {Mirror} from '../components/Props';
import {DayCounter, Layer, SceneFrame, ShadowText, Sfx} from '../components/Stage';

// 1350–1710: DAY 365 — the mirror: his reflection turns into the Shadow, glass cracks red.
export const Scene07: React.FC = () => {
  const f = useCurrentFrame();
  const grow = ramp(f, 60, 205, 0, 1, EASE);
  const crack = ramp(f, 150, 196, 0, 1, EASE_OUT);
  const shakeA = ramp(f, 150, 154, 0, 9) * ramp(f, 154, 195, 1, 0);
  const sx = noise('s7x', f * 1.3) * shakeA;
  const sy = noise('s7y', f * 1.3) * shakeA;
  const cower = ramp(f, 182, 220, 0, 1, EASE);
  const hx = keys(f, [180, 240], [790, 730], EASE);
  return (
    <SceneFrame
      dur={360}
      cam={(t) => ({
        zoom: keys(t, [0, 200, 360], [1.0, 1.22, 1.3]),
        rot: keys(t, [0, 360], [0, -3]),
        x: sx + keys(t, [0, 360], [0, 20]),
        y: sy,
        fx: 1080,
        fy: 500,
      })}
      overlay={
        <>
          <DayCounter label="DAY 365" />
          <ShadowText text="you'll fail." from={170} to={340} y={180} size={150} />
          <ShadowText text="everyone will see." from={212} to={340} y={300} size={46} seed="ev" />
        </>
      }
    >
      <Layer depth={1}>
        <defs>
          <radialGradient id="redglow7">
            <stop offset="0%" stopColor={C.red} stopOpacity={0.35} />
            <stop offset="100%" stopColor={C.red} stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={1180} cy={480} rx={420} ry={360} fill="url(#redglow7)" opacity={grow} />
        <Mirror x={1180} y={FLOOR_Y} crack={crack}>
          <g opacity={1 - ramp(f, 70, 150)}>
            <Hero x={-6} y={118} frame={f} pose="stand" facing={-1} scale={0.55} emotion="scared" seed="refl" />
            <rect x={-100} y={-140} width={200} height={280} fill="#1a1d24" opacity={0.35} />
          </g>
          <Shadow x={-4} y={135} frame={f} facing={-1} base={0.55} scale={0.6 + 1.0 * grow} opacity={ramp(f, 60, 110)} smile={ramp(f, 120, 170)} />
        </Mirror>
        <Hero
          x={hx}
          y={FLOOR_Y}
          frame={f}
          pose="stand"
          poseTo="cower"
          poseT={cower}
          emotion="scared"
          shrink={cower}
          tremble={ramp(f, 150, 200, 0, 3)}
          look={4}
        />
      </Layer>
      <Sfx name="heartbeat" at={0} volume={0.7} />
      <Sfx name="glass" at={150} volume={0.8} />
      <Sfx name="whisper" at={166} volume={1} />
    </SceneFrame>
  );
};
