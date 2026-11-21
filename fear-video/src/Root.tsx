import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, TOTAL, W} from './theme';
import {Video, VideoProps} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Fear"
    component={Video}
    durationInFrames={TOTAL}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{audio: true} satisfies VideoProps}
  />
);
