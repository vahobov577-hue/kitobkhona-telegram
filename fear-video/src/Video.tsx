import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {C, SCENES, TOTAL} from './theme';
import {AudioOn, musicFile} from './components/Stage';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
import {Scene07} from './scenes/Scene07';
import {Scene08} from './scenes/Scene08';
import {Scene09} from './scenes/Scene09';
import {Scene10} from './scenes/Scene10';
import {Scene11} from './scenes/Scene11';
import {Scene12} from './scenes/Scene12';
import {Scene13} from './scenes/Scene13';
import {Scene14} from './scenes/Scene14';
import {Scene15} from './scenes/Scene15';
import {Scene16} from './scenes/Scene16';
import {Scene17} from './scenes/Scene17';
import {Scene18} from './scenes/Scene18';

const COMPONENTS = [
  Scene01, Scene02, Scene03, Scene04, Scene05, Scene06, Scene07, Scene08, Scene09,
  Scene10, Scene11, Scene12, Scene13, Scene14, Scene15, Scene16, Scene17, Scene18,
];

export type VideoProps = {audio: boolean};

export const Video: React.FC<VideoProps> = ({audio}) => {
  const music = audio ? musicFile() : null;
  const external = music?.endsWith('.mp3');
  return (
    <AudioOn.Provider value={audio}>
      <AbsoluteFill style={{backgroundColor: C.bg}}>
        {SCENES.map(([from, to], i) => {
          const Comp = COMPONENTS[i];
          return (
            <Sequence key={i} from={from} durationInFrames={to - from} name={`Scene ${String(i + 1).padStart(2, '0')}`}>
              <Comp />
            </Sequence>
          );
        })}
        {music ? (
          <Sequence from={0} durationInFrames={TOTAL} name="Music">
            <Audio
              src={staticFile(music)}
              // generated music already has its dynamics baked in; for a user track
              // shape it: swell towards scene 15, calm finale, fade out.
              volume={(f) =>
                external
                  ? interpolate(f, [0, 30, 2190, 3390, 3618, 3750, 4400, 4500], [0, 0.55, 0.6, 0.9, 1, 0.7, 0.55, 0], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    })
                  : 1
              }
            />
          </Sequence>
        ) : null}
      </AbsoluteFill>
    </AudioOn.Provider>
  );
};
