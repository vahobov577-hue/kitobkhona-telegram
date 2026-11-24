import React from 'react';
import {rnd} from '../lib';
import {Glow, StreetLamp, Tree, VGrad} from './common';

export type Sky = 'dawn' | 'grey' | 'night' | 'day';
export const SIDEWALK_Y = 860;

/** sky gradient */
export const SkyBg: React.FC<{sky: Sky}> = ({sky}) => {
  const c = sky === 'dawn' ? ['#7d8fb0', '#f2c39a'] : sky === 'night' ? ['#0f1420', '#262c3a'] : sky === 'day' ? ['#7fb6e6', '#d6ecf8'] : ['#a9afb5', '#d7d9db'];
  return <VGrad x={-1500} y={-600} w={5000} h={1700} top={c[0]} bottom={c[1]} />;
};

/** far row of houses (background layer), repeats horizontally with `offset` (parallax by scrolling) */
export const Houses: React.FC<{offset?: number; y?: number; sky: Sky; seed?: string; scale?: number}> = ({offset = 0, y = SIDEWALK_Y - 40, sky, seed = 'hs', scale = 1}) => {
  const dark = sky === 'night';
  const N = 14;
  const span = 320 * scale;
  return (
    <g>
      {Array.from({length: N}).map((_, i) => {
        const x = (((i * span - offset) % (N * span)) + N * span) % (N * span) - 2 * span;
        const h = (200 + rnd(seed + i) * 160) * scale;
        const w = 260 * scale;
        const c = dark ? ['#262a33', '#2d313b'][i % 2] : ['#b7aa98', '#c8c3ba', '#a8a19a', '#bfb6a6'][i % 4];
        return (
          <g key={i}>
            <rect x={x} y={y - h} width={w} height={h} fill={c} />
            <path d={`M ${x - 10} ${y - h} L ${x + w / 2} ${y - h - 70 * scale} L ${x + w + 10} ${y - h} Z`} fill={dark ? '#1d2027' : '#7e756d'} />
            {[0, 1].map((r) =>
              [0, 1, 2].map((c2) => (
                <rect key={r + '' + c2} x={x + 30 * scale + c2 * 72 * scale} y={y - h + 40 * scale + r * 80 * scale} width={40 * scale} height={46 * scale} fill={dark ? (rnd(seed + i + r + c2) > 0.4 ? '#ffd48a' : '#1a1c22') : '#8e99a2'} opacity={0.85} />
              )),
            )}
          </g>
        );
      })}
    </g>
  );
};

/** sidewalk + road + lamps + trees in the midground; `offset` scrolls for running shots */
export const StreetFront: React.FC<{sky: Sky; offset?: number; lamps?: number; leaves?: number; trees?: boolean}> = ({sky, offset = 0, lamps = 0, leaves = 0, trees = true}) => {
  const dark = sky === 'night';
  const lampSpan = 900;
  const treeSpan = 640;
  return (
    <g>
      <rect x={-1500} y={SIDEWALK_Y} width={5000} height={60} fill={dark ? '#2a2d33' : '#a3a29e'} />
      <rect x={-1500} y={SIDEWALK_Y + 60} width={5000} height={400} fill={dark ? '#1b1d22' : '#6f7173'} />
      {Array.from({length: 30}).map((_, i) => {
        const x = (((i * 180 - offset) % 5400) + 5400) % 5400 - 1500;
        return <rect key={i} x={x} y={SIDEWALK_Y + 140} width={90} height={8} fill="#e8e6df" opacity={0.6} />;
      })}
      {trees
        ? Array.from({length: 9}).map((_, i) => {
            const x = (((i * treeSpan - offset + 200) % (9 * treeSpan)) + 9 * treeSpan) % (9 * treeSpan) - 1200;
            const col = leaves > 0.5 ? ['#d9832f', '#e0a33d'] : leaves > 0 ? ['#a7955a', '#8f8a5a'] : dark ? ['#20262a', '#1a1f22'] : ['#6f7d5e', '#5b6a4c'];
            return <Tree key={i} x={x} y={SIDEWALK_Y + 10} s={0.9} color={col[0]} color2={col[1]} />;
          })
        : null}
      {Array.from({length: 7}).map((_, i) => {
        const x = (((i * lampSpan - offset) % (7 * lampSpan)) + 7 * lampSpan) % (7 * lampSpan) - 1200;
        return <StreetLamp key={i} x={x} y={SIDEWALK_Y + 10} on={lamps} />;
      })}
    </g>
  );
};

export {Glow};
