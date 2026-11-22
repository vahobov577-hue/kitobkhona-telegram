import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FLOOR_Y, FONT_BOLD} from '../theme';
import {EASE_OUT, ramp} from '../lib';
import {Face, Hero} from '../components/Hero';
import {Glow, HandPhone, SunDrawing} from '../components/Things';
import {Bed} from '../components/Props';
import {SceneFrame, Sfx} from '../components/Stage';
import {DinnerTable} from './Dinner';

const PAIR = 75;

const Half: React.FC<{side: 0 | 1; children: React.ReactNode; enter: number; grey?: boolean}> = ({side, children, enter, grey}) => {
  const f = useCurrentFrame();
  const dx = enter === 0 ? ramp(f, 0, 10, side ? 400 : -400, 0, EASE_OUT) : ramp(f, enter, enter + 8, side ? 120 : -120, 0, EASE_OUT);
  const op = enter === 0 ? ramp(f, 0, 6) : ramp(f, enter, enter + 4, 0.55, 1);
  return (
    <div style={{position: 'absolute', left: side ? 966 : 0, top: 0, width: 954, height: 1080, overflow: 'hidden', background: side ? '#17130f' : '#111', filter: grey ? 'grayscale(1) brightness(0.8)' : undefined}}>
      <svg width={954} height={1080} viewBox="483 90 954 1080" style={{transform: `translateX(${dx}px) scale(1.15)`, opacity: op, transformOrigin: '50% 60%'}}>
        <line x1={0} y1={FLOOR_Y} x2={1920} y2={FLOOR_Y} stroke={C.floor} strokeWidth={2} />
        {children}
      </svg>
    </div>
  );
};

// 7560–7860: BEFORE / AFTER, four pairs.
export const Scene31: React.FC = () => {
  const f = useCurrentFrame();
  const k = Math.min(3, Math.floor(f / PAIR));
  const lt = f - k * PAIR;
  const enter = k * PAIR;
  const left = [
    <g key="l0">
      <Bed x={960} y={FLOOR_Y} />
      <Glow cx={1060} cy={FLOOR_Y - 120} r={200} color={C.screen} opacity={0.5} />
      <Hero x={1000} y={FLOOR_Y - 92} frame={f} pose="lieBed" emotion="empty" rig={{armF: [170, 30]}} handItem={<HandPhone rot={-90} screen="feed" scroll={f * 2} />} />
    </g>,
    <g key="l1" transform="translate(260 0)">
      <DinnerTable f={f} friendOp={[0, 0, 0]} />
    </g>,
    <g key="l2">
      <rect x={720} y={260} width={480} height={700} rx={50} fill="#060608" stroke="#1b1b21" strokeWidth={20} />
      <g transform="translate(960 560) scale(5)" opacity={0.55}>
        <ellipse rx={37} ry={42} fill="#cfc8ba" />
        <Face emotion="shocked" blink={1} age={0.85} />
      </g>
    </g>,
    <g key="l3">
      <Hero x={960} y={FLOOR_Y} frame={0} pose="sit" emotion="empty" saturation={0} age={0.7} rig={{armF: [36, 112], head: 18}} handItem={<HandPhone rot={160} screen="feed" />} />
      {Array.from({length: 90}).map((_, i) => (
        <circle key={i} cx={960 + ((i * 37) % 150) - 75} cy={FLOOR_Y - 40 - ((i * 53) % 300)} r={2} fill="#8a8578" />
      ))}
    </g>,
  ];
  const right = [
    <g key="r0">
      {Array.from({length: 6}).map((_, i) => (
        <line key={i} x1={((i * 330 - f * 24) % 1980) + 1980 - 600} y1={FLOOR_Y + 20} x2={((i * 330 - f * 24) % 1980) + 2100 - 600} y2={FLOOR_Y + 20} stroke="#444" strokeWidth={3} />
      ))}
      <Hero x={960} y={FLOOR_Y} frame={f} pose="run" headband emotion="smile" wind={2} />
    </g>,
    <g key="r1" transform="translate(200 0)">
      <Glow cx={1000} cy={400} r={600} color="#ffb661" opacity={0.3} />
      <DinnerTable f={f} warm={[1, 1, 1]} laugh={[1, 1, 1]} heroPhone={false} heroEmotion="smile" chains={false} />
    </g>,
    <g key="r2">
      <Glow cx={960} cy={560} r={520} color={C.sun} opacity={0.35} />
      <g transform="translate(960 560) scale(5)">
        <ellipse rx={37} ry={42} fill={C.hero} stroke={C.ink} strokeWidth={0.8} />
        <Face emotion="smile" blink={1} />
      </g>
    </g>,
    <g key="r3">
      <rect x={700} y={300} width={520} height={560} fill="#ece6d8" stroke={C.ink} strokeWidth={4} />
      <SunDrawing x={960} y={560} t={1} glow={1} scale={2} />
    </g>,
  ];
  return (
    <SceneFrame dur={300} floor={false} breathe={false} fadeIn={0}>
      <AbsoluteFill style={{background: '#000'}} />
      <Half side={0} enter={enter} grey>
        {left[k]}
      </Half>
      <Half side={1} enter={enter + 4}>
        {right[k]}
      </Half>
      <div style={{position: 'absolute', left: 0, width: 954, top: 40, textAlign: 'center', fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 54, color: '#9a9a9a', letterSpacing: 8}}>BEFORE</div>
      <div style={{position: 'absolute', left: 966, width: 954, top: 40, textAlign: 'center', fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 54, color: '#fff', letterSpacing: 8, transform: `scale(${ramp(lt, 4, 12, 1.15, 1, EASE_OUT)})`}}>AFTER</div>
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} name="whoosh" at={i * PAIR} volume={0.4} dur={20} />
      ))}
    </SceneFrame>
  );
};
