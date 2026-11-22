import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FLOOR_Y} from '../theme';
import {EASE, keys, noise, ramp} from '../lib';
import {Hero} from '../components/Hero';
import {Desk, Window, WallClock} from '../components/Props';
import {DayCounter, Layer, SceneFrame, ShadowText, Sfx} from '../components/Stage';

// 4410–4710: DAY 2 — silence. The room feels huge. Phantom vibration. The walls whisper. He grips the desk.
export const Scene20: React.FC = () => {
  const f = useCurrentFrame();
  const twitch = f > 70 && f < 84 ? Math.sin((f - 70) * 1.6) * 18 : 0;
  const grip = ramp(f, 176, 200, 0, 1, EASE);
  const armF: [number, number] = [keys(grip, [0, 1], [10, 62]) + twitch, keys(grip, [0, 1], [6, 26])];
  return (
    <SceneFrame
      dur={300}
      fadeIn={0}
      cam={(t) => ({zoom: keys(t, [0, 300], [1.45, 0.82], EASE), fx: 960, fy: 600, rot: noise('c20', t * 0.02) * 0.8})}
      overlay={
        <>
          <DayCounter label="DAY 2" />
          <ShadowText text="just check it." from={100} to={172} x={480} y={330} size={70} />
          <ShadowText text="what if you missed something?" from={176} to={290} x={1340} y={250} size={64} />
        </>
      }
    >
      <Layer depth={0.8}>
        <Window x={300} y={300} sky="night" scale={0.8} />
        <WallClock x={1640} y={260} scale={0.9} minute={f * 6} hour={60} />
      </Layer>
      <Layer depth={1}>
        <Desk x={1080} y={FLOOR_Y} width={360} />
        <rect x={1160} y={FLOOR_Y - 98} width={116} height={4} fill={C.red} opacity={0.4 + 0.2 * Math.sin(f * 0.3)} style={{filter: 'blur(3px)'}} />
        <Hero x={900} y={FLOOR_Y} frame={f} pose="stand" emotion={f < 70 ? 'neutral' : 'scared'} rig={{armF, body: 8 * grip}} tremble={ramp(f, 180, 220, 0, 2.5)} saturation={0.75} age={0.35} />
        {f > 68 && f < 96 ? (
          <g opacity={1 - (f - 68) / 28}>
            {[0, 1].map((i) => (
              <path key={i} d={`M ${930 + i * 14} ${FLOOR_Y - 160} q 8 8 0 16 M ${880 - i * 14} ${FLOOR_Y - 160} q -8 8 0 16`} stroke="#fff" strokeWidth={3} fill="none" />
            ))}
          </g>
        ) : null}
      </Layer>
      <Sfx name="phantom" at={70} volume={0.6} />
      <Sfx name="whisper" at={96} volume={0.8} />
      <Sfx name="whisper" at={172} volume={0.9} />
      <Sfx name="tick" at={0} volume={0.3} dur={10} />
      <Sfx name="tick" at={30} volume={0.3} dur={10} />
    </SceneFrame>
  );
};
