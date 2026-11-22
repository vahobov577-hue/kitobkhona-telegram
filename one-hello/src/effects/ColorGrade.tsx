import React from 'react';
import {AbsoluteFill} from 'remotion';

/** Whole-frame grade: saturation + optional warm/cold tint (multiply). */
export const ColorGrade: React.FC<{saturation: number; tint?: string; tintOpacity?: number; children: React.ReactNode}> = ({saturation, tint, tintOpacity = 0, children}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{filter: `saturate(${saturation}) contrast(1.04)`}}>{children}</AbsoluteFill>
    {tint && tintOpacity > 0 ? <AbsoluteFill style={{background: tint, mixBlendMode: 'soft-light', opacity: tintOpacity}} /> : null}
  </AbsoluteFill>
);
