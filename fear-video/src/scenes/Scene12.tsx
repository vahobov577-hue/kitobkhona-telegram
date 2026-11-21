import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FLOOR_Y, FONT_BOLD} from '../theme';
import {EASE, EASE_IN, EASE_OUT, keys, noise, ramp, rnd} from '../lib';
import {Hero} from '../components/Hero';
import {DayCounter, Layer, SceneFrame, Sfx} from '../components/Stage';

const HX = 1150;
const WORDS = ['cringe', 'quit', 'lol'];
const LAUNCH = [30, 58, 86];
const FLY = 20;
const CHEST_Y = FLOOR_Y - 150 * 1.3;

// 2550–2850: DAY 21 — red words fly like arrows, he falls, "3… 2… 1", gets up.
export const Scene12: React.FC = () => {
  const f = useCurrentFrame();
  const hits = LAUNCH.map((l) => l + FLY);
  const recoil = hits.slice(0, 2).reduce((acc, h) => acc + (f >= h ? ramp(f, h, h + 3, 0, 1) * ramp(f, h + 3, h + 16, 1, 0) : 0), 0);
  const fall = ramp(f, hits[2], hits[2] + 22, 0, 1, EASE_IN);
  const rise = ramp(f, 218, 262, 0, 1, EASE);
  const rot = 80 * fall * (1 - rise);
  const down = fall > 0.99 && rise < 0.01;
  const shakeA = hits.reduce((a, h) => a + (f >= h ? ramp(f, h, h + 10, 7, 0) : 0), 0) + (f >= hits[2] + 22 ? ramp(f, hits[2] + 22, hits[2] + 34, 10, 0) : 0);
  const count = [
    {n: '3', at: 140},
    {n: '2', at: 170},
    {n: '1', at: 200},
  ];
  return (
    <SceneFrame
      dur={300}
      cam={(t) => ({zoom: keys(t, [0, 300], [1.05, 1.12]), x: noise('c12', t * 1.5) * shakeA + keys(t, [0, 300], [-30, 30]), y: noise('c12y', t * 1.5) * shakeA, fx: 1000, fy: 560})}
      overlay={
        <>
          <DayCounter label="DAY 21" />
          <AbsoluteFill>
            {count.map((c) => {
              if (f < c.at || f > c.at + 30) return null;
              const p = f - c.at;
              const op = Math.min(ramp(p, 0, 4), ramp(p, 22, 30, 1, 0));
              const sc = ramp(p, 0, 10, 1.35, 1, EASE_OUT);
              return (
                <div key={c.n} style={{position: 'absolute', top: 260, width: 1920, textAlign: 'center', fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 190, color: '#fff', opacity: op, transform: `scale(${sc})`}}>
                  {c.n}
                </div>
              );
            })}
          </AbsoluteFill>
        </>
      }
    >
      <Layer depth={1}>
        <defs>
          <filter id="mb12" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="22 0" />
          </filter>
        </defs>
        <Hero
          x={HX + recoil * 14 + fall * 30 * (1 - rise)}
          y={FLOOR_Y}
          frame={f}
          facing={-1}
          pose={fall > 0 && rise < 1 ? 'fall' : 'stand'}
          poseTo={fall > 0 && rise < 1 ? 'stand' : undefined}
          poseT={rise}
          rig={down ? {armF: [60, 30], armB: [-40, -20], legF: [10, 6], legB: [-6, 0], head: -4} : fall > 0 ? undefined : {body: -recoil * 12}}
          rot={rot}
          pivot={[0, -46]}
          headband
          emotion={fall > 0.2 && rise < 0.6 ? 'tired' : recoil > 0.2 ? 'scared' : 'determined'}
          wind={1.3}
        />
        {WORDS.map((wd, i) => {
          const l = LAUNCH[i];
          const h = hits[i];
          if (f < l) return null;
          if (f < h) {
            const p = ramp(f, l, h, 0, 1, EASE_IN);
            const x = -240 + (HX - 70 - -240) * p;
            const y = CHEST_Y - 10 + i * 8 + Math.sin(p * Math.PI) * -30;
            return (
              <g key={wd} transform={`translate(${x} ${y})`}>
                <text x={-40} y={0} textAnchor="end" fontFamily={FONT_BOLD} fontWeight={700} fontSize={70} fill={C.red} filter="url(#mb12)" opacity={0.8}>
                  {wd}
                </text>
                <line x1={-420} y1={-20} x2={-10} y2={-20} stroke={C.red} strokeWidth={3} opacity={0.35} strokeLinecap="round" />
                <text x={0} y={0} textAnchor="end" fontFamily={FONT_BOLD} fontWeight={700} fontSize={70} fill={C.red} style={{filter: 'drop-shadow(0 0 8px rgba(229,57,53,0.7))'}}>
                  {wd}
                </text>
              </g>
            );
          }
          const p = ramp(f, h, h + 26, 0, 1, EASE_OUT);
          if (p >= 1) return null;
          return (
            <g key={wd}>
              {Array.from({length: 14}).map((_, k) => {
                const a = Math.PI + (rnd(wd + k) - 0.5) * 2.2;
                const dist = 40 + rnd(wd + 'd' + k) * 150;
                return (
                  <rect
                    key={k}
                    x={HX - 70 + Math.cos(a) * dist * p}
                    y={CHEST_Y - 30 + Math.sin(a) * dist * p + p * p * 60}
                    width={10}
                    height={4}
                    fill={C.red}
                    opacity={1 - p}
                    transform={`rotate(${k * 47 + p * 300} ${HX - 70 + Math.cos(a) * dist * p} ${CHEST_Y - 30 + Math.sin(a) * dist * p})`}
                  />
                );
              })}
            </g>
          );
        })}
      </Layer>
      {LAUNCH.map((l, i) => (
        <Sfx key={'w' + i} name="whistle" at={l} volume={0.7} />
      ))}
      {hits.map((h, i) => (
        <Sfx key={'h' + i} name="hit" at={h} volume={0.8} />
      ))}
      <Sfx name="thud" at={hits[2] + 22} volume={0.9} />
      {count.map((c) => (
        <Sfx key={c.n} name="tick" at={c.at} volume={0.8} />
      ))}
    </SceneFrame>
  );
};
