import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {EASE, EASE_IN, keys, noise, ramp} from '../lib';
import {Desk, Laptop} from '../components/Props';
import {Layer, SceneFrame, Sfx} from '../components/Stage';

const LX = 960;
const LY = 640;
const BTN: [number, number] = [LX, LY - 52 * 1.3];

// 2010–2190: extreme close-up (camera ×3): the trembling finger over UPLOAD → click → flash.
export const Scene09: React.FC = () => {
  const f = useCurrentFrame();
  const approach = keys(f, [0, 120, 136, 140, 150, 178], [0, 0.82, 0.86, 1, 1, 0.55], EASE);
  const trem = keys(f, [0, 60, 125, 138], [1.2, 3.2, 2.0, 0]);
  const tip: [number, number] = [
    1085 + (BTN[0] + 8 - 1085) * approach + noise('tx9', f * 0.9) * trem,
    640 + (BTN[1] + 4 - 640) * approach + noise('ty9', f * 0.9) * trem,
  ];
  const clicked = f >= 140;
  const pressed = keys(f, [139, 141, 148], [0, 1, 0]);
  const flash = f >= 140 && f <= 146 ? keys(f, [140, 142, 146], [1, 1, 0]) : 0;
  const knuckle: [number, number] = [tip[0] + 26, tip[1] + 22];
  const wrist: [number, number] = [1260, 790];
  const arm = `M ${wrist[0]} ${wrist[1]} Q ${knuckle[0] + 60} ${knuckle[1] + 30} ${knuckle[0] + 14} ${knuckle[1] + 10}`;
  const finger = `M ${knuckle[0]} ${knuckle[1]} L ${tip[0]} ${tip[1]}`;
  return (
    <SceneFrame
      dur={180}
      breathe={false}
      cam={(t) => ({zoom: keys(t, [0, 140, 180], [2.6, 3.0, 3.06], EASE_IN), fx: BTN[0] + 20, fy: BTN[1] + 10, x: 0, y: 0})}
      floor={false}
      overlay={flash > 0 ? <AbsoluteFill style={{backgroundColor: '#fff', opacity: flash}} /> : null}
    >
      <Layer depth={1}>
        <Desk x={LX + 40} y={LY + 129 * 1.3} />
        <Laptop x={LX} y={LY} screen={clicked ? 'uploading' : 'upload'} cursorOn={false} pressed={pressed} progress={ramp(f, 146, 176, 0, 1, EASE)} />
        <path d={arm} stroke={C.ink} strokeWidth={27} fill="none" strokeLinecap="round" />
        <path d={arm} stroke={C.hero} strokeWidth={22} fill="none" strokeLinecap="round" />
        <ellipse cx={knuckle[0] + 12} cy={knuckle[1] + 8} rx={19} ry={15} fill={C.hero} stroke={C.ink} strokeWidth={2.4} transform={`rotate(35 ${knuckle[0] + 12} ${knuckle[1] + 8})`} />
        <path d={finger} stroke={C.ink} strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d={finger} stroke={C.hero} strokeWidth={9.5} fill="none" strokeLinecap="round" />
        <path d={`M ${knuckle[0] + 4} ${knuckle[1] + 14} q 8 4 16 0`} stroke={C.ink} strokeWidth={1.4} fill="none" opacity={0.6} />
        <circle cx={tip[0] - 3} cy={tip[1] - 2} r={9} fill={C.screen} opacity={0.18} />
      </Layer>
      <Sfx name="heartbeat" at={0} volume={0.6} />
      <Sfx name="click" at={140} volume={1} />
      <Sfx name="shimmer" at={140} volume={0.6} />
    </SceneFrame>
  );
};
