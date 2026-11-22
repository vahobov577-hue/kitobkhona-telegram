import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT_BOLD} from '../theme';
import {EASE, keys, ramp, rectPath, wobbler} from '../lib';
import {Face} from '../components/Hero';
import {Glow} from '../components/Things';
import {Layer, SceneFrame, Sfx} from '../components/Stage';

const X = 960;
const Y = 560;
const PW = 560;
const PH = 960;

// 3540–3900: HOOK 2:00 — the music dies. 1% → 0%, the screen goes black,
// and in the black glass he sees his own face: older, tired. He touches it. Only the clock ticks.
export const Scene17: React.FC = () => {
  const f = useCurrentFrame();
  const w = wobbler(f, 'm17', 0.6);
  const pct = f < 44 ? '1%' : '0%';
  const off = f >= 56;
  const collapse = ramp(f, 56, 64, 1, 0, EASE);
  const refl = ramp(f, 80, 170, 0, 1, EASE);
  const touch = ramp(f, 200, 250, 0, 1, EASE);
  return (
    <SceneFrame
      dur={360}
      floor={false}
      fadeIn={0}
      cam={(t) => ({zoom: keys(t, [0, 60, 360], [1.0, 1.04, 1.22]), fx: X, fy: Y - 40, y: keys(t, [0, 360], [0, -20])})}
    >
      <Layer depth={1}>
        {!off || collapse > 0 ? <Glow cx={X} cy={Y} r={700} color={C.screen} opacity={0.25 * (off ? collapse : 1)} /> : null}
        <path d={rectPath(w, X - PW / 2 - 24, Y - PH / 2 - 24, PW + 48, PH + 48, 70)} fill="#1b1b21" stroke={C.ink} strokeWidth={6} />
        <clipPath id="glass17">
          <rect x={X - PW / 2} y={Y - PH / 2} width={PW} height={PH} rx={50} />
        </clipPath>
        <g clipPath="url(#glass17)">
          <rect x={X - PW / 2} y={Y - PH / 2} width={PW} height={PH} fill={off ? '#060608' : '#dbe8ff'} />
          {!off ? (
            <g>
              <rect x={X - 90} y={Y - 60} width={180} height={90} rx={14} fill="none" stroke={C.red} strokeWidth={8} />
              <rect x={X + 92} y={Y - 30} width={14} height={30} rx={4} fill={C.red} />
              <rect x={X - 80} y={Y - 50} width={f < 44 ? 10 : 0} height={70} fill={C.red} />
              <text x={X} y={Y + 110} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={84} fill={C.red}>
                {pct}
              </text>
            </g>
          ) : null}
          {off && collapse > 0 ? <rect x={X - PW / 2} y={Y - 3 - 40 * collapse} width={PW} height={6 + 80 * collapse} fill="#fff" opacity={collapse} /> : null}
          {/* reflection */}
          <g opacity={refl * 0.55} transform={`translate(${X} ${Y - 40}) scale(5.2)`}>
            <ellipse cx={0} cy={0} rx={37} ry={42} fill="#cfc8ba" />
            <Face emotion="shocked" blink={(f + 20) % 120 < 3 ? 0.2 : 1} age={0.85} />
            <path d="M -30 -34 Q -16 -38 -4 -34 M 6 -36 Q 18 -40 30 -34" stroke="#6b6358" strokeWidth={1} fill="none" opacity={0.8} />
          </g>
          {touch > 0 ? (
            <g opacity={refl * 0.55}>
              <path d={`M ${X + 380} ${Y + 560} Q ${X + 260} ${Y + 260 - 120 * touch} ${X + 150 - 20 * touch} ${Y + 200 - 180 * touch}`} stroke="#cfc8ba" strokeWidth={70} fill="none" strokeLinecap="round" />
            </g>
          ) : null}
          <path d={`M ${X - PW / 2} ${Y - 200} L ${X + PW / 2} ${Y - 460}`} stroke="#fff" strokeWidth={40} opacity={0.035} />
        </g>
      </Layer>
      {Array.from({length: 12}).map((_, i) => (
        <Sfx key={i} name="tick" at={i * 30} volume={0.55} dur={10} />
      ))}
      <Sfx name="powerdown" at={52} volume={0.8} />
    </SceneFrame>
  );
};
