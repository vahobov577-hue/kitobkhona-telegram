import React from 'react';
import {AbsoluteFill, Freeze, useCurrentFrame} from 'remotion';
import {ramp} from '../lib';

/**
 * Freezes the children at local frame `at` and drains the colour
 * (grayscale + a little contrast) over `drain` frames.
 */
export const FreezeFrame: React.FC<{at: number; drain?: number; children: React.ReactNode}> = ({at, drain = 10, children}) => {
  const f = useCurrentFrame();
  const g = ramp(f, at, at + drain);
  const inner = f >= at ? <Freeze frame={at}>{children}</Freeze> : children;
  return (
    <AbsoluteFill style={{filter: g > 0 ? `grayscale(${g}) contrast(${1 + 0.15 * g}) brightness(${1 - 0.25 * g})` : undefined}}>
      {inner}
      {f >= at && f < at + 3 ? <AbsoluteFill style={{backgroundColor: '#fff', opacity: 0.6 - (f - at) * 0.2}} /> : null}
    </AbsoluteFill>
  );
};
