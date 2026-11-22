import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FLOOR_Y} from '../theme';
import {EASE, EASE_IN, keys, ramp, rnd} from '../lib';
import {Hero, heroJoint} from '../components/Hero';
import {Chain} from '../components/Monster';
import {Book, Glow, HandPhone, Hourglass, Notif} from '../components/Things';
import {Chair, Desk, Window} from '../components/Props';
import {DayCounter, Layer, SceneFrame, Sfx} from '../components/Stage';

const DESK_TOP = FLOOR_Y - 129 * 1.3;
const HG: [number, number] = [1120, DESK_TOP];
const PH: [number, number] = [1300, DESK_TOP - 6];
export const DIVE = 210; // camera dives into the phone screen

// 1620–1860: DAY 30 — the book. Sand flows sideways into the phone. His head is pulled like a magnet.
export const Scene10: React.FC = () => {
  const f = useCurrentFrame();
  const pull = ramp(f, 108, 150, 0, 1, EASE);
  const closed = ramp(f, 150, 158, 0, 1, EASE_IN);
  const hp = {
    x: 820,
    y: FLOOR_Y,
    frame: f,
    pose: 'read' as const,
    scale: 1.3,
    rig: {body: 4 + 26 * pull, head: 16 - 10 * pull, armF: [40 + 50 * pull, 100 - 80 * pull] as [number, number]},
  };
  const neck = heroJoint(hp, 'neck');
  const hand = heroJoint(hp, 'haF');
  const sandFlow = ramp(f, 40, 70);
  const dive = ramp(f, DIVE, 240, 0, 1, EASE_IN);
  return (
    <SceneFrame
      dur={240}
      fadeOut={0}
      cam={(t) => (t < DIVE ? {zoom: keys(t, [0, DIVE], [1.0, 1.12]), x: keys(t, [0, DIVE], [-40, 40]), fx: 1050, fy: 560} : {zoom: 1.12 + dive * 9, fx: PH[0], fy: PH[1] - 24})}
      overlay={
        <>
          <DayCounter label="DAY 30" />
          {dive > 0.6 ? <AbsoluteFill style={{background: '#dbe8ff', opacity: ramp(dive, 0.6, 1)}} /> : null}
        </>
      }
    >
      <Layer depth={0.7}>
        <Window x={500} y={330} sky="night" scale={0.9} />
      </Layer>
      <Layer depth={1}>
        <Chair x={810} y={FLOOR_Y} />
        <Desk x={1100} y={FLOOR_Y} width={500} />
        <g transform={`translate(${960} ${DESK_TOP})`}>
          <Book x={0} y={0} open={1 - closed} />
        </g>
        <Hourglass x={HG[0]} y={HG[1]} level={keys(f, [40, 240], [0.75, 0.15])} />
        {sandFlow > 0
          ? Array.from({length: 26}).map((_, i) => {
              const u = ((f * 0.03 + i / 26) % 1);
              const x = HG[0] + 4 + u * (PH[0] - HG[0] - 4);
              const y = HG[1] - 62 * 1.3 + Math.sin(u * Math.PI) * -40 + u * 50 + (rnd('sd' + i) - 0.5) * 6;
              return <circle key={i} cx={x} cy={y} r={2.4} fill="#d8c79a" opacity={sandFlow} />;
            })
          : null}
        <g transform={`translate(${PH[0]} ${PH[1]})`}>
          <HandPhone rot={-90} scale={2.2} screen={f > 100 ? 'notif' : 'feed'} scroll={f} buzz={f > 100 && f < 140 ? 1 : 0} glow={0.6} />
        </g>
        {f > 100 ? <Notif x={PH[0] + 40} y={PH[1] - 60} t={f - 100} n={3} /> : null}
        {pull > 0.05 && pull < 0.99
          ? [0, 1, 2].map((i) => <path key={i} d={`M ${neck[0] + 70 + i * 30} ${neck[1] - 40} q 14 30 0 60`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.5 * Math.sin(pull * Math.PI)} />)
          : null}
        <Hero {...hp} emotion={pull > 0.5 ? 'empty' : 'neutral'} />
        {f > 160 ? <Chain from={[neck[0], neck[1]]} to={[PH[0] - 10, PH[1] - 10]} sag={20} width={3.5} link={14} seed="n10" grow={ramp(f, 160, 172)} /> : null}
        {f > 170 ? <Chain from={[hand[0], hand[1]]} to={[PH[0] - 10, PH[1]]} sag={30} width={3.5} link={14} seed="h10" grow={ramp(f, 170, 182)} /> : null}
        {f > 150 ? <Glow cx={neck[0] + 60} cy={neck[1] - 20} r={200} color={C.screen} opacity={0.35 * ramp(f, 150, 170)} /> : null}
      </Layer>
      <Sfx name="sand" at={40} volume={0.4} />
      <Sfx name="buzz" at={100} volume={0.8} />
      <Sfx name="booksnap" at={152} volume={0.9} />
      <Sfx name="chainclick" at={162} volume={0.5} />
      <Sfx name="dive" at={DIVE - 6} volume={0.9} />
    </SceneFrame>
  );
};
