import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {rnd} from '../lib';

export const GlitchDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <filter id="glitch-red">
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
    </filter>
    <filter id="glitch-cyan">
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
    </filter>
  </svg>
);

/**
 * RGB-split + sliced displacement. `amount` 0..1 (0 = untouched).
 * Changes every 2 frames so it reads as digital glitch, not blur.
 */
export const Glitch: React.FC<{amount: number; seed?: string; children: React.ReactNode}> = ({amount, seed = 'gl', children}) => {
  const f = useCurrentFrame();
  if (amount <= 0.01) return <AbsoluteFill>{children}</AbsoluteFill>;
  const s = Math.floor(f / 2);
  const off = 4 + 22 * amount;
  const slices = Array.from({length: 7}).map((_, i) => {
    const y0 = rnd(`${seed}y${s}${i}`) * 100;
    const h = 2 + rnd(`${seed}h${s}${i}`) * 9 * amount;
    const dx = (rnd(`${seed}x${s}${i}`) - 0.5) * 160 * amount;
    return {y0, h, dx};
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill>{children}</AbsoluteFill>
      <AbsoluteFill style={{filter: 'url(#glitch-red)', mixBlendMode: 'screen', transform: `translateX(${off}px)`, opacity: 0.85}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{filter: 'url(#glitch-cyan)', mixBlendMode: 'screen', transform: `translateX(${-off}px)`, opacity: 0.85}}>{children}</AbsoluteFill>
      {slices.map((sl, i) => (
        <AbsoluteFill key={i} style={{clipPath: `inset(${sl.y0}% 0 ${Math.max(0, 100 - sl.y0 - sl.h)}% 0)`, transform: `translateX(${sl.dx}px)`}}>
          {children}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};
