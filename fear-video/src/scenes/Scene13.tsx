import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FLOOR_Y, FONT_BOLD} from '../theme';
import {EASE, keys, ramp, rnd} from '../lib';
import {Hero} from '../components/Hero';
import {Shadow} from '../components/Shadow';
import {Microphone} from '../components/Props';
import {DayCounter, Layer, SceneFrame, Sfx} from '../components/Stage';

const MIC: [number, number] = [728, FLOOR_Y - 196 * 1.3];
const ARC_EVERY = 22;
const ARC_SPEED = 11;
const ARC_MAX = 760;
const WORD_SPEED = 7.5;
const WORDS = ['nobody cares', 'stop', 'loser', 'cringe', 'who are you?', 'quit', 'lol'];
const FS = 54;

type W = {text: string; spawn: number; y: number; hit: number; hitX: number};
const arcsAt = (f: number) => {
  const r: number[] = [];
  for (let t0 = 8; t0 <= f; t0 += ARC_EVERY) {
    const r0 = (f - t0) * ARC_SPEED;
    if (r0 < ARC_MAX) r.push(r0);
  }
  return r;
};
// pre-compute when each word meets the front of a sound arc
const PLAN: W[] = WORDS.map((text, k) => {
  const spawn = 14 + k * 36;
  const y = 390 + rnd('wy' + k) * 200;
  let hit = 9999;
  let hitX = 0;
  for (let f = spawn; f < spawn + 400; f++) {
    const x = 1600 - (f - spawn) * WORD_SPEED;
    const d = Math.hypot(x - MIC[0], y - MIC[1]);
    if (arcsAt(f).some((r) => Math.abs(r - d) < ARC_SPEED * 0.6 && r > 40)) {
      hit = f;
      hitX = x;
      break;
    }
  }
  return {text, spawn, y, hit, hitX};
});
export const SCENE13_HITS = PLAN.map((p) => p.hit);

// 2850–3150: DAY 64 — he speaks; white sound arcs shatter the shadow's words into spinning letters.
export const Scene13: React.FC = () => {
  const f = useCurrentFrame();
  const talk = Math.max(0, Math.sin(f * 0.5)) * (0.6 + 0.4 * Math.abs(Math.sin(f * 0.11)));
  return (
    <SceneFrame
      dur={300}
      cam={(t) => ({zoom: keys(t, [0, 300], [1.02, 1.14]), x: keys(t, [0, 300], [0, 50]), rot: keys(t, [0, 300], [0, 1.2]), fx: 900, fy: 520})}
      overlay={<DayCounter label="DAY 64" />}
    >
      <Layer depth={1}>
        <Shadow x={1700} y={FLOOR_Y} frame={f} facing={-1} scale={keys(f, [0, 300], [1.1, 0.55], EASE)} opacity={0.85} pose="lean" smile={keys(f, [0, 200], [1, 0.1])} eyes={keys(f, [150, 260], [1, 0.4])} />
        {arcsAt(f).map((r, i) => {
          const op = Math.max(0, 1 - r / ARC_MAX);
          const a0 = -0.75;
          const a1 = 0.75;
          const d = `M ${MIC[0] + Math.cos(a0) * r} ${MIC[1] + Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${MIC[0] + Math.cos(a1) * r} ${MIC[1] + Math.sin(a1) * r}`;
          return r > 20 ? <path key={i} d={d} stroke="#fff" strokeWidth={7 * op + 1} fill="none" opacity={op} strokeLinecap="round" /> : null;
        })}
        <Microphone x={760} y={FLOOR_Y} />
        <Hero x={620} y={FLOOR_Y} frame={f} pose="speak" headband emotion="determined" mouth={talk} rig={{armF: [70, 70]}} />
        {PLAN.map((w, k) => {
          if (f < w.spawn) return null;
          if (f < w.hit) {
            const x = 1600 - (f - w.spawn) * WORD_SPEED;
            const op = ramp(f, w.spawn, w.spawn + 8);
            return (
              <text key={k} x={x} y={w.y} opacity={op} fontFamily={FONT_BOLD} fontWeight={700} fontSize={FS} fill={C.red} style={{filter: 'drop-shadow(0 0 8px rgba(229,57,53,0.6))'}}>
                {w.text}
              </text>
            );
          }
          const age = f - w.hit;
          if (age > 45) return null;
          const p = age / 45;
          return (
            <g key={k} opacity={1 - p}>
              {w.text.split('').map((ch, i) => {
                const lx = w.hitX + i * FS * 0.52;
                const vx = 4 + rnd(w.text + i) * 9;
                const vy = -6 - rnd(w.text + 'v' + i) * 10;
                const x = lx + vx * age;
                const y = w.y + vy * age + 0.45 * age * age;
                const rot = (rnd(w.text + 'r' + i) - 0.5) * 40 * age;
                return (
                  <text key={i} x={x} y={y} transform={`rotate(${rot} ${x} ${y - FS * 0.3})`} fontFamily={FONT_BOLD} fontWeight={700} fontSize={FS} fill={C.red}>
                    {ch}
                  </text>
                );
              })}
            </g>
          );
        })}
      </Layer>
      {PLAN.filter((w) => w.hit < 300).map((w, i) => (
        <Sfx key={i} name="sparkle" at={w.hit} volume={0.6} />
      ))}
      <Sfx name="whisper" at={10} volume={0.4} />
    </SceneFrame>
  );
};
