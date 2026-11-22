import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Glow, Room} from './common';

/** apartment corridor at night with the party door (coloured light leaking) */
export const Corridor: React.FC<{party?: boolean; partyX?: number}> = ({party = true, partyX = 1100}) => {
  const f = useCurrentFrame();
  const hue = ['#ff5fa2', '#5fb0ff', '#ffd25f', '#8f5fff'][Math.floor(f / 12) % 4];
  return (
    <g>
      <Room wall="#3a3936" wall2="#45433f" floor="#24231f" floorY={880} />
      {[-300, 300, partyX, 1800].map((x, i) => (
        <g key={i}>
          <rect x={x - 130} y={330} width={260} height={550} fill={x === partyX && party ? '#2b2522' : '#2f2d2a'} />
          <rect x={x - 118} y={342} width={236} height={538} fill="#4b4742" />
          <circle cx={x + 90} cy={620} r={9} fill="#9c8a62" />
          <rect x={x - 20} y={290} width={40} height={20} fill="#8a8274" />
          {x === partyX && party ? (
            <g>
              <rect x={x - 118} y={872} width={236} height={8} fill={hue} />
              <rect x={x + 116} y={346} width={6} height={530} fill={hue} opacity={0.8} />
            </g>
          ) : null}
        </g>
      ))}
      {[200, 960, 1700].map((x) => (
        <g key={x}>
          <rect x={x - 70} y={70} width={140} height={14} rx={7} fill="#d8d2c2" />
          <Glow cx={x} cy={160} r={240} color="#e9e2cf" opacity={0.25} />
        </g>
      ))}
    </g>
  );
};

/** the coloured glow leaking from under/around the party door (drawn ungraded on top) */
export const PartyLeak: React.FC<{x: number; y?: number; amount?: number}> = ({x, y = 880, amount = 1}) => {
  const f = useCurrentFrame();
  const hue = ['#ff5fa2', '#5fb0ff', '#ffd25f', '#8f5fff'][Math.floor(f / 12) % 4];
  return <Glow cx={x} cy={y} r={300} ry={60} color={hue} opacity={0.45 * amount} />;
};
