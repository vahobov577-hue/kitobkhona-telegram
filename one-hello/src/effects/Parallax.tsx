import React, {useContext} from 'react';
import {AbsoluteFill} from 'remotion';
import {H, W} from '../theme';
import {CamCtx, VertCtx} from './context';

/**
 * A parallax layer: depth 0 = fixed, 1 = midground, >1 = foreground.
 * `blur` = depth-of-field blur in px (foreground 12–18, background 2–4).
 */
export const Layer: React.FC<{depth?: number; blur?: number; children: React.ReactNode; opacity?: number}> = ({depth = 1, blur = 0, children, opacity = 1}) => {
  const c = useContext(CamCtx);
  const v = useContext(VertCtx);
  const z = 1 + (c.zoom - 1) * depth;
  const cam = `translate(${-c.x * depth}px, ${-c.y * depth}px) rotate(${c.rot * depth}deg) scale(${z})`;
  const s = 1920 / 1080;
  const vt = v.vertical ? `translate(${540 - v.fx * s}px, 0px) scale(${s})` : undefined;
  return (
    <AbsoluteFill style={{transform: vt, transformOrigin: '0 0', opacity}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: cam, transformOrigin: `${c.fx}px ${c.fy}px`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
          {children}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
