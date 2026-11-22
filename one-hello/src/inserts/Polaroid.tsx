import React from 'react';
import {C, FONT_HAND} from '../theme';

/** polaroid photo flipping from back (flip 0) to front (flip 1); content drawn in a 400×400 box centred at 0,-40 */
export const Polaroid: React.FC<{x: number; y: number; s?: number; rot?: number; flip: number; caption?: string; children: React.ReactNode}> = ({x, y, s = 1, rot = 0, flip, caption, children}) => {
  const sx = Math.cos(Math.PI * (1 - flip));
  const front = sx > 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * Math.max(0.02, Math.abs(sx))} ${s})`}>
      <rect x={-240 + 10} y={-300 + 14} width={480} height={580} fill="#000" opacity={0.25} />
      <rect x={-240} y={-300} width={480} height={580} fill="#f6f1e6" />
      {front ? (
        <g>
          <clipPath id={`pl${Math.round(x)}${Math.round(y)}`}>
            <rect x={-210} y={-270} width={420} height={420} />
          </clipPath>
          <g clipPath={`url(#pl${Math.round(x)}${Math.round(y)})`}>
            <g transform="translate(-373.5 -270) scale(0.3889)">{children}</g>
            <rect x={-210} y={-270} width={420} height={420} fill="#ffcf8a" opacity={0.18} />
          </g>
          {caption ? <text x={0} y={230} textAnchor="middle" fontFamily={FONT_HAND} fontSize={34} fill="#555">{caption}</text> : null}
        </g>
      ) : (
        <text x={0} y={20} textAnchor="middle" fontFamily={FONT_HAND} fontSize={30} fill="#b9b2a2">2014</text>
      )}
    </g>
  );
};
export {C};
