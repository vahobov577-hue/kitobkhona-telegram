import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FONT_SERIF} from './theme';
import {EASE_OUT, ramp} from './lib';
import {AudioOn, ShotCtx, VertCtx} from './effects/context';
import {musicFile} from './effects/Shot';
import {SHOTS} from './Video';
import {SCENES} from './scenes';

type Seg = {scene: string; idx: number; fx: number};
const END = 60;

const EndCard: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 84, color: '#f2f0ea', textAlign: 'center', padding: '0 80px', opacity: ramp(t, 4, 18, 0, 1, EASE_OUT)}}>
        Full film on the channel
      </div>
    </AbsoluteFill>
  );
};

export const shortLength = (segs: Seg[]) => segs.reduce((a, s) => a + (SHOTS.find((x) => x.scene === s.scene && x.idx === s.idx)?.d ?? 0), 0) + END;

/** vertical 1080×1920 cut-down made of the film's own shots */
export const ShortVideo: React.FC<{segs: Seg[]; audio?: boolean}> = ({segs, audio = true}) => {
  const music = audio ? musicFile() : null;
  let pos = 0;
  const items = segs.map((s, i) => {
    const shot = SHOTS.find((x) => x.scene === s.scene && x.idx === s.idx)!;
    const from = pos;
    pos += shot.d;
    const Comp = SCENES[s.scene][s.idx];
    return (
      <Sequence key={i} from={from} durationInFrames={shot.d}>
        <VertCtx.Provider value={{vertical: true, fx: s.fx}}>
          <ShotCtx.Provider value={{g0: shot.from, d: shot.d}}>
            <Comp />
          </ShotCtx.Provider>
        </VertCtx.Provider>
        {music ? <Audio src={staticFile(music)} startFrom={shot.from} endAt={shot.from + shot.d} volume={0.85} /> : null}
      </Sequence>
    );
  });
  return (
    <AudioOn.Provider value={audio}>
      <AbsoluteFill style={{background: '#000'}}>
        {items}
        <Sequence from={pos} durationInFrames={END}>
          <EndCard />
        </Sequence>
      </AbsoluteFill>
    </AudioOn.Provider>
  );
};

export const SHORT1: Seg[] = [
  {scene: 'S01', idx: 0, fx: 960},
  {scene: 'S01', idx: 1, fx: 960},
  {scene: 'S02', idx: 0, fx: 960},
  {scene: 'S02', idx: 1, fx: 960},
  {scene: 'S03', idx: 0, fx: 1250},
  {scene: 'S03', idx: 1, fx: 960},
  {scene: 'S04', idx: 0, fx: 960},
  {scene: 'S04', idx: 1, fx: 960},
  {scene: 'S05', idx: 0, fx: 960},
];
export const SHORT2: Seg[] = [
  {scene: 'S11', idx: 0, fx: 660},
  {scene: 'S11', idx: 1, fx: 960},
  {scene: 'S11', idx: 2, fx: 700},
  {scene: 'S12', idx: 3, fx: 960},
  {scene: 'S13', idx: 0, fx: 880},
  {scene: 'S13', idx: 1, fx: 960},
  {scene: 'S13', idx: 2, fx: 960},
];
export const SHORT3: Seg[] = [
  {scene: 'S26', idx: 0, fx: 700},
  {scene: 'S26', idx: 1, fx: 960},
  {scene: 'S26', idx: 2, fx: 860},
  {scene: 'S27', idx: 0, fx: 960},
  {scene: 'S27', idx: 1, fx: 960},
  {scene: 'S27', idx: 2, fx: 900},
];
