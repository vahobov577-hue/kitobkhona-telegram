import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE, EASE_IN, keys, ramp} from '../lib';
import {Narration, SceneFrame, Sfx} from '../components/Stage';
import {VhsRewind} from '../effects/VhsRewind';
import {Showdown} from './Showdown';
import {Bedroom} from './Room';

const CUT = 100; // rewind lands in the quiet room

// 240–390: VHS rewind — everything flies backwards, then a quiet room and a small phone.
export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const p = ramp(f, 0, CUT, 0, 1, EASE_IN);
  const days = Math.round(keys(f, [0, CUT], [730, 0], EASE_IN));
  const h = 23 - Math.floor((f * 7) % 24);
  const tc = `DAY ${String(days).padStart(3, '0')}  ${String(Math.abs(h)).padStart(2, '0')}:${String(59 - ((f * 13) % 60)).padStart(2, '0')}`;
  const vhs = f < CUT ? 1 : ramp(f, CUT, CUT + 14, 1, 0);
  return (
    <SceneFrame
      dur={150}
      fadeIn={0}
      fadeOut={0}
      floor={f >= CUT}
      breathe={false}
      cam={(t) => (t < CUT ? {zoom: keys(t, [0, CUT], [1.5, 0.95]), fx: 1020, fy: 520, rot: keys(t, [0, CUT], [0, 6])} : {zoom: keys(t, [CUT, 150], [1.5, 1.75], EASE), fx: 1150, fy: 640})}
      overlay={<Narration text="How did it start?" from={CUT + 14} to={150} y={150} size={72} fadeOut={2} />}
    >
      <VhsRewind amount={vhs} timecode={tc}>
        {f < CUT ? (
          <Showdown
            frame={240 - f * 3}
            heroX={keys(f, [0, CUT], [760, 260])}
            heroPose="walk"
            heroSpeed={-2.5}
            monsterScale={keys(f, [0, CUT], [6, 0.4], EASE_IN)}
            monsterY={keys(f, [0, CUT], [700, 760])}
            grow={keys(f, [0, CUT * 0.6], [1, 0])}
            roar={1 - p}
            sag={10}
            clockSpin={-f * 40}
          />
        ) : (
          <Bedroom phoneGlow={0.5 + 0.3 * Math.sin(f * 0.3)} />
        )}
      </VhsRewind>
      <Sfx name="rewind" at={0} volume={0.9} />
    </SceneFrame>
  );
};
