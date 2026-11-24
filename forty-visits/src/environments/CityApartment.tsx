import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT_HAND} from '../theme';
import {Glow, Room, VGrad, Window} from './common';
import {StreetMood} from './common';

export const COUNTER_TOP = 700;

/** night/day city kitchen counter (the marble jar lives here: S4, S15, S31) */
export const CityKitchen: React.FC<{mood?: 'night' | 'day' | 'warm'; windowMood?: StreetMood; children?: React.ReactNode}> = ({mood = 'night', windowMood, children}) => {
  const dark = mood === 'night';
  return (
    <g>
      <Room wall={dark ? '#23262c' : mood === 'warm' ? '#dccab0' : '#cfcdc8'} wall2={dark ? '#2c2f36' : mood === 'warm' ? '#eadbc2' : '#e4e3df'} floor={dark ? '#16171a' : '#8a7f72'} floorY={980} />
      <Window x={1160} y={110} w={600} h={420} mood={windowMood ?? (dark ? 'night' : 'grey')} frame={dark ? '#141518' : '#55575b'} seed="ck" />
      {/* upper cabinets */}
      <rect x={-300} y={80} width={1300} height={250} fill={dark ? '#2e3138' : '#d9d6cf'} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-280 + i * 320} y={96} width={300} height={218} fill="none" stroke="#000" strokeOpacity={0.15} strokeWidth={4} />
      ))}
      {/* counter */}
      <VGrad x={-400} y={COUNTER_TOP + 20} w={2800} h={400} top={dark ? '#2b2d33' : '#b9b3aa'} bottom={dark ? '#18191c' : '#8f8981'} />
      <rect x={-400} y={COUNTER_TOP} width={2800} height={24} fill={dark ? '#3c3f47' : '#ecebe7'} />
      {children}
      {dark ? <Glow cx={960} cy={420} r={500} color="#c9d6e6" opacity={0.12} /> : null}
    </g>
  );
};

/** the fridge (S9, S15): children are drawn on the upper door, centred at (0,0) */
export const CityFridge: React.FC<{mood?: 'night' | 'day'; children?: React.ReactNode}> = ({mood = 'day', children}) => (
  <g>
    <Room wall={mood === 'night' ? '#23262c' : '#cfcdc8'} wall2={mood === 'night' ? '#2c2f36' : '#e4e3df'} floor={mood === 'night' ? '#16171a' : '#9a9590'} floorY={950} />
    <g transform="translate(760 950)">
      <VGrad x={-300} y={-900} w={600} h={900} top="#f1f1ef" bottom="#c9c9c6" rx={16} />
      <rect x={-300} y={-560} width={600} height={6} fill="#000" opacity={0.12} />
      <rect x={-262} y={-520} width={12} height={180} rx={6} fill="#b9b9b6" />
      <rect x={-262} y={-860} width={12} height={180} rx={6} fill="#b9b9b6" />
      <g transform="translate(20 -720)">{children}</g>
    </g>
    <rect x={1200} y={640} width={1000} height={310} fill="#bdb8b0" />
    <rect x={1200} y={630} width={1000} height={16} fill="#e8e6e1" />
  </g>
);

/** night desk with the laptop (S3, S19, S22, S24): screen children in screen coords (0..760, 0..470) */
export const LaptopDesk: React.FC<{children?: React.ReactNode; rain?: boolean; lid?: number}> = ({children, lid = 1}) => (
  <g>
    <Room wall="#1f2227" wall2="#272a31" floor="#141518" floorY={980} />
    <Window x={1300} y={120} w={520} h={420} mood="night" frame="#121316" seed="ld" />
    <rect x={-300} y={760} width={2600} height={24} fill="#3a3530" />
    <rect x={-300} y={784} width={2600} height={400} fill="#2a2622" />
    <g transform={`translate(960 760)`}>
      <path d="M -470 0 L 470 0 L 430 -24 L -430 -24 Z" fill="#3b3d42" />
      <g transform={`scale(1 ${lid})`}>
        <rect x={-420} y={-540} width={840} height={520} rx={14} fill="#18191c" />
        <g transform="translate(-380 -500)">
          <rect x={0} y={0} width={760} height={470} fill="#e9edf2" />
          {children}
        </g>
      </g>
      {lid > 0.1 ? <Glow cx={0} cy={-260} r={760} color="#cfe0ff" opacity={0.25 * lid} /> : null}
    </g>
  </g>
);

export {FONT_HAND};
export const useF = () => useCurrentFrame();
