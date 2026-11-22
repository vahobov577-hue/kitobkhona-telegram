import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, TOTAL, W} from './theme';
import {Video, VideoProps} from './Video';
import {Thumbnail} from './Thumbnail';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Dopamine" component={Video} durationInFrames={TOTAL} fps={FPS} width={W} height={H} defaultProps={{audio: true} satisfies VideoProps} />
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={1280} height={720} />
  </>
);
