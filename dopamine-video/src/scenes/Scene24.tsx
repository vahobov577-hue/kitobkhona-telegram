import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FLOOR_Y, SYNC} from '../theme';
import {EASE, EASE_IN, keys, ramp} from '../lib';
import {Hero, heroJoint} from '../components/Hero';
import {HandPhone} from '../components/Things';
import {Chair, Desk} from '../components/Props';
import {Layer, SceneFrame, Sfx} from '../components/Stage';
import {cameraShake, hitEnvelope} from '../effects/CameraShake';

const SLAM = 22;
const DROP = SYNC.drop - 5430; // 192: close-up of the eyes lands on the drop
const DESK_TOP = FLOOR_Y - 129 * 1.3;

// 5430–5670: he slams the phone face down, stands, ties the red headband. Close-up of the eyes — the drop.
export const Scene24: React.FC = () => {
  const f = useCurrentFrame();
  const slamArm = keys(f, [0, SLAM - 4, SLAM, SLAM + 20], [140, 150, 80, 60], EASE_IN);
  const stand = ramp(f, 40, 70, 0, 1, EASE);
  const tie = ramp(f, 74, 150, 0, 1, EASE);
  const pose = f < 40 ? 'sitDesk' : f < 74 ? 'sitDesk' : 'tie';
  const hp = {
    x: 860,
    y: FLOOR_Y,
    frame: f,
    pose: pose as 'sitDesk' | 'tie',
    poseTo: f < 74 ? ('stand' as const) : ('stand' as const),
    poseT: f < 74 ? stand : ramp(f, 150, 172, 0, 1, EASE),
    scale: 1.3,
    rig: f < 40 ? {armF: [slamArm, 10] as [number, number]} : undefined,
  };
  const head = heroJoint(hp, 'head');
  const sh = cameraShake(f, hitEnvelope(f, SLAM, 12, 12) + hitEnvelope(f, DROP, 10, 14), 'c24');
  const close = ramp(f, DROP - 4, DROP, 0, 1, EASE_IN);
  return (
    <SceneFrame
      dur={240}
      cam={(t) => ({zoom: keys(t, [0, DROP - 4, DROP, 240], [1.15, 1.35, 4.2, 4.5]), fx: keys(t, [0, DROP - 4], [920, head[0]]), fy: keys(t, [0, DROP - 4], [560, head[1] - 4]), x: sh.x, y: sh.y, rot: sh.rot})}
      overlay={close > 0.9 ? <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 90%)'}} /> : null}
    >
      <Layer depth={1}>
        <Chair x={850} y={FLOOR_Y} />
        <Desk x={1120} y={FLOOR_Y} width={420} />
        <g transform={`translate(${f < SLAM ? heroJoint({...hp}, 'haF')[0] : 1010} ${f < SLAM ? heroJoint({...hp}, 'haF')[1] : DESK_TOP - 3})`}>
          <HandPhone rot={f < SLAM ? -60 : -90} scale={1.3} screen="feed" faceDown={f >= SLAM} />
        </g>
        {f >= SLAM && f < SLAM + 10 ? (
          <g opacity={1 - (f - SLAM) / 10}>
            <path d={`M 960 ${DESK_TOP - 20} l -30 -20 M 1060 ${DESK_TOP - 20} l 30 -20 M 1010 ${DESK_TOP - 30} l 0 -30`} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
          </g>
        ) : null}
        <Hero {...hp} emotion={f < SLAM ? 'empty' : 'determined'} headband={f > 74} headbandT={tie} wind={1.2} />
      </Layer>
      <Sfx name="slam" at={SLAM} volume={1} />
      <Sfx name="tie" at={80} volume={0.6} />
      <Sfx name="impact" at={DROP} volume={0.6} />
    </SceneFrame>
  );
};
