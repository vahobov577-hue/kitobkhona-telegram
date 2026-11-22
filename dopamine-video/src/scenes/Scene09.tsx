import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {EASE, EASE_OUT, keys, ramp, rectPath, wobbler} from '../lib';
import {Hero, heroJoint} from '../components/Hero';
import {Chain} from '../components/Monster';
import {HandPhone} from '../components/Things';
import {Chair, Desk} from '../components/Props';
import {DayCounter, SceneFrame, Sfx} from '../components/Stage';

const PW = 632;
const FLOOR = 820;

const Panel: React.FC<{i: number; enter: number; children: React.ReactNode; zoom: number}> = ({i, enter, children, zoom}) => {
  const f = useCurrentFrame();
  const dy = ramp(f, enter, enter + 14, i % 2 ? -1100 : 1100, 0, EASE_OUT);
  return (
    <div style={{position: 'absolute', left: i * (PW + 12), top: 0, width: PW, height: 1080, overflow: 'hidden', transform: `translateY(${dy}px)`, background: '#141414'}}>
      <svg width={PW} height={1080} viewBox={`0 0 ${PW} 1080`}>
        <g transform={`translate(${PW / 2} 560) scale(${zoom * 1.35}) translate(${-PW / 2} -600)`}>
          <line x1={-500} y1={FLOOR} x2={1200} y2={FLOOR} stroke={C.floor} strokeWidth={2} />
          {children}
        </g>
      </svg>
    </div>
  );
};

const phoneChain = (p: Parameters<typeof heroJoint>[0]) => {
  const h = heroJoint(p, 'haF');
  const n = heroJoint(p, 'neck');
  return (
    <g>
      <Chain from={[h[0], h[1] - 10]} to={[h[0] + 70, h[1] + 120]} sag={20} width={3} link={12} seed={'a' + p.x} />
      <Chain from={[n[0], n[1]]} to={[h[0] + 4, h[1] - 16]} sag={14} width={3} link={12} seed={'b' + p.x} />
    </g>
  );
};

// 1380–1620: DAY 14 — three panels: teeth, food, street. Phone in every one. chains 2.
export const Scene09: React.FC = () => {
  const f = useCurrentFrame();
  const w = wobbler(f, 'p9', 1);
  const brush = Math.sin(f * 0.9) * 8;
  const p1 = {x: 300, y: FLOOR, frame: f, pose: 'stand' as const, scale: 1.3, rig: {armF: [120, 40] as [number, number], armB: [150, 30 + brush] as [number, number], head: 14}};
  const p2 = {x: 250, y: FLOOR, frame: f, pose: 'sit' as const, scale: 1.3, rig: {armF: [100, 50] as [number, number], armB: [60, 60 + brush * 0.6] as [number, number], head: 16}};
  const walkX = keys(f, [60, 240], [120, 360]);
  const p3 = {x: walkX, y: FLOOR, frame: f, pose: 'walk' as const, scale: 1.3, speed: 0.7, rig: {armF: [110, 40] as [number, number], head: 16}};
  const bike = keys(f, [140, 158], [-500, 1200], EASE);
  const z = (i: number) => keys(f, [i * 30, 240], [1.08, 1.18]);
  return (
    <SceneFrame dur={240} floor={false} breathe={false} wipeIn={10} overlay={<DayCounter label="DAY 14" />}>
      <AbsoluteFill style={{background: '#000'}} />
      <Panel i={0} enter={0} zoom={z(0)}>
        <path d={rectPath(w, 420, 360, 150, 190, 10)} fill="#2d3340" stroke={C.ink} strokeWidth={3} />
        <path d={rectPath(w, 390, 640, 220, 30, 6)} fill={C.furnLight} stroke={C.ink} strokeWidth={3} />
        <path d={w`M 440 670 L 450 ${FLOOR} M 560 670 L 550 ${FLOOR}`} stroke={C.ink} strokeWidth={6} />
        <Hero {...p1} emotion="empty" handItem={<HandPhone rot={170} scale={1} screen="feed" scroll={f * 2} />} handItemBack={<rect x={-3} y={-30} width={6} height={34} fill="#9fd3ff" stroke={C.ink} strokeWidth={1.5} />} />
        {phoneChain(p1)}
      </Panel>
      <Panel i={1} enter={30} zoom={z(1)}>
        <Chair x={240} y={FLOOR} />
        <Desk x={470} y={FLOOR} width={300} />
        <ellipse cx={420} cy={FLOOR - 170} rx={50} ry={10} fill="#e9e2d2" stroke={C.ink} strokeWidth={3} />
        <Hero {...p2} emotion="empty" handItem={<HandPhone rot={150} scale={1} screen="feed" scroll={f * 2} />} />
        {phoneChain(p2)}
      </Panel>
      <Panel i={2} enter={60} zoom={z(2)}>
        <path d={w`M -200 ${FLOOR - 340} L 900 ${FLOOR - 340}`} stroke="#222" strokeWidth={3} />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={-100 + k * 240 - (f * 1.5) % 240} y={FLOOR - 300} width={140} height={200} fill="#1b1b20" stroke="#222" strokeWidth={3} />
        ))}
        <Hero {...p3} emotion="empty" handItem={<HandPhone rot={150} scale={1} screen="feed" scroll={f * 2} />} />
        {phoneChain(p3)}
        {f > 135 && f < 162 ? (
          <g transform={`translate(${bike} ${FLOOR})`}>
            <line x1={-300} y1={-60} x2={-60} y2={-60} stroke="#fff" strokeWidth={3} opacity={0.4} />
            <line x1={-260} y1={-100} x2={-40} y2={-100} stroke="#fff" strokeWidth={2} opacity={0.3} />
            <circle cx={-50} cy={-40} r={40} fill="none" stroke="#bbb" strokeWidth={6} />
            <circle cx={70} cy={-40} r={40} fill="none" stroke="#bbb" strokeWidth={6} />
            <path d="M -50 -40 L 0 -100 L 70 -40 M 0 -100 L 50 -100 M -10 -110 L 10 -110" stroke="#bbb" strokeWidth={6} fill="none" />
          </g>
        ) : null}
      </Panel>
      <Sfx name="swipe" at={0} volume={0.4} />
      <Sfx name="swipe" at={30} volume={0.4} />
      <Sfx name="swipe" at={60} volume={0.4} />
      <Sfx name="bike" at={136} volume={0.9} />
    </SceneFrame>
  );
};
