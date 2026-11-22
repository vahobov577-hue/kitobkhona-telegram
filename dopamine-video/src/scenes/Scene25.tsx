import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FLOOR_Y, FONT_BOLD} from '../theme';
import {EASE_OUT, keys, ramp, rectPath, wobbler} from '../lib';
import {Hero} from '../components/Hero';
import {Book, DrawerBox, Pencil, SunDrawing} from '../components/Things';
import {Chair, Window} from '../components/Props';
import {Layer, SceneFrame, Sfx} from '../components/Stage';

// cuts land on beats of the 100 BPM grid (drop at global 5622, 18 frames per beat)
const CUTS = [0, 42, 96, 132, 186, 222, 276, 312];
const DAYS = [20, 27, 33, 40, 46, 51, 56, 60];
const SCREEN = ['9h', '9h', '6h', '6h', '3h', '3h', '1h', '1h'];

// 5670–6000: fast montage, one cut every ~1.5 s on the beat.
export const Scene25: React.FC = () => {
  const f = useCurrentFrame();
  const idx = CUTS.filter((c) => c <= f).length - 1;
  const lt = f - CUTS[idx]; // local time in the shot
  const sat = keys(idx, [0, 7], [0.6, 1]);
  const age = keys(idx, [0, 7], [0.4, 0]);
  const w = wobbler(f, 'm25', 1);
  const shot = () => {
    switch (idx) {
      case 0: // run — wide, ground streaks
        return (
          <>
            {Array.from({length: 10}).map((_, i) => (
              <line key={i} x1={((i * 260 - f * 28) % 2400) + 2000 - 2400} y1={FLOOR_Y + 20 + (i % 3) * 30} x2={((i * 260 - f * 28) % 2400) + 2140 - 2400} y2={FLOOR_Y + 20 + (i % 3) * 30} stroke="#444" strokeWidth={3} />
            ))}
            <Hero x={960} y={FLOOR_Y} frame={f} pose="run" headband saturation={sat} age={age} emotion="determined" wind={2} />
          </>
        );
      case 1: // reading — medium
        return (
          <>
            <Chair x={960} y={FLOOR_Y} />
            <Hero x={970} y={FLOOR_Y} frame={f} pose="read" headband saturation={sat} age={age} emotion="neutral" handItem={<g transform="translate(10 -6) scale(1.1)"><Book x={0} y={0} open={1} scale={1} /></g>} />
          </>
        );
      case 2: // pushups — low close
        return <Hero x={960} y={FLOOR_Y} frame={f * 1.4} pose="pushup" headband saturation={sat} age={age} emotion="determined" scale={1.6} />;
      case 3: // drawing — top view
        return (
          <>
            <rect x={-500} y={-500} width={3000} height={2200} fill="#3a3a45" />
            <path d={rectPath(w, 560, 170, 800, 620, 4)} fill="#ece6d8" stroke={C.ink} strokeWidth={4} />
            <SunDrawing x={780} y={380} t={1} glow={1} scale={1.2} />
            <path d={w`M 980 560 Q 1060 420 1140 520 Q 1200 600 1280 470`} stroke="#3a3a3a" strokeWidth={5} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(lt, 0, 34)} />
            <g transform={`translate(${1000 + lt * 8} ${560 - lt * 2}) scale(2)`}>
              <Pencil rot={-140} />
            </g>
          </>
        );
      case 4: // cooking — medium
        return (
          <>
            <path d={rectPath(w, 900, FLOOR_Y - 170, 420, 170, 4)} fill={C.furn} stroke={C.ink} strokeWidth={3} />
            <ellipse cx={1110} cy={FLOOR_Y - 182} rx={90} ry={16} fill="#2a2a32" stroke={C.ink} strokeWidth={3} />
            <path d={`M 1200 ${FLOOR_Y - 182} L 1290 ${FLOOR_Y - 190}`} stroke={C.ink} strokeWidth={8} />
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M ${1080 + i * 30} ${FLOOR_Y - 200 - ((lt * 3 + i * 20) % 80)} q 12 -14 0 -28`} stroke="#ddd" strokeWidth={3} fill="none" opacity={0.6} />
            ))}
            <Hero x={830} y={FLOOR_Y} frame={f} pose="stand" headband saturation={sat} age={age} emotion="smile" rig={{armF: [70 + 10 * Math.sin(f * 0.5), 20]}} />
          </>
        );
      case 5: // phone stays in the drawer — calm close
        return <DrawerBox x={960} y={FLOOR_Y + 160} scale={2.2} open={0} />;
      case 6: // the sun enters the room
        return (
          <>
            <polygon points={`1300,330 1500,330 ${1200 - lt * 4},${FLOOR_Y + 200} ${700 - lt * 6},${FLOOR_Y + 200}`} fill={C.sun} opacity={0.16} />
            <Window x={1400} y={330} sky="morning" scale={1} />
            <Hero x={760} y={FLOOR_Y} frame={f} pose="stand" headband saturation={sat} age={age} emotion="smile" />
          </>
        );
      default: // running again, wide, brighter
        return (
          <>
            <rect x={-500} y={FLOOR_Y} width={3000} height={400} fill="#1a1a1a" />
            <Hero x={keys(lt, [0, 18], [700, 1200])} y={FLOOR_Y} frame={f} pose="run" speed={1.3} headband saturation={sat} emotion="smile" wind={2.2} />
          </>
        );
    }
  };
  const zooms = [1.0, 1.25, 1.5, 1.1, 1.2, 1.4, 1.05, 0.95];
  return (
    <SceneFrame
      dur={330}
      fadeIn={0}
      fadeOut={0}
      floor={idx !== 3 && idx !== 5}
      breathe={false}
      cam={() => ({zoom: zooms[idx] * (1 + lt * 0.002), x: (idx % 2 ? 1 : -1) * lt * 1.2, fx: 960, fy: 560})}
      overlay={
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 64, top: 48, fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: '#fff', opacity: 0.85, transform: `translateY(${ramp(lt, 0, 6, -10, 0, EASE_OUT)}px)`}}>DAY {DAYS[idx]}</div>
          <div style={{position: 'absolute', right: 64, top: 44, fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 40, color: '#fff'}}>
            Screen time: <span style={{color: C.screenSoft, display: 'inline-block', transform: `scale(${idx % 2 === 0 ? ramp(lt, 0, 8, 1.4, 1, EASE_OUT) : 1})`}}>{SCREEN[idx]}</span>
          </div>
        </AbsoluteFill>
      }
    >
      <Layer depth={1}>{shot()}</Layer>
      {CUTS.slice(1).map((c) => (
        <Sfx key={c} name="whoosh" at={c - 4} volume={0.35} dur={12} />
      ))}
    </SceneFrame>
  );
};
