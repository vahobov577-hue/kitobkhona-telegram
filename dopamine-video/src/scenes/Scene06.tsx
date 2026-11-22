import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_BOLD} from '../theme';
import {EASE, EASE_IN, keys, noise} from '../lib';
import {Face} from '../components/Hero';
import {FeedCard} from '../components/Things';
import {Layer, SceneFrame, Sfx} from '../components/Stage';

const SWIPES = [20, 62, 100, 134, 164, 190, 212];

// 690–930: POV from inside the phone. His giant face behind the glass, a thumb swipes at us.
export const Scene06: React.FC = () => {
  const f = useCurrentFrame();
  const last = SWIPES.filter((s) => s <= f).pop() ?? -100;
  const st = f - last; // frames since last swipe
  const thumbP = st < 16 ? st / 16 : 1;
  const hour = Math.floor(keys(f, [0, 240], [23, 25]));
  const minute = Math.floor((keys(f, [0, 240], [0, 120]) % 60));
  const clock = `${String(hour % 24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const bump = st < 10 ? (1 - st / 10) * 6 : 0;
  const cards = SWIPES.map((s, i) => {
    const t = f - s;
    if (t < 0 || t > 24) return null;
    const y = keys(t, [0, 24], [1500, -500], EASE_IN);
    return <FeedCard key={i} x={960 + (i % 2 ? 260 : -240)} y={y} w={620} h={520} seed={'p6' + i} rot={(i % 2 ? 1 : -1) * 6} likes={i % 3 === 0 ? '♥ 2.1K' : undefined} />;
  });
  return (
    <SceneFrame
      dur={240}
      floor={false}
      fadeIn={0}
      wipeOut={10}
      cam={(t) => ({zoom: keys(t, [0, 240], [1.0, 1.08]), y: noise('p6', t * 0.4) * 6 + bump, x: noise('p6x', t * 0.4) * 6, fx: 960, fy: 540})}
      overlay={
        <>
          <div style={{position: 'absolute', left: 60, top: 36, fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 40, color: '#fff', opacity: 0.85}}>{clock}</div>
          <div style={{position: 'absolute', right: 60, top: 40, width: 70, height: 30, border: '3px solid #fff', borderRadius: 6, opacity: 0.8}}>
            <div style={{width: `${keys(f, [0, 240], [80, 52])}%`, height: '100%', background: '#fff'}} />
          </div>
          {/* glass reflections */}
          <AbsoluteFill style={{background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.06) 36%, transparent 42%, transparent 60%, rgba(255,255,255,0.04) 64%, transparent 68%)'}} />
          <AbsoluteFill style={{boxShadow: 'inset 0 0 0 26px #0b0b0d, inset 0 0 120px rgba(0,0,0,0.9)', borderRadius: 60}} />
        </>
      }
    >
      <Layer depth={0.6}>
        <rect x={-400} y={-400} width={2800} height={1900} fill="#0d0f14" />
        {/* the giant face, lit blue from below (the screen) */}
        <g transform={`translate(960 ${640 + Math.sin(f * 0.05) * 8}) scale(7)`}>
          <ellipse cx={0} cy={0} rx={37} ry={42} fill={C.hero} stroke={C.ink} strokeWidth={0.8} />
          <Face emotion="empty" blink={(f + 50) % 110 < 3 ? 0.1 : 1} look={-6} />
          <ellipse cx={0} cy={30} rx={40} ry={26} fill={C.screen} opacity={0.32} />
        </g>
        <rect x={-400} y={-400} width={2800} height={1900} fill={C.screen} opacity={0.12} />
      </Layer>
      <Layer depth={1.1}>{cards}</Layer>
      <Layer depth={1.3}>
        {st < 22 ? (
          <g transform={`translate(${keys(thumbP, [0, 1], [1350, 1150])} ${keys(thumbP, [0, 1], [1200, 260], EASE)}) rotate(-18)`} opacity={st < 18 ? 1 : 1 - (st - 18) / 4}>
            <rect x={-110} y={-60} width={220} height={760} rx={110} fill={C.hero} stroke={C.ink} strokeWidth={6} />
            <ellipse cx={0} cy={0} rx={80} ry={64} fill="#e2d8c4" stroke={C.ink} strokeWidth={3} />
            <ellipse cx={0} cy={60} rx={115} ry={90} fill={C.screen} opacity={0.25} />
          </g>
        ) : null}
      </Layer>
      {SWIPES.map((s, i) => (
        <Sfx key={i} name="swipe" at={s} volume={0.55} />
      ))}
    </SceneFrame>
  );
};
