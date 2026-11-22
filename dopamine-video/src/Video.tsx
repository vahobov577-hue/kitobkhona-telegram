import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {C, SCENES, TOTAL} from './theme';
import {AudioOn, musicFile} from './components/Stage';
import {GlitchDefs} from './effects/Glitch';
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
import {Scene19} from './scenes/Scene19';
import {Scene20} from './scenes/Scene20';
import {Scene21} from './scenes/Scene21';
import {Scene22} from './scenes/Scene22';
import {Scene23} from './scenes/Scene23';
import {Scene24} from './scenes/Scene24';
import {Scene25} from './scenes/Scene25';
import {Scene26} from './scenes/Scene26';
import {Scene27} from './scenes/Scene27';
import {Scene28} from './scenes/Scene28';
import {Scene29} from './scenes/Scene29';
import {Scene30} from './scenes/Scene30';
import {Scene31} from './scenes/Scene31';
import {Scene32} from './scenes/Scene32';

const COMPONENTS = [Scene01, Scene02, Scene03, Scene04, Scene05, Scene06, Scene07, Scene08, Scene09, Scene10, Scene11, Scene12, Scene13, Scene14, Scene15, Scene16, Scene17, Scene18, Scene19, Scene20, Scene21, Scene22, Scene23, Scene24, Scene25, Scene26, Scene27, Scene28, Scene29, Scene30, Scene31, Scene32];

export type VideoProps = {audio: boolean};

// a user-supplied music.mp3 gets the same dramaturgy: one bar of silence at 0:39,
// full silence 2:00–2:10, quiet under the piano, peak at scene 28, fade at the end
const externalVolume = (f: number) => {
  if (f >= 1170 && f < 1242) return 0;
  if (f >= 3540 && f < 3900) return 0;
  return interpolate(f, [0, 450, 3540, 3900, 5190, 5622, 6774, 7800, 8040, 8100], [0.9, 0.55, 0.6, 0.35, 0.45, 0.8, 1, 0.6, 0.4, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

export const Video: React.FC<VideoProps> = ({audio}) => {
  const music = audio ? musicFile() : null;
  const external = music?.endsWith('.mp3');
  return (
    <AudioOn.Provider value={audio}>
      <AbsoluteFill style={{backgroundColor: C.bg}}>
        <GlitchDefs />
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
            <Audio src={staticFile(music)} volume={(f) => (external ? externalVolume(f) : 0.8)} />
          </Sequence>
        ) : null}
      </AbsoluteFill>
    </AudioOn.Provider>
  );
};
