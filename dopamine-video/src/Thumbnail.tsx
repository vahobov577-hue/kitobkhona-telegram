import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT_BOLD} from './theme';
import {Face, Headband} from './components/Hero';
import {Chain, PhoneMonster} from './components/Monster';
import {Glow} from './components/Things';
import './theme';

// YouTube thumbnail 1280×720: face (left, ~45%), giant phone-monster (right), "DOPAMINE".
export const Thumbnail: React.FC = () => {
  void Headband;
  const neck: [number, number] = [430, 690];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 70% 50%, #2a0d0f 0%, #111 55%, #0a0a0a 100%)'}}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <Glow cx={980} cy={380} r={520} color={C.red} opacity={0.55} />
        <PhoneMonster x={1000} y={800} scale={6.4} smirk={1} glow={1.4} chains={3} targets={[neck, [470, 640], [380, 720]]} chainSag={40} roar={0} />
        {/* the face, lit blue from below */}
        <Glow cx={390} cy={560} r={420} color={C.screen} opacity={0.75} />
        <g transform="translate(390 440) scale(7.4) rotate(-4)">
          <ellipse cx={0} cy={0} rx={37} ry={42} fill={C.hero} stroke={C.ink} strokeWidth={0.9} />
          <Face emotion="empty" blink={1} age={0.5} />
          <defs>
            <clipPath id="headclip">
              <ellipse cx={0} cy={0} rx={37} ry={42} />
            </clipPath>
            <linearGradient id="under" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={C.screen} stopOpacity={0.75} />
              <stop offset="55%" stopColor={C.screen} stopOpacity={0.15} />
              <stop offset="100%" stopColor={C.screen} stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect x={-40} y={-44} width={80} height={88} fill="url(#under)" clipPath="url(#headclip)" />
        </g>
        <path d="M 150 720 Q 390 610 630 720 Z" fill={C.hero} stroke={C.ink} strokeWidth={6} />
        <Chain from={[980, 520]} to={neck} sag={50} width={14} link={42} seed="th1" />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 0,
          width: 1280,
          textAlign: 'center',
          fontFamily: FONT_BOLD,
          fontWeight: 700,
          fontSize: 150,
          letterSpacing: 6,
          color: '#fff',
          WebkitTextStroke: '12px #000',
          paintOrder: 'stroke fill',
          textShadow: '0 8px 24px rgba(0,0,0,0.7)',
        }}
      >
        DOPAMINE
      </div>
    </AbsoluteFill>
  );
};
