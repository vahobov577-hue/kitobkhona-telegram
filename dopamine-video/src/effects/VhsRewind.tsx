import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {noise, rnd} from '../lib';

/** VHS rewind look: jitter, scanlines, tracking bars, chroma fringe, "◀◀ REW" + timecode. */
export const VhsRewind: React.FC<{amount: number; timecode: string; children: React.ReactNode}> = ({amount, timecode, children}) => {
  const f = useCurrentFrame();
  const jx = noise('vhsx', f * 2.3) * 10 * amount;
  const skew = noise('vhss', f * 1.7) * 1.5 * amount;
  const bars = [0, 1, 2].map((i) => ({
    y: ((f * (9 + i * 5) + i * 400) % 1300) - 110,
    h: 30 + rnd('vb' + i) * 70,
  }));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${jx}px) skewX(${skew}deg)`, filter: amount > 0 ? `saturate(${1 - 0.4 * amount}) contrast(${1 + 0.2 * amount})` : undefined}}>
        {children}
      </AbsoluteFill>
      {amount > 0 ? (
        <AbsoluteFill style={{opacity: amount}}>
          <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, transparent 2px, transparent 5px)'}} />
          {bars.map((b, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: b.y,
                height: b.h,
                background: `linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,${0.18 + 0.1 * Math.sin(f + i)}), rgba(111,168,255,0.12), rgba(255,255,255,0.05))`,
                transform: `translateX(${noise('bx' + i, f) * 40}px)`,
              }}
            />
          ))}
          <AbsoluteFill style={{boxShadow: 'inset 0 0 160px rgba(0,0,0,0.8)'}} />
          <div style={{position: 'absolute', left: 70, top: 60, fontFamily: 'monospace', fontWeight: 700, fontSize: 52, color: '#fff', textShadow: '3px 0 #E53935, -3px 0 #6FA8FF', opacity: Math.floor(f / 8) % 2 ? 1 : 0.75}}>
            ◀◀ REW
          </div>
          <div style={{position: 'absolute', right: 80, bottom: 60, fontFamily: 'monospace', fontWeight: 700, fontSize: 44, color: '#fff', textShadow: '3px 0 #E53935, -3px 0 #6FA8FF'}}>
            {timecode}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
