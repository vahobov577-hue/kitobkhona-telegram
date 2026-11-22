import React from 'react';
import {Glow, Room, Window} from './common';
import {StreetMood} from './common';

export const BED_TOP = 700;

/** bedroom (side view): bed, nightstand with lamp, window */
export const Bedroom: React.FC<{mood?: StreetMood; lamp?: number; warm?: number}> = ({mood = 'night', lamp = 0, warm = 0}) => {
  const dark = mood === 'night';
  return (
    <g>
      <Room wall={dark ? '#24262c' : '#c9c6c0'} wall2={dark ? '#2d3037' : '#dedcd7'} floor={dark ? '#18191c' : '#8a7c6c'} floorY={880} />
      <Window x={1240} y={150} w={480} h={430} mood={mood} mullions={2} frame={dark ? '#141518' : '#55575b'} seed="bed" />
      {/* bed */}
      <rect x={340} y={520} width={40} height={360} fill={dark ? '#1b1c20' : '#6a5a4c'} />
      <rect x={360} y={BED_TOP} width={760} height={110} rx={10} fill={dark ? '#3a3d46' : '#e6e1d8'} />
      <rect x={360} y={BED_TOP + 100} width={760} height={50} fill={dark ? '#26282e' : '#8b7a68'} />
      <rect x={390} y={BED_TOP - 38} width={190} height={54} rx={24} fill={dark ? '#4a4d56' : '#f4f1ea'} />
      <path d={`M 560 ${BED_TOP + 6} Q 840 ${BED_TOP - 22} 1120 ${BED_TOP + 6} L 1120 ${BED_TOP + 110} L 560 ${BED_TOP + 110} Z`} fill={dark ? '#30333b' : '#9fb0bd'} />
      {/* nightstand + lamp */}
      <rect x={1150} y={720} width={150} height={160} fill={dark ? '#2b2d33' : '#8a7a68'} />
      <g transform="translate(1225 720)">
        <rect x={-4} y={-90} width={8} height={90} fill="#141416" />
        <path d="M -40 -90 L 40 -90 L 28 -140 L -28 -140 Z" fill={lamp > 0 ? '#f3d9a2' : '#3a3b40'} />
        {lamp > 0 ? <Glow cx={0} cy={-100} r={300} color="#FFC873" opacity={0.5 * lamp} /> : null}
      </g>
      {warm > 0 ? <Glow cx={800} cy={500} r={1100} color="#FFB347" opacity={0.35 * warm} /> : null}
    </g>
  );
};
