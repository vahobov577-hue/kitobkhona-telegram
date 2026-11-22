import React from 'react';
import {Glow, Room, VGrad, Window} from './common';
import {Houses, SkyBg} from './Street';

/** bus interior — driver seat towards the front window */
export const BusFront: React.FC = () => (
  <g>
    <Room wall="#9aa0a4" wall2="#b4b8bb" floor="#55585c" floorY={880} />
    <Window x={200} y={160} w={1520} h={360} mood="grey" mullions={3} frame="#2c2f33" leaves={0.6} seed="bus" />
    <rect x={200} y={540} width={1520} height={30} fill="#4b4e52" />
    <rect x={260} y={520} width={20} height={360} fill="#c9a23a" />
  </g>
);

/** office copier corner */
export const Office: React.FC = () => (
  <g>
    <Room wall="#cfd0cc" wall2="#e2e3df" floor="#8c8f8c" floorY={880} />
    <Window x={1250} y={160} w={520} h={400} mood="grey" leaves={0.8} seed="off" />
    <g transform="translate(960 880)">
      <rect x={-170} y={-330} width={340} height={330} rx={10} fill="#e9e9e6" />
      <rect x={-170} y={-360} width={340} height={40} rx={6} fill="#cfcfcb" />
      <rect x={60} y={-300} width={90} height={50} rx={6} fill="#3a3d42" />
      <rect x={-140} y={-240} width={280} height={14} fill="#b9b9b5" />
    </g>
  </g>
);

/** gym: racks and a mirror */
export const Gym: React.FC = () => (
  <g>
    <Room wall="#b9bcbf" wall2="#cdd0d3" floor="#3e4146" floorY={880} />
    <rect x={200} y={150} width={1520} height={560} fill="#9aa3ab" opacity={0.5} />
    {Array.from({length: 8}).map((_, i) => (
      <g key={i} transform={`translate(${260 + i * 200} 760)`}>
        <rect x={-60} y={-8} width={120} height={16} fill="#2c2f33" />
        <circle cx={-60} cy={0} r={34} fill="#1e2024" />
        <circle cx={60} cy={0} r={34} fill="#1e2024" />
      </g>
    ))}
  </g>
);

/** flashback rooftop at sunset (warm, faded) */
export const Rooftop: React.FC = () => (
  <g>
    <VGrad x={-800} y={-400} w={3600} h={1100} top="#e9b98a" bottom="#f6dcae" />
    <Glow cx={1400} cy={560} r={500} color="#ffd59a" opacity={0.8} />
    <circle cx={1400} cy={560} r={90} fill="#fff1cf" />
    <Houses sky="day" offset={100} y={720} scale={0.8} seed="fb" />
    <rect x={-800} y={720} width={3600} height={500} fill="#8a6f5c" />
    <rect x={-800} y={712} width={3600} height={14} fill="#a88a72" />
  </g>
);

/** flashback road with the two bikes (warm) */
export const BikeRoad: React.FC = () => (
  <g>
    <SkyBg sky="dawn" />
    <Houses sky="day" offset={400} y={760} scale={0.7} seed="bk" />
    <rect x={-800} y={760} width={3600} height={500} fill="#b79a74" />
    <rect x={-800} y={840} width={3600} height={60} fill="#cfb48a" />
  </g>
);
