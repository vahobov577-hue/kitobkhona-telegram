import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';

export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
  const f = useCurrentFrame();
  const k = f % 4;
  const ox = (f * 137) % 512;
  const oy = (f * 251) % 512;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile(`grain/g${k}.png`)})`,
        backgroundPosition: `${ox}px ${oy}px`,
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  );
};
