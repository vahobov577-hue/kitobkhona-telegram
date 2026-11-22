import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_BOLD} from '../theme';
import {EASE, EASE_OUT, keys, ramp, rectPath, wobbler} from '../lib';
import {Layer, SceneFrame, ShadowText, Sfx} from '../components/Stage';
import {Burst} from '../effects/Particles';
import {cameraShake, hitEnvelope} from '../effects/CameraShake';

const PULLS = [16, 76, 136];
const RESULTS = [
  ['broken', 'empty', 'heart'],
  ['empty', 'heart', 'broken'],
  ['heart', 'heart', 'heart'],
];
const SYMS = ['heart', 'broken', 'empty'];
const CX = 960;
const CY = 560;

const Sym: React.FC<{s: string; y: number}> = ({s, y}) => (
  <g transform={`translate(0 ${y})`}>
    {s === 'heart' ? <path d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill={C.red} stroke={C.ink} strokeWidth={4} /> : null}
    {s === 'broken' ? (
      <g>
        <path d="M -4 30 C -60 -10 -44 -60 -4 -30 L 6 -12 L -6 4 L 6 18 Z" fill="#7a2a2a" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 8 26 L 18 14 L 8 2 L 20 -16 C 50 -50 62 -6 8 26 Z" fill="#7a2a2a" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" transform="translate(8 4) rotate(8)" />
      </g>
    ) : null}
    {s === 'empty' ? <circle r={30} fill="none" stroke="#5a5a66" strokeWidth={6} strokeDasharray="10 10" /> : null}
  </g>
);

// 930–1170: the screen becomes a slot machine. Every swipe is the lever.
export const Scene07: React.FC = () => {
  const f = useCurrentFrame();
  const w = wobbler(f, 'slot', 1);
  const pullIdx = PULLS.filter((p) => p <= f).length - 1;
  const jackpotAt = PULLS[2] + 44;
  const shake = cameraShake(f, hitEnvelope(f, jackpotAt, 14, 16), 'jp');
  const reels = [0, 1, 2].map((r) => {
    if (pullIdx < 0) return <Sym key={r} s={SYMS[r]} y={0} />;
    const p = PULLS[pullIdx];
    const stop = p + 22 + r * 10;
    if (f >= stop) {
      const bounce = ramp(f, stop, stop + 6, -18, 0, EASE_OUT);
      return <Sym key={r} s={RESULTS[pullIdx][r]} y={bounce} />;
    }
    const off = ((f - p) * 38 + r * 50) % 300;
    return (
      <g key={r} style={{filter: 'blur(2px)'}}>
        {[-1, 0, 1, 2].map((k) => (
          <Sym key={k} s={SYMS[(k + Math.floor((f - p) * 38 / 100) + r) % 3]} y={k * 100 - (off % 100)} />
        ))}
      </g>
    );
  });
  const lever = PULLS.reduce((a, p) => a + (f >= p && f < p + 14 ? Math.sin(((f - p) / 14) * Math.PI) : 0), 0);
  const win = f >= jackpotAt;
  return (
    <SceneFrame
      dur={240}
      floor={false}
      fadeIn={0}
      cam={(t) => ({zoom: keys(t, [0, 120, 240], [1.08, 1.0, 1.06], EASE), x: shake.x, y: shake.y, rot: shake.rot + keys(t, [0, 240], [-1.5, 1.5])})}
      overlay={
        <>
          <ShadowText text="just one more." from={196} to={240} y={140} size={92} fadeOut={4} />
          {win && f < jackpotAt + 4 ? <AbsoluteFill style={{background: C.gold, opacity: 0.35}} /> : null}
        </>
      }
    >
      <Layer depth={0.6}>
        <ellipse cx={CX} cy={CY} rx={700} ry={520} fill={C.screen} opacity={0.1} />
      </Layer>
      <Layer depth={1}>
        {/* phone body */}
        <path d={rectPath(w, CX - 330, CY - 470, 660, 940, 60)} fill="#1b1b21" stroke={C.ink} strokeWidth={6} />
        <path d={rectPath(w, CX - 300, CY - 440, 600, 880, 40)} fill="#1c2638" />
        <rect x={CX - 300} y={CY - 440} width={600} height={880} rx={40} fill={C.screen} opacity={0.18} />
        <text x={CX} y={CY - 330} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={54} fill={C.gold} letterSpacing={4}>
          FEED
        </text>
        {/* reels */}
        {[0, 1, 2].map((r) => (
          <g key={r} transform={`translate(${CX - 180 + r * 180} ${CY - 60})`}>
            <rect x={-75} y={-90} width={150} height={180} rx={14} fill="#e9e2d2" stroke={C.ink} strokeWidth={5} />
            <clipPath id={`reel${r}`}>
              <rect x={-75} y={-90} width={150} height={180} rx={14} />
            </clipPath>
            <g clipPath={`url(#reel${r})`}>{reels[r]}</g>
          </g>
        ))}
        {win ? (
          <g transform={`translate(${CX} ${CY + 150}) scale(${ramp(f, jackpotAt, jackpotAt + 8, 0.4, 1, EASE_OUT)})`}>
            <rect x={-220} y={-50} width={440} height={100} rx={20} fill={C.gold} stroke={C.ink} strokeWidth={5} />
            <text y={22} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={64} fill={C.ink}>
              +12 likes
            </text>
          </g>
        ) : (
          <text x={CX} y={CY + 170} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={40} fill="#8fa6c9">
            swipe to spin
          </text>
        )}
        {/* lever */}
        <g transform={`translate(${CX + 360} ${CY - 40})`}>
          <rect x={-14} y={-10} width={28} height={130} rx={10} fill={C.furn} stroke={C.ink} strokeWidth={4} />
          <g transform={`rotate(${lever * 70} 0 110)`}>
            <path d="M 0 110 L 0 -170" stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
            <path d="M 0 110 L 0 -170" stroke="#9a9aa8" strokeWidth={9} strokeLinecap="round" />
            <circle cx={0} cy={-190} r={34} fill={C.red} stroke={C.ink} strokeWidth={5} />
          </g>
        </g>
        {/* thumb that swipes = pulls */}
        {PULLS.map((p, i) => {
          const t = f - p + 10;
          if (t < 0 || t > 26) return null;
          const y = keys(t, [0, 12, 26], [900, 520, 300], EASE);
          return (
            <g key={i} transform={`translate(${CX + 120} ${y}) rotate(-12)`} opacity={t > 20 ? (26 - t) / 6 : 1}>
              <rect x={-60} y={-40} width={120} height={420} rx={60} fill={C.hero} stroke={C.ink} strokeWidth={5} />
              <ellipse cx={0} cy={0} rx={44} ry={36} fill="#e2d8c4" stroke={C.ink} strokeWidth={3} />
            </g>
          );
        })}
        {win ? (
          <>
            <Burst x={CX} y={CY - 60} t={f - jackpotAt} n={60} shape="spark" color={C.gold} speed={18} life={50} gravity={0.5} seed="jp" size={7} />
            <Burst x={CX - 180} y={CY - 60} t={f - jackpotAt - 4} n={30} color={C.gold} speed={12} life={50} gravity={0.6} seed="jp2" size={6} />
            <Burst x={CX + 180} y={CY - 60} t={f - jackpotAt - 6} n={30} color={C.gold} speed={12} life={50} gravity={0.6} seed="jp3" size={6} />
          </>
        ) : null}
      </Layer>
      {PULLS.map((p, i) => (
        <Sfx key={i} name="slot" at={p} volume={0.7} />
      ))}
      <Sfx name="jackpot" at={jackpotAt} volume={0.9} />
      <Sfx name="whisper" at={192} volume={0.8} />
    </SceneFrame>
  );
};
