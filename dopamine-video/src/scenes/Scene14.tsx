import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FLOOR_Y} from '../theme';
import {EASE_IN, noise, ramp, rnd} from '../lib';
import {Hero, heroJoint} from '../components/Hero';
import {Glow, HandPhone, Poster} from '../components/Things';
import {Chair} from '../components/Props';
import {Layer, SceneFrame, Sfx} from '../components/Stage';

const POSTERS = [
  {label: 'GYM', x: 520, y: 330, at: 36},
  {label: 'MY BUSINESS', x: 900, y: 300, at: 96},
  {label: 'DRAW', x: 1280, y: 340, at: 156},
];

// 2730–2970: the dream posters tear off one by one and spiral into the phone like into a vacuum.
export const Scene14: React.FC = () => {
  const f = useCurrentFrame();
  const hp = {x: 1500, y: FLOOR_Y, frame: f, pose: 'sit' as const, scale: 1.3, facing: -1 as const, rig: {armF: [36, 112] as [number, number], head: 18}};
  const hand = heroJoint(hp, 'haF');
  const phone: [number, number] = [hand[0], hand[1] - 16];
  return (
    <SceneFrame dur={240} wipeOut={10} cam={(t) => ({zoom: 1.08, x: noise('c14', t * 0.02) * 30, rot: noise('r14', t * 0.02) * 1.5, fx: 960, fy: 480})}>
      <Layer depth={0.9}>
        {POSTERS.map((p, i) => {
          const t = f - p.at;
          if (t < 0) {
            const wob = t > -14 ? Math.sin(f * 1.8) * 3 * (1 + t / 14) : 0;
            return <Poster key={i} x={p.x} y={p.y} label={p.label} rot={(i - 1) * 4 + wob} seed={'po' + i} />;
          }
          if (t > 60) return <rect key={i} x={p.x - 95} y={p.y - 125} width={190} height={250} fill="#151515" opacity={0.6} />;
          const u = ramp(t, 0, 60, 0, 1, EASE_IN);
          const spin = u * 720 + i * 30;
          const r = (1 - u) * 260;
          const x = p.x + (phone[0] - p.x) * u + Math.cos(u * 9) * r * 0.35;
          const y = p.y + (phone[1] - p.y) * u + Math.sin(u * 9) * r * 0.35;
          return (
            <g key={i}>
              <rect x={p.x - 95} y={p.y - 125} width={190} height={250} fill="#151515" opacity={0.6} />
              <Poster x={x} y={y} label={p.label} rot={spin} scale={1 - u * 0.95} seed={'po' + i} />
            </g>
          );
        })}
      </Layer>
      <Layer depth={1}>
        {Array.from({length: 26}).map((_, i) => {
          const u = (f * 0.025 + rnd('v' + i)) % 1;
          const a = rnd('va' + i) * Math.PI - Math.PI * 0.9;
          const r0 = 900 * (1 - u);
          const x = phone[0] + Math.cos(a) * r0;
          const y = phone[1] + Math.sin(a) * r0 * 0.6;
          return <line key={i} x1={x} y1={y} x2={x + (phone[0] - x) * 0.12} y2={y + (phone[1] - y) * 0.12} stroke="#fff" strokeWidth={2} opacity={0.15 * u} />;
        })}
        <Chair x={hp.x + 10} y={FLOOR_Y} flip />
        <Glow cx={phone[0]} cy={phone[1]} r={220} color={C.screen} opacity={0.5} />
        <Hero {...hp} emotion="empty" handItem={<HandPhone rot={160} screen="feed" scroll={f * 3} glow={1} />} />
      </Layer>
      {POSTERS.map((p) => (
        <Sfx key={p.label} name="suck" at={p.at} volume={0.8} />
      ))}
      <Sfx name="wind" at={0} volume={0.4} dur={240} />
    </SceneFrame>
  );
};
