import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FLOOR_Y} from '../theme';
import {EASE, EASE_OUT, keys, ramp} from '../lib';
import {Hero, heroJoint} from '../components/Hero';
import {Chain} from '../components/Monster';
import {HandPhone} from '../components/Things';
import {Layer, SceneFrame, Sfx} from '../components/Stage';
import {cameraShake, hitEnvelope} from '../effects/CameraShake';
import {Bedroom, NS_TOP, NS_X} from './Room';

const CLICK = 58; // in the bar of silence (0:39)

// 1170–1380: HOOK 0:39 — morning, alarm, eyes still closed he reaches… CLICK: a thin red chain on his wrist.
export const Scene08: React.FC = () => {
  const f = useCurrentFrame();
  const reach = ramp(f, 14, 50, 0, 1, EASE);
  const grabbed = f >= 52;
  const hp = {x: 960, y: FLOOR_Y - 92, frame: f, pose: 'lieBed' as const, scale: 1.3, rig: {armF: [10 + 160 * reach, grabbed ? -20 : 0] as [number, number]}};
  // lying figure is rotated 90° inside Hero, so take the wrist from the rotated frame
  const wristRaw = heroJoint(hp, 'haF');
  const wrist: [number, number] = [hp.x + (-(wristRaw[1] - hp.y)) - 118 * 1.3 + 0, hp.y + (wristRaw[0] - hp.x) - 40 * 1.3];
  const phonePos: [number, number] = grabbed ? [wrist[0] + 8, wrist[1] - 14] : [NS_X - 26, NS_TOP - 4];
  const snapZoom = f < CLICK ? 1 : keys(f, [CLICK, CLICK + 4, CLICK + 60, 210], [1, 1.9, 1.75, 1.15], EASE_OUT);
  const sh = cameraShake(f, hitEnvelope(f, CLICK, 8, 10), 'c8');
  return (
    <SceneFrame
      dur={210}
      cam={(t) => ({zoom: snapZoom * keys(t, [0, 50], [1.05, 1.1]), fx: t < CLICK ? 1000 : wrist[0], fy: t < CLICK ? 560 : wrist[1], x: sh.x, y: sh.y, rot: sh.rot})}
      overlay={f >= CLICK && f < CLICK + 3 ? <AbsoluteFill style={{background: C.red, opacity: 0.35}} /> : null}
    >
      <Bedroom sky="morning" alarm="07:00" phone={false} clockMin={0} clockHour={210} />
      <Layer depth={1}>
        <Hero {...hp} emotion="bored" eyesClosed={f < 120} />
        {f >= CLICK ? (
          <g>
            <Chain from={[wrist[0], wrist[1]]} to={[phonePos[0] + 40, phonePos[1] + 30]} sag={30} width={3.5} link={14} grow={ramp(f, CLICK, CLICK + 6)} seed="w8" />
            <circle cx={wrist[0]} cy={wrist[1]} r={11} fill="none" stroke={C.red} strokeWidth={5} />
          </g>
        ) : null}
        <g transform={`translate(${phonePos[0]} ${phonePos[1]})`}>
          <HandPhone rot={grabbed ? -10 : -90} scale={1.3} screen={grabbed && f > 120 ? 'feed' : 'notif'} scroll={f} glow={grabbed ? ramp(f, 120, 140) : 0} buzz={f < 14 ? 1 : 0} />
        </g>
        {f < 50 ? (
          <g opacity={0.8}>
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M ${NS_X + 26 - 30 - i * 10} ${NS_TOP - 50 - i * 8} q -8 10 0 20`} stroke="#fff" strokeWidth={3} fill="none" opacity={Math.abs(Math.sin(f * 0.5 + i))} />
            ))}
          </g>
        ) : null}
      </Layer>
      <Sfx name="alarm" at={0} volume={0.7} dur={50} />
      <Sfx name="chainclick" at={CLICK} volume={1} />
    </SceneFrame>
  );
};
