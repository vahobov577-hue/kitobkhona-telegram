import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Vignette: React.FC<{strength?: number}> = ({strength = 1}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.35) 80%, rgba(0,0,0,0.7) 100%)', opacity: strength, pointerEvents: 'none'}} />
);
