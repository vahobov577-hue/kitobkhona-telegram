import React from 'react';
import {Layer} from './Parallax';

/** Convenience layers for the reference look: soft background, sharp subject, very soft foreground. */
export const Background: React.FC<{children: React.ReactNode; depth?: number; blur?: number}> = ({children, depth = 0.7, blur = 3}) => (
  <Layer depth={depth} blur={blur}>
    {children}
  </Layer>
);
export const Subject: React.FC<{children: React.ReactNode}> = ({children}) => <Layer depth={1}>{children}</Layer>;
export const Foreground: React.FC<{children: React.ReactNode; depth?: number; blur?: number}> = ({children, depth = 1.35, blur = 15}) => (
  <Layer depth={depth} blur={blur}>
    {children}
  </Layer>
);
