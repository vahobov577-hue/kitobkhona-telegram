import React from 'react';
import {rnd} from '../lib';
import {useCurrentFrame} from 'remotion';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Kitchen} from '../environments/Apartment';
import {CalendarSheet, cellsOf} from '../inserts/Calendar';
import {StreetView} from '../environments/common';
import {LEO, useT} from './kit';

const Snow: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({length: 80}).map((_, i) => (
        <circle key={i} cx={rnd('sx' + i) * 1920} cy={((rnd('sy' + i) * 1100 + f * (2 + rnd('sv' + i) * 2)) % 1100)} r={3 + rnd('sr' + i) * 3} fill="#fff" opacity={0.85} />
      ))}
    </g>
  );
};
/** the window over the year: winter → spring → summer */
const Seasons: React.FC<{k: number}> = ({k}) => {
  const w = Math.max(0, 1 - k * 3);
  const sp = Math.max(0, 1 - Math.abs(k - 0.5) * 3);
  const su = Math.max(0, k * 3 - 2);
  return (
    <g>
      <StreetView x={0} y={0} w={1920} h={1080} mood="day" seed="ssn" />
      <g opacity={w}>
        <rect x={0} y={0} width={1920} height={1080} fill="#e9eef3" opacity={0.55} />
        <rect x={0} y={770} width={1920} height={310} fill="#f7f9fb" />
        <Snow />
      </g>
      <g opacity={sp}>
        {Array.from({length: 40}).map((_, i) => (
          <circle key={i} cx={1400 + (rnd('b' + i) - 0.5) * 300} cy={560 + (rnd('bb' + i) - 0.5) * 200} r={14} fill="#f6b6c8" />
        ))}
      </g>
      <g opacity={su}>
        <rect x={0} y={0} width={1920} height={1080} fill="#ffe7a8" opacity={0.15} />
        {Array.from({length: 40}).map((_, i) => (
          <circle key={i} cx={1400 + (rnd('g' + i) - 0.5) * 320} cy={560 + (rnd('gg' + i) - 0.5) * 220} r={22} fill="#5aa64a" />
        ))}
      </g>
    </g>
  );
};

const A: React.FC = () => (
  <Shot bg="#cfcdc8" cam={() => ({zoom: 1.7, fx: 560, fy: 380})} drift={[20, 0]}>
    <Layer depth={1}>
      <Kitchen>
        {[3, 2, 1].map((k) => (
          <CalendarSheet key={k} x={-60 + k * 14} y={10 - k * 12} s={0.5} rot={k * 2} title="1 HELLO A DAY" cells={cellsOf(() => 'check')} />
        ))}
        <CalendarSheet x={-60} y={10} s={0.5} title="1 HELLO A DAY" cells={cellsOf(() => 'check')} />
      </Kitchen>
    </Layer>
  </Shot>
);
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot zoom={[1.0, 1.04]}>
      <Layer depth={0.8}>
        <Seasons k={t / 100} />
      </Layer>
      <Layer depth={1}>
        <rect x={-200} y={-200} width={2320} height={140} fill="#5b5d61" />
        <rect x={-200} y={1000} width={2320} height={300} fill="#5b5d61" />
        <rect x={955} y={-200} width={14} height={1400} fill="#5b5d61" />
      </Layer>
      <Sfx name="wind" at={0} volume={0.3} dur={100} />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.5, fx: 1300, fy: 480})}>
      <Layer depth={0.8} blur={2}>
        <Kitchen mood="day" windowMood="day" />
      </Layer>
      <Layer depth={1}>{LEO({x: 1320, y: 1010, frame: g, scale: 1.8, expr: 'happy', facing: -1, look: [-4, 0]})}</Layer>
    </Shot>
  );
};
export const S30 = [A, B, C3];
