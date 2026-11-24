import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Silhouette} from './characters/Silhouette';
import {Glow, VGrad} from './environments/common';
import {MarbleJar} from './inserts/Inserts';

const SANS = 'Helvetica, Arial, sans-serif';

/** 1280×720: dark left (hand + phone, 14 missed calls from MOM) | warm right (jar of marbles, mom in a lit window) */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{background: '#0b0c0f'}}>
    <svg width={1280} height={720} viewBox="0 0 1280 720">
      {/* right: warm */}
      <VGrad x={560} y={0} w={720} h={720} top="#6a4a2e" bottom="#2a1c12" />
      <g>
        <rect x={900} y={150} width={300} height={230} fill="#ffcf7a" />
        <Glow cx={1050} cy={265} r={330} color="#FFC873" opacity={0.7} />
        <Silhouette x={1050} y={470} frame={0} scale={0.95} seed="mom" acc="mom" expr="sad" look={[-6, 1]} />
        <rect x={900} y={150} width={300} height={230} fill="none" stroke="#2a1c12" strokeWidth={14} />
                <rect x={860} y={380} width={420} height={340} fill="#3a281a" />
      </g>
      <Glow cx={900} cy={560} r={360} color="#FFC873" opacity={0.45} />
      <rect x={560} y={630} width={720} height={90} fill="#4a321e" />
      <MarbleJar x={860} y={640} s={0.82} n={40} />
      {/* left: dark, cold */}
      <path d="M 0 0 L 640 0 L 560 720 L 0 720 Z" fill="#0c0e13" />
      <Glow cx={300} cy={420} r={380} color="#4f86ff" opacity={0.55} />
      <g transform="translate(300 420) rotate(-8)">
        <rect x={-130} y={-230} width={260} height={460} rx={34} fill="#111214" />
        <rect x={-118} y={-218} width={236} height={436} rx={26} fill="#16233f" />
        <circle cx={0} cy={-110} r={46} fill="#5c78a8" />
        <circle cx={0} cy={-122} r={18} fill="#c9d6ee" />
        <path d="M -30 -84 Q 0 -112 30 -84 Z" fill="#c9d6ee" />
        <text x={0} y={-20} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={52} fill="#fff">MOM</text>
        <rect x={-112} y={14} width={224} height={110} rx={30} fill="#e5483a" />
        <text x={0} y={60} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} fill="#fff">14 missed</text>
        <text x={0} y={104} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill="#fff">calls</text>
      </g>
      {/* hand gripping the phone */}
      <g fill="#0E0E0E">
        <path d="M 110 720 L 150 600 Q 170 560 220 570 L 290 640 L 320 720 Z" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={410} y={300 + i * 62} width={70} height={46} rx={23} transform={`rotate(-8 300 420)`} />
        ))}
        <rect x={150} y={520} width={56} height={120} rx={28} transform="rotate(-40 180 600)" />
      </g>
      {/* title */}
      <text x={640} y={112} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={104} letterSpacing={4} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke">
        40 VISITS LEFT
      </text>
    </svg>
  </AbsoluteFill>
);
