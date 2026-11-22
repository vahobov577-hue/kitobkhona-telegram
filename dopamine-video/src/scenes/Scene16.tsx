import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FLOOR_Y} from '../theme';
import {EASE, keys, ramp, rnd} from '../lib';
import {Hero} from '../components/Hero';
import {Calendar, HandPhone, Sheet} from '../components/Things';
import {Chair} from '../components/Props';
import {Layer, SceneFrame, Sfx} from '../components/Stage';

const CAL: [number, number] = [560, 360];

// 3240–3540: wind tears off calendar sheets, years flicker by. He doesn't move; dust settles on him.
export const Scene16: React.FC = () => {
  const f = useCurrentFrame();
  const rate = keys(f, [0, 120, 300], [9, 4, 3]);
  const torn = Math.floor(f / rate);
  const year = 2026 + Math.floor(keys(f, [0, 300], [0, 4.99]));
  const age = keys(f, [0, 280], [0, 0.7], EASE);
  const sheets = Array.from({length: 14}).map((_, k) => {
    const idx = torn - k;
    if (idx < 0) return null;
    const t = f - idx * rate;
    if (t < 0 || t > 60) return null;
    const x = CAL[0] + 150 + t * (22 + rnd('sx' + idx) * 12);
    const y = CAL[1] + 20 + Math.sin(t * 0.18 + idx) * 60 - t * 1.5;
    return <Sheet key={idx} x={x} y={y} rot={t * (8 + rnd('sr' + idx) * 10)} label={String(((idx * 7) % 31) + 1)} opacity={1 - t / 60} />;
  });
  const dust = Math.floor(age * 120);
  return (
    <SceneFrame dur={300} fadeIn={0} cam={(t) => ({zoom: keys(t, [0, 300], [1.15, 1.25]), x: keys(t, [0, 300], [-60, 60], EASE), fx: 900, fy: 500})}>
      <Layer depth={0.85}>
        <Calendar x={CAL[0]} y={CAL[1]} label={String(((torn * 7) % 31) + 1)} sub={String(year)} scale={1.5} />
      </Layer>
      <Layer depth={1}>
        <Chair x={1240} y={FLOOR_Y} flip />
        <Hero x={1230} y={FLOOR_Y} frame={0} pose="sit" facing={-1} emotion="empty" saturation={1 - age} age={age} rig={{armF: [36, 112], head: 18}} handItem={<HandPhone rot={160} screen="feed" scroll={f * 2} />} />
        {Array.from({length: dust}).map((_, i) => (
          <circle key={i} cx={1230 + (rnd('dx' + i) - 0.5) * 150} cy={FLOOR_Y - 60 - rnd('dy' + i) * 300} r={1.5 + rnd('dr' + i) * 2} fill="#8a8578" opacity={0.7} />
        ))}
        {sheets}
        {Array.from({length: 18}).map((_, i) => {
          const x = ((f * (20 + (i % 4) * 6) + i * 140) % 2300) - 200;
          const y = 150 + ((i * 97) % 700);
          return <path key={i} d={`M ${x} ${y} q 60 -8 120 0`} stroke="#fff" strokeWidth={2} opacity={0.14} fill="none" />;
        })}
        {Array.from({length: 30}).map((_, i) => {
          const y = ((f * (0.6 + rnd('fy' + i)) + rnd('f0' + i) * 900) % 900) - 50;
          return <circle key={'m' + i} cx={rnd('fx' + i) * 1920} cy={y} r={2} fill="#bdb6a6" opacity={0.35 * ramp(f, 60, 120)} />;
        })}
      </Layer>
      <Sfx name="wind" at={0} volume={0.8} dur={300} />
      <Sfx name="pages" at={0} volume={0.6} dur={300} />
    </SceneFrame>
  );
};
