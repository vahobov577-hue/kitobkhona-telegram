import React from 'react';
import {EASE, EASE_IN, keys, ramp} from '../lib';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Kitchen} from '../environments/Apartment';
import {CalendarSheet, cellsOf, Sheet} from '../inserts/Calendar';
import {LEO, useT} from './kit';
import {PLAN_LINES} from './S09';

export const HELLO_LINES = [{text: '1 HELLO', size: 150, color: C.red}];
export const CalendarOnFridge: React.FC<{checks: number; draw?: number; hello?: boolean; green?: boolean}> = ({checks, draw = 1, hello = true}) => (
  <>
    <CalendarSheet x={-60} y={10} s={0.5} title="1 HELLO A DAY" cells={cellsOf((i) => (i < checks ? 'check' : i === checks ? 'today' : 'empty'))} drawIdx={checks - 1} draw={draw} />
    {hello ? <Sheet x={130} y={-20} s={0.38} rot={4} lines={HELLO_LINES} h={380} w={560} /> : null}
  </>
);

// medium: Leo tears the big plan off the fridge
const A: React.FC = () => {
  const {t, g} = useT();
  const tear = ramp(t, 22, 40, 0, 1, EASE_IN);
  return (
    <Shot cam={() => ({zoom: 1.5, fx: 700, fy: 470})}>
      <Layer depth={1}>
        <Kitchen>
          <g transform={`translate(${tear * 160} ${tear * 380}) rotate(${tear * 40}) scale(${1 - tear * 0.4})`} opacity={1 - ramp(t, 44, 56)}>
            <Sheet x={0} y={0} s={0.42} lines={PLAN_LINES} />
          </g>
        </Kitchen>
        {LEO({x: 900, y: 1010, frame: g, scale: 1.75, facing: -1, expr: 'determined', rig: {armF: [keys(t, [0, 20, 40], [20, 150, 60], EASE), 20]}})}
      </Layer>
      <Sfx name="rip" at={24} volume={0.9} />
    </Shot>
  );
};
// insert: the new calendar goes up
const B: React.FC = () => {
  const {t} = useT();
  const s = keys(t, [0, 6, 10], [1.2, 0.97, 1], EASE);
  return (
    <Shot bg="#cfcdc8" cam={() => ({zoom: 1.8, fx: 500, fy: 320, x: 500 - 960, y: 320 - 540})}>
      <Layer depth={1}>
        <Kitchen>
          <g transform={`scale(${s})`}>
            <CalendarOnFridge checks={0} hello={false} />
          </g>
        </Kitchen>
      </Layer>
      <Sfx name="magnet" at={4} volume={0.6} />
    </Shot>
  );
};
// medium: both papers on the fridge, Leo looks at them (match: red "NEW ME" → red "1 HELLO")
const C3: React.FC = () => {
  const {g} = useT();
  return (
    <Shot cam={() => ({zoom: 1.45, fx: 720, fy: 450})} drift={[-20, 0]}>
      <Layer depth={1}>
        <Kitchen>
          <CalendarOnFridge checks={0} />
        </Kitchen>
        {LEO({x: 960, y: 1010, frame: g, scale: 1.75, facing: -1, expr: 'neutral', look: [-6, -3]})}
      </Layer>
      <Sfx name="magnet" at={2} volume={0.5} />
    </Shot>
  );
};
export const S13 = [A, B, C3];
