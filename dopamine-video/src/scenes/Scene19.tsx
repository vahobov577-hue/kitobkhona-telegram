import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_BOLD} from '../theme';
import {EASE, keys, ramp} from '../lib';
import {DrawerBox, HandPhone} from '../components/Things';
import {Layer, SceneFrame, Sfx} from '../components/Stage';
import {cameraShake, hitEnvelope} from '../effects/CameraShake';

const HIT = 150;
const DX = 960;
const DY = 900;
const S = 2.4;

// 4200–4410: close-up — the phone goes into the drawer. The drawer shakes, red light leaks. "DAY 1."
export const Scene19: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const open = keys(f, [0, 52, 78], [1, 1, 0], EASE);
  const lower = ramp(f, 6, 46, 0, 1, EASE);
  const handY = keys(f, [0, 46, 60, 66, 78, 96], [-200, DY - 330, DY - 330, DY - 250, DY - 250, -300], EASE);
  const handX = keys(f, [46, 60, 78], [DX, DX - 40, DX - 40]);
  const shake = f > 92 ? ramp(f, 92, 110) * (1 + 0.5 * Math.sin(f * 0.4)) : 0;
  const leak = ramp(f, 96, 120);
  const s = spring({frame: f - HIT, fps, config: {damping: 11, stiffness: 160, mass: 0.7}});
  const sh = cameraShake(f, hitEnvelope(f, HIT, 14, 16) + shake * 2, 'c19');
  return (
    <SceneFrame
      dur={210}
      floor={false}
      cam={(t) => ({zoom: keys(t, [0, 210], [1.0, 1.12]), x: sh.x, y: sh.y, rot: sh.rot, fx: DX, fy: DY - 200})}
      overlay={
        f >= HIT ? (
          <AbsoluteFill>
            <div style={{position: 'absolute', top: 150, width: 1920, textAlign: 'center', fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 210, color: '#fff', letterSpacing: 6, transform: `scale(${1.3 - 0.3 * s})`, textShadow: '0 6px 30px rgba(0,0,0,0.7)'}}>
              DAY 1.
            </div>
          </AbsoluteFill>
        ) : null
      }
    >
      <Layer depth={1}>
        <rect x={-500} y={DY - 160 * S} width={3000} height={1000} fill="#1c1c22" />
        <DrawerBox x={DX} y={DY + 200} scale={S} open={open} shake={shake} leak={leak} />
        {/* phone going in (visible while drawer is open) */}
        {f < 70 ? (
          <g transform={`translate(${DX} ${keys(lower, [0, 1], [200, DY - 300])}) scale(${1 - lower * 0.2})`}>
            <HandPhone rot={0} scale={3.2} screen="feed" scroll={f * 3} />
          </g>
        ) : null}
        {/* arm */}
        <path d={`M ${handX + 200} -200 Q ${handX + 160} ${handY - 200} ${handX} ${handY}`} stroke={C.ink} strokeWidth={62} fill="none" strokeLinecap="round" />
        <path d={`M ${handX + 200} -200 Q ${handX + 160} ${handY - 200} ${handX} ${handY}`} stroke={C.hero} strokeWidth={52} fill="none" strokeLinecap="round" />
      </Layer>
      <Sfx name="drawer" at={60} volume={0.9} />
      <Sfx name="buzz" at={94} volume={0.9} />
      <Sfx name="buzz" at={124} volume={0.7} />
      <Sfx name="impact" at={HIT} volume={0.8} />
    </SceneFrame>
  );
};
