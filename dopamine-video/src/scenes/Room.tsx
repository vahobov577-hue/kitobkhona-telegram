import React from 'react';
import {C, FLOOR_Y} from '../theme';
import {AlarmClock, Bed, Window, WallClock} from '../components/Props';
import {HandPhone} from '../components/Things';
import {Glow, Nightstand} from '../components/Things';
import {Layer} from '../components/Stage';

export const BED_X = 860;
export const NS_X = 1205;
export const NS_TOP = FLOOR_Y - 84 * 1.3;

/** Bedroom (side view) used by scenes 3, 8, 23, 30. */
export const Bedroom: React.FC<{sky?: 'night' | 'morning'; clockMin?: number; clockHour?: number; alarm?: string; phone?: boolean; phoneBuzz?: number; phoneGlow?: number}> = ({
  sky = 'night',
  clockMin = 282,
  clockHour = 83,
  alarm,
  phone = true,
  phoneBuzz = 0,
  phoneGlow = 0,
}) => (
  <>
    <Layer depth={0.75}>
      <polygon points={`1500,420 1700,420 1880,${FLOOR_Y + 120} 1320,${FLOOR_Y + 120}`} fill={sky === 'morning' ? '#ffb980' : C.moon} opacity={sky === 'morning' ? 0.07 : 0.03} />
      <Window x={1600} y={330} scale={1} sky={sky} />
      <WallClock x={520} y={290} scale={1.05} minute={clockMin} hour={clockHour} />
    </Layer>
    <Layer depth={1}>
      <Bed x={BED_X} y={FLOOR_Y} />
      <Nightstand x={NS_X} y={FLOOR_Y} />
      {alarm ? <AlarmClock x={NS_X + 26} y={NS_TOP} scale={1.1} time={alarm} /> : null}
      {phone ? (
        <>
        {phoneGlow > 0 ? <Glow cx={NS_X - 26} cy={NS_TOP - 10} r={90} color={C.screen} opacity={phoneGlow} /> : null}
        <g transform={`translate(${NS_X - 26} ${NS_TOP - 4})`}>
          <HandPhone rot={-90} scale={1.3} screen="off" buzz={phoneBuzz} />
        </g>
        </>
      ) : null}
    </Layer>
  </>
);
