import React from 'react';
import {C, FLOOR_Y} from '../theme';
import {AlarmClock, Desk, Window, WallClock} from '../components/Props';
import {Layer} from '../components/Stage';

/** Shared night/morning room background (scenes 2, 3, 17). */
export const RoomBack: React.FC<{sky?: 'night' | 'morning'; moonBeam?: number; clockMin?: number; clockHour?: number}> = ({sky = 'night', moonBeam = 1, clockMin = 282, clockHour = 83}) => (
  <Layer depth={0.75}>
    <polygon
      points={`1330,420 1530,420 1700,${FLOOR_Y + 120} 1120,${FLOOR_Y + 120}`}
      fill={sky === 'morning' ? '#ffb980' : C.moon}
      opacity={(sky === 'morning' ? 0.08 : 0.035) * moonBeam}
    />
    <Window x={1430} y={330} scale={1} sky={sky} />
    <WallClock x={560} y={300} scale={1.05} minute={clockMin} hour={clockHour} />
  </Layer>
);

export const DESK_X = 1060;
export const LAPTOP_X = 1000;
export const DESK_TOP = FLOOR_Y - 129 * 1.3;

export const DeskSet: React.FC<{time?: string}> = ({time = '02:47'}) => (
  <g>
    <Desk x={DESK_X} y={FLOOR_Y} />
    <AlarmClock x={1190} y={DESK_TOP} scale={1.2} time={time} />
  </g>
);
