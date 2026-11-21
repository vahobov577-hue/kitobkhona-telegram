import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FLOOR_Y, FONT_BOLD} from '../theme';
import {EASE, keys, noise, ramp, rnd} from '../lib';
import {Hero} from '../components/Hero';
import {Layer, SceneFrame, Sfx} from '../components/Stage';

const HIT = 60;

// 2190–2310: he ties the red headband. "DAY 1." lands on the first downbeat of part 2.
export const Scene10: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - HIT, fps, config: {damping: 11, stiffness: 160, mass: 0.7}});
  const sc = f < HIT ? 0 : 1.3 - 0.3 * s;
  const shakeA = f >= HIT ? ramp(f, HIT, HIT + 14, 12, 0) : 0;
  const sx = noise('s10x', f * 1.7) * shakeA;
  const sy = noise('s10y', f * 1.7) * shakeA;
  const lines = Array.from({length: 22}).map((_, i) => {
    const a = (i / 22) * Math.PI * 2 + rnd('l10' + i) * 0.2;
    const p = ramp(f, HIT, HIT + 12, 0, 1);
    const r0 = 230 + p * 160;
    const r1 = r0 + 60 * (1 - p) + 10;
    return {a, r0, r1, op: f >= HIT ? 1 - p : 0};
  });
  return (
    <SceneFrame
      dur={120}
      cam={(t) => ({
        zoom: t < HIT ? keys(t, [0, HIT], [1.12, 1.22]) : keys(t, [HIT, HIT + 10, 120], [1.08, 1.1, 1.14]),
        x: sx,
        y: sy,
        fx: 960,
        fy: 560,
      })}
      overlay={
        <AbsoluteFill>
          <svg width={1920} height={1080} style={{position: 'absolute'}}>
            {lines.map((l, i) => (
              <line key={i} x1={960 + Math.cos(l.a) * l.r0} y1={250 + Math.sin(l.a) * l.r0 * 0.6} x2={960 + Math.cos(l.a) * l.r1} y2={250 + Math.sin(l.a) * l.r1 * 0.6} stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={l.op} />
            ))}
          </svg>
          <div
            style={{
              position: 'absolute',
              top: 250 - 120,
              width: 1920,
              textAlign: 'center',
              fontFamily: FONT_BOLD,
              fontWeight: 700,
              fontSize: 200,
              color: '#fff',
              transform: `scale(${sc})`,
              opacity: f >= HIT ? 1 : 0,
              letterSpacing: 6,
              textShadow: '0 6px 30px rgba(0,0,0,0.6)',
            }}
          >
            DAY 1.
          </div>
        </AbsoluteFill>
      }
    >
      <Layer depth={1}>
        <ellipse cx={960} cy={FLOOR_Y + 2} rx={140} ry={14} fill="#000" opacity={0.35} />
        <Hero
          x={960}
          y={FLOOR_Y}
          frame={f}
          pose="tie"
          poseTo="stand"
          poseT={ramp(f, 52, 72, 0, 1, EASE)}
          headband
          headbandT={ramp(f, 8, 50, 0, 1, EASE)}
          emotion="neutral"
          emotionTo="determined"
          emotionT={ramp(f, 36, 40)}
          wind={1.2}
        />
        {f >= HIT
          ? Array.from({length: 16}).map((_, i) => {
              const p = ramp(f, HIT, HIT + 30, 0, 1);
              const dir = i < 8 ? -1 : 1;
              const vx = dir * (40 + rnd('d10' + i) * 160) * p;
              const vy = -(20 + rnd('e10' + i) * 50) * Math.sin(p * Math.PI * 0.8);
              return <circle key={i} cx={960 + dir * 50 + vx} cy={FLOOR_Y - 4 + vy} r={3 + rnd('r10' + i) * 4} fill={C.floor} opacity={1 - p} />;
            })
          : null}
      </Layer>
      <Sfx name="tie" at={10} volume={0.6} />
      <Sfx name="impact" at={HIT} volume={1} />
    </SceneFrame>
  );
};
