import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_BOLD} from '../theme';
import {EASE, EASE_OUT, keys, ramp} from '../lib';
import {Hero, heroJoint} from '../components/Hero';
import {DopamineSpark} from '../components/Monster';
import {Glow, HandPhone, Notif, TopBed} from '../components/Things';
import {DayCounter, Layer, SceneFrame, Sfx} from '../components/Stage';

const HX = 930;
const HY = 625; // feet (top view: hero lies on his back, head up)
const NS: [number, number] = [1330, 300];

// 450–690: DAY 1 — top view. Bored. Phone buzzes, he takes it, blue light, first spark.
export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const reach = keys(f, [70, 100, 125], [0, 1, 0.55], EASE);
  const holding = f >= 100;
  const armF: [number, number] = holding ? [keys(f, [100, 125], [128, 140], EASE), keys(f, [100, 125], [0, 40], EASE)] : [8 + 120 * reach, 0];
  const hp = {x: HX, y: HY, frame: f, pose: 'stand' as const, scale: 1.55, rig: {armF, legF: [4, 0] as [number, number], legB: [-4, 0] as [number, number]}};
  const head = heroJoint(hp, 'head');
  const hand = heroJoint(hp, 'haF');
  const glow = holding ? ramp(f, 105, 125) : 0;
  const sparkT = ramp(f, 160, 190);
  return (
    <SceneFrame
      dur={240}
      floor={false}
      cam={(t) => ({zoom: keys(t, [0, 120, 240], [1.25, 1.4, 1.6], EASE), rot: keys(t, [0, 240], [-3, 4]), fx: 1000, fy: keys(t, [0, 240], [360, 300])})}
      overlay={
        <>
          <DayCounter label="DAY 1" />
          {f >= 42 && f < 100 ? (
            <div style={{position: 'absolute', left: 1180, top: 150, padding: '12px 22px', background: '#f1ebdd', borderRadius: 16, border: '3px solid #151515', fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 30, color: C.ink, transform: `scale(${ramp(f, 42, 50, 0.6, 1, EASE_OUT)})`, opacity: ramp(f, 90, 100, 1, 0)}}>
              <span style={{color: C.red}}>●</span> 1 new notification
            </div>
          ) : null}
          {sparkT >= 1 && f < 200 ? <AbsoluteFill style={{background: `radial-gradient(circle at ${head[0] / 19.2}% ${head[1] / 10.8}%, rgba(255,201,77,0.35), transparent 30%)`, opacity: ramp(f, 190, 200, 1, 0)}} /> : null}
        </>
      }
    >
      <Layer depth={0.85}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#16161a" />
        <path d="M -500 120 L 2500 120 M -500 980 L 2500 980" stroke="#1d1d22" strokeWidth={4} />
      </Layer>
      <Layer depth={1}>
        <TopBed x={930} y={540} />
        <rect x={NS[0] - 80} y={NS[1] - 80} width={160} height={160} rx={8} fill={C.furn} stroke={C.ink} strokeWidth={3} />
        {!holding ? (
          <g transform={`translate(${NS[0] + (reach > 0.8 ? 0 : 0)} ${NS[1]})`}>
            <HandPhone rot={10} scale={2} screen={f > 40 ? 'notif' : 'off'} buzz={f > 40 && f < 70 ? 1 : 0} />
          </g>
        ) : null}
        <Hero {...hp} emotion={f < 110 ? 'bored' : f < 150 ? 'empty' : 'smile'} handItem={holding ? <HandPhone rot={180} scale={1.1} screen="feed" scroll={f * 1.5} glow={glow} /> : undefined} />
        <path d={`M 715 505 Q 930 465 1145 505 L 1145 945 L 715 945 Z`} fill="#4a4a5c" stroke={C.ink} strokeWidth={3} />
        {holding ? <Glow cx={head[0]} cy={head[1]} r={230} color={C.screen} opacity={0.45 * glow} /> : null}
        {f > 40 && !holding ? <Notif x={NS[0] + 40} y={NS[1] - 50} t={f - 42} n={1} /> : null}
        <DopamineSpark from={[hand[0], hand[1]]} to={[head[0], head[1] - 20]} t={sparkT} arc={-160} size={14} />
      </Layer>
      <Sfx name="buzz" at={40} volume={0.8} />
      <Sfx name="ding" at={188} volume={0.9} />
    </SceneFrame>
  );
};
