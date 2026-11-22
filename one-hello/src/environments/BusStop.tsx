import React from 'react';
import {Glow, StreetLamp} from './common';
import {Houses, SIDEWALK_Y, SkyBg, StreetFront} from './Street';

/** bus stop shelter on a grey street */
export const BusStop: React.FC<{dark?: number}> = ({dark = 0}) => (
  <g>
    <SkyBg sky="grey" />
    <Houses sky="grey" offset={300} />
    <StreetFront sky="grey" trees={false} />
    <StreetLamp x={1700} y={SIDEWALK_Y + 10} on={0} />
    {/* shelter */}
    <g>
      <rect x={560} y={360} width={820} height={22} fill="#3b3e44" />
      <rect x={570} y={382} width={10} height={480} fill="#3b3e44" />
      <rect x={1360} y={382} width={10} height={480} fill="#3b3e44" />
      <rect x={580} y={382} width={780} height={420} fill="#cfd8de" opacity={0.25} />
      <rect x={1200} y={420} width={140} height={260} fill="#e8e2d2" />
      <rect x={1214} y={436} width={112} height={150} fill="#9aa8b4" />
      <rect x={680} y={730} width={560} height={16} fill="#4b4e54" />
      <rect x={700} y={746} width={10} height={110} fill="#3b3e44" />
      <rect x={1210} y={746} width={10} height={110} fill="#3b3e44" />
    </g>
    <rect x={-1500} y={-600} width={5000} height={1700} fill="#0d1018" opacity={dark} />
    <Glow cx={960} cy={500} r={1}  color="#000" opacity={0} />
  </g>
);
