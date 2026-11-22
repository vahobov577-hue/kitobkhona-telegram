import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {TIMELINE} from './timeline';
import {TOTAL} from './theme';
import {AudioOn, ShotCtx} from './effects/context';
import {musicFile} from './effects/Shot';
import {SCENES} from './scenes';

export type VideoProps = {audio: boolean};

/** flatten timeline → shots with global start frames */
export const SHOTS = (() => {
  const out: {scene: string; idx: number; from: number; d: number; type: string}[] = [];
  for (const [id, start, shots] of TIMELINE) {
    let pos = start;
    shots.forEach(([d, type], idx) => {
      out.push({scene: id, idx, from: pos, d, type});
      pos += d;
    });
  }
  return out;
})();

// user track: keep the silent bar at 0:40 and the silence of S27 (3:23–3:35)
const externalVolume = (f: number) => {
  if (f >= 1200 && f < 1260) return 0;
  if (f >= 6090 && f < 6450) return 0;
  return interpolate(f, [0, 2250, 4950, 6450, 8160, 8460, 8940, 9000], [0.5, 0.6, 0.75, 0.6, 1, 0.8, 0.6, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

export const ShotView: React.FC<{scene: string; idx: number; from: number; d: number}> = ({scene, idx, from, d}) => {
  const list = SCENES[scene];
  const Comp = list?.[idx];
  return <ShotCtx.Provider value={{g0: from, d}}>{Comp ? <Comp /> : <AbsoluteFill style={{background: '#300'}} />}</ShotCtx.Provider>;
};

export const Video: React.FC<VideoProps> = ({audio}) => {
  const music = audio ? musicFile() : null;
  const external = music?.endsWith('.mp3');
  return (
    <AudioOn.Provider value={audio}>
      <AbsoluteFill style={{background: '#000'}}>
        {SHOTS.map((s) => (
          <Sequence key={s.scene + s.idx} from={s.from} durationInFrames={s.d} name={`${s.scene}.${s.idx + 1} ${s.type}`}>
            <ShotView {...s} />
          </Sequence>
        ))}
        {music ? (
          <Sequence from={0} durationInFrames={TOTAL} name="Music">
            <Audio src={staticFile(music)} volume={(f) => (external ? externalVolume(f) : 0.85)} />
          </Sequence>
        ) : null}
      </AbsoluteFill>
    </AudioOn.Provider>
  );
};
