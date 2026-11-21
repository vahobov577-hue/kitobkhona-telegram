import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FLOOR_Y, FONT_BOLD} from '../theme';
import {EASE_OUT, keys, ramp, rnd} from '../lib';
import {Hero, heroJoint} from '../components/Hero';
import {Shadow} from '../components/Shadow';
import {Frame, Phone, Sofa, Window} from '../components/Props';
import {DayCounter, Layer, SceneFrame, ShadowText, Sfx} from '../components/Stage';

const HX = 840;
const Heart: React.FC<{c: string}> = ({c}) => <path d="M 0 6 C -14 -4 -10 -16 0 -9 C 10 -16 14 -4 0 6 Z" fill={c} stroke={C.ink} strokeWidth={1.5} />;
const LABELS = ['+1.2K', '98K', '♥ 4.5K', '+312', '1.1M', '+87', '24K'];

// 690–930: DAY 30 — sofa, phone glow, other people's hearts and numbers; Shadow on the armrest.
export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const heroP = {x: HX, y: FLOOR_Y - 8, frame: f, pose: 'sit' as const, rig: {armF: [28, 122] as [number, number], armB: [24, 112] as [number, number], head: 16}};
  const hand = heroJoint(heroP, 'haF');
  const items: React.ReactNode[] = [];
  for (let k = 0; k < 30; k++) {
    const st = k * 7;
    const age = f - st;
    if (age < 0 || age > 50) continue;
    const t = age / 50;
    const isTxt = rnd('k' + k) < 0.45;
    const sx = hand[0] + 8 + (rnd('sx' + k) - 0.3) * 120 * t;
    const sy = hand[1] - 40 - t * 190;
    const op = Math.min(1, age / 6) * (1 - t);
    const sc = ramp(age, 0, 10, 0.4, 1, EASE_OUT);
    items.push(
      <g key={k} transform={`translate(${sx} ${sy}) scale(${sc * 1.5})`} opacity={op}>
        {isTxt ? (
          <text fontFamily={FONT_BOLD} fontWeight={700} fontSize={30} fill="#fff" textAnchor="middle">
            {LABELS[k % LABELS.length]}
          </text>
        ) : (
          <Heart c={rnd('c' + k) < 0.6 ? C.red : '#fff'} />
        )}
      </g>,
    );
  }
  return (
    <SceneFrame
      dur={240}
      cam={(t) => ({x: keys(t, [0, 240], [70, -70]), zoom: keys(t, [0, 240], [1.12, 1.18]), fy: 560})}
      overlay={
        <>
          <DayCounter label="DAY 30" />
          <ShadowText text="they're better than you." from={95} to={205} y={210} size={88} />
        </>
      }
    >
      <Layer depth={0.7}>
        <Window x={360} y={330} scale={0.9} sky="night" />
        <Frame x={1290} y={380} scale={1.2} />
      </Layer>
      <Layer depth={1}>
        <Sofa x={960} y={FLOOR_Y} />
        <Shadow x={1185} y={FLOOR_Y - 60} frame={f} scale={0.92} pose="sit" facing={-1} rig={{body: 20, head: 18, armF: [60, 40]}} opacity={ramp(f, 20, 60)} smile={ramp(f, 80, 110)} />
        <Hero {...heroP} emotion="sad" handItem={<Phone glow={0.9 + 0.1 * Math.sin(f * 0.9)} rot={-20} />} />
        {items}
      </Layer>
      <Sfx name="whisper" at={88} volume={0.85} />
      <Sfx name="blips" at={6} volume={0.25} />
    </SceneFrame>
  );
};
