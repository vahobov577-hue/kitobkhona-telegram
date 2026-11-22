import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, TOTAL, W} from './theme';
import {Video, VideoProps} from './Video';
import {Thumbnail} from './Thumbnail';
import {SHORT1, SHORT2, SHORT3, shortLength, ShortVideo} from './Shorts';

const S1: React.FC = () => <ShortVideo segs={SHORT1} />;
const S2: React.FC = () => <ShortVideo segs={SHORT2} />;
const S3: React.FC = () => <ShortVideo segs={SHORT3} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="OneHello" component={Video} durationInFrames={TOTAL} fps={FPS} width={W} height={H} defaultProps={{audio: true} satisfies VideoProps} />
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Short1" component={S1} durationInFrames={shortLength(SHORT1)} fps={FPS} width={1080} height={1920} />
    <Composition id="Short2" component={S2} durationInFrames={shortLength(SHORT2)} fps={FPS} width={1080} height={1920} />
    <Composition id="Short3" component={S3} durationInFrames={shortLength(SHORT3)} fps={FPS} width={1080} height={1920} />
  </>
);
