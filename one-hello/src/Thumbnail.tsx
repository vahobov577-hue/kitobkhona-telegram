import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT_HAND} from './theme';
import {Silhouette} from './characters/Silhouette';
import {Glow, VGrad} from './environments/common';
import {FrontDoor} from './environments/Apartment';

const SANS = 'Helvetica, Arial, sans-serif';

/** 1280×720: cold lonely birthday (left) | warm open door full of friends (right) */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{background: '#111'}}>
    <svg width={1280} height={720} viewBox="0 0 1280 720">
      {/* left: cold */}
      <g>
        <VGrad x={0} y={0} w={640} h={720} top="#3a3d44" bottom="#1c1d21" />
        <rect x={0} y={560} width={640} height={160} fill="#151619" />
        <rect x={60} y={520} width={520} height={14} fill="#2b2b2f" />
        <g transform="translate(470 520)">
          <rect x={-38} y={-38} width={76} height={38} rx={6} fill="#d9d6d0" />
          <rect x={-3} y={-62} width={6} height={24} fill="#b9c6d6" />
          <Glow cx={0} cy={-70} r={120} color="#ffe3a8" opacity={0.6} />
          <path d="M 0 -80 Q 5 -70 0 -64 Q -5 -70 0 -80 Z" fill="#ffe7a8" />
        </g>
        <Silhouette x={200} y={700} frame={10} scale={1.55} seed="leo" pose="sitDesk" expr="sad" look={[7, -2]} eyeGlow="#e3ecff" rig={{armF: [120, 20], head: 0}} />
        {/* the phone with 143 */}
        <g transform="translate(450 330) rotate(-8) scale(0.85)">
          <Glow cx={0} cy={0} r={200} color="#cfe0ff" opacity={0.5} />
          <rect x={-78} y={-140} width={156} height={280} rx={22} fill="#111214" />
          <rect x={-68} y={-128} width={136} height={256} rx={16} fill="#1d2a44" />
          <text x={0} y={10} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={66} fill="#fff">143</text>
          <path d="M -16 60 L 4 30 L 14 64 Z" fill="#e2a33b" />
          <circle cx={14} cy={26} r={5} fill="#e0554a" />
          <circle cx={24} cy={38} r={4} fill="#5aa0e0" />
        </g>
      </g>
      {/* right: warm */}
      <g>
        <VGrad x={640} y={0} w={640} h={720} top="#f2d3a0" bottom="#c99a62" />
        <Glow cx={960} cy={420} r={520} color="#FFC873" opacity={0.8} />
        <g transform="translate(-480 -140) scale(1)">
          <FrontDoor x={1440} open={1} />
        </g>
        {[[960, 'dan'], [1080, 'mia'], [1190, 'pony'], [850, 'none'], [740, 'neighbor']].map(([x, acc], i) => (
          <Silhouette key={i} x={x as number} y={700 + (i > 2 ? 10 : 0)} frame={i * 20} scale={0.95} seed={'th' + i} acc={acc as 'dan'} expr="happy" rig={i === 0 ? {armF: [150, 20]} : undefined} />
        ))}
      </g>
      <rect x={636} y={0} width={8} height={720} fill="#000" />
    </svg>
    <div style={{position: 'absolute', top: 18, width: 1280, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 92, letterSpacing: 1, color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', textShadow: '0 6px 18px rgba(0,0,0,0.6)'}}>
      143 LIKES. <span style={{color: '#fff'}}>0 CALLS.</span>
    </div>
    <div style={{display: 'none', fontFamily: FONT_HAND, color: C.sil}} />
  </AbsoluteFill>
);
