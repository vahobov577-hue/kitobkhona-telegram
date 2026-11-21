import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {clamp, EASE, EASE_IN, keys, noise, ramp, rnd} from '../lib';
import {Hero} from '../components/Hero';
import {Shadow} from '../components/Shadow';
import {Staircase} from '../components/Props';
import {DayCounter, Layer, lookAt, SceneFrame, ShadowText, Sfx} from '../components/Stage';

const X0 = 330;
const Y0 = FLOOR_Y;
const X1 = 1180;
const Y1 = 96;
const STEPS = 12;
const SW = (X1 - X0) / STEPS;
const SH = (Y0 - Y1) / STEPS;
const HS = 0.8; // hero scale in this shot
const SHX = 1590; // giant shadow position
export const FLASH = 228; // = global 3618, a downbeat in the music

const stairY = (x: number) => {
  if (x < X0) return Y0;
  if (x >= X1) return Y1;
  const k = (x - X0) / SW + 1;
  const i = Math.floor(k);
  const fr = k - i;
  const sm = (t: number) => t * t * (3 - 2 * t);
  const level = i - 1 + sm(clamp(fr / 0.4));
  return Y0 - level * SH;
};

// 3390–3750: DAY 300 — the staircase, the giant Shadow "you can't.", he walks straight into it. Flash.
export const Scene15: React.FC = () => {
  const f = useCurrentFrame();
  const hx = keys(f, [0, 165, FLASH, 300], [210, X1 + 10, SHX - 40, SHX + 40], (t) => t);
  const hy = stairY(hx);
  const climbing = f < 165;
  const shake = ramp(f, 182, FLASH, 0, 16, EASE_IN) * (f < FLASH + 8 ? 1 : ramp(f, FLASH + 8, FLASH + 30, 1, 0));
  const sx = noise('s15x', f * 1.4) * shake;
  const sy = noise('s15y', f * 1.4) * shake;
  const dissolve = ramp(f, FLASH - 4, FLASH + 95, 0, 1);
  const white = f < FLASH ? 0 : keys(f, [FLASH, FLASH + 5, FLASH + 46], [1, 1, 0], EASE);
  const raysP = ramp(f, FLASH, FLASH + 60, 0, 1);
  const follow = (t: number) => {
    const x = keys(t, [0, 165], [210, X1 + 10]);
    return [x + 200, stairY(x) - 130] as const;
  };
  return (
    <SceneFrame
      dur={360}
      breathe={false}
      fadeOut={30}
      fadeOutColor="#fff"
      cam={(t) => {
        const [fx0, fy0] = follow(Math.min(t, 150));
        const mix = ramp(t, 140, 200, 0, 1, EASE);
        const qx = fx0 + (1380 - fx0) * mix;
        const qy = fy0 + (-250 - fy0) * mix;
        const z = keys(t, [0, 140, 200, 360], [1.0, 1.04, 0.8, 0.86], EASE);
        return lookAt(qx, qy, z, 0, sx, sy);
      }}
      overlay={
        <>
          <DayCounter label="DAY 300" />
          <ShadowText text="you can't." from={170} to={FLASH - 2} x={620} y={260} size={124} />
          {white > 0 ? (
            <AbsoluteFill style={{backgroundColor: '#fff', opacity: white}}>
              <svg width={1920} height={1080}>
                {Array.from({length: 40}).map((_, i) => {
                  const a = (i / 40) * Math.PI * 2 + raysP * 0.4;
                  const r0 = 60 + raysP * 500;
                  const r1 = r0 + 300 + rnd('ray' + i) * 500;
                  return <line key={i} x1={1000 + Math.cos(a) * r0} y1={680 + Math.sin(a) * r0} x2={1000 + Math.cos(a) * r1} y2={680 + Math.sin(a) * r1} stroke="#e6e0d2" strokeWidth={10 + rnd('rw' + i) * 14} strokeLinecap="round" opacity={(1 - raysP) * 0.9} />;
                })}
              </svg>
            </AbsoluteFill>
          ) : null}
        </>
      }
    >
      <Layer depth={1}>
        <Shadow
          x={SHX}
          y={Y1}
          frame={f}
          facing={-1}
          base={HS}
          scale={4}
          pose="stand"
          poseTo="armsOut"
          poseT={ramp(f, 150, 190, 0, 1, EASE)}
          smile={keys(f, [150, 190, 205, FLASH], [0.6, 1, 1, 0])}
          eyes={keys(f, [190, FLASH], [1, 1.8])}
          dissolve={dissolve}
          glow={1.2}
        />
        <Staircase x0={X0} y0={Y0} x1={X1} y1={Y1} steps={STEPS} />
        <Hero
          x={hx}
          y={hy}
          frame={f}
          scale={HS}
          pose={climbing ? 'climb' : f < 300 ? 'walk' : 'stand'}
          speed={climbing ? 0.9 : 0.7}
          headband
          emotion="determined"
          emotionTo="neutral"
          emotionT={ramp(f, 200, 206)}
          wind={1.4}
        />
      </Layer>
      <Sfx name="whisper" at={164} volume={1} />
      <Sfx name="whoosh" at={FLASH - 40} volume={0.9} />
      <Sfx name="flash" at={FLASH} volume={1} />
    </SceneFrame>
  );
};
