import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_BOLD} from '../theme';
import {EASE_OUT, jitter, noise, ramp, rnd} from '../lib';
import {Hero} from '../components/Hero';
import {FeedCard, Glow} from '../components/Things';
import {Layer, SceneFrame, Sfx} from '../components/Stage';

const WHISPERS = ['next.', 'one more.', "don't stop.", 'keep going.', 'scroll.', 'just 5 min.', 'next.', 'more.', 'stay.', 'one more.', 'refresh.', 'next.'];
const GAP = 340;

const track = (y: number, lane = 0) => 960 + Math.sin(y * 0.0022 + lane) * 300;

// 1860–2250: HOOK 1:02 — inside the phone: an endless vertical feed. He slides down it like a water slide.
export const Scene11: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = f * 15 + f * f * 0.012;
  const minutes = 12 + Math.floor(f / 26);
  const heroY = 560;
  const heroX = track(heroY + scroll);
  const tilt = Math.cos((heroY + scroll) * 0.0022) * 18;
  const cards = (lane: number, scale: number, n: number) =>
    Array.from({length: n}).map((_, k) => {
      const base = Math.floor(scroll / GAP) - 2 + k;
      const worldY = base * GAP;
      const y = worldY - scroll + heroY;
      const x = track(worldY, lane) + (lane ? (lane > 2 ? 520 : -520) : 0);
      const ang = Math.cos(worldY * 0.0022 + lane) * 18;
      return <FeedCard key={lane + '-' + base} x={x} y={y + 70 * scale} w={430 * scale} h={300 * scale} rot={ang - 12} seed={'f11' + lane + (base % 7)} likes={base % 3 === 0 ? `♥ ${(base * 37) % 90 + 3}K` : undefined} />;
    });
  return (
    <SceneFrame
      dur={390}
      floor={false}
      fadeIn={0}
      fadeInColor="#dbe8ff"
      cam={(t) => ({rot: noise('r11', t * 0.03) * 4, zoom: 1.04 + 0.03 * Math.sin(t * 0.05), x: noise('x11', t * 0.05) * 30, fx: 960, fy: 560})}
      bg={<AbsoluteFill style={{background: 'linear-gradient(180deg, #0c1322 0%, #101a30 55%, #0b0f1a 100%)'}} />}
      overlay={
        <>
          {f < 14 ? <AbsoluteFill style={{background: '#dbe8ff', opacity: 1 - f / 14}} /> : null}
          <div style={{position: 'absolute', top: 40, width: 1920, textAlign: 'center', fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 46, color: '#fff', opacity: 0.9}}>
            Screen time: <span style={{color: C.screenSoft}}>5h {minutes}m</span>
          </div>
          {WHISPERS.map((w, i) => {
            const a = 40 + i * 28;
            if (f < a || f > a + 44) return null;
            const op = Math.min(ramp(f, a, a + 6), ramp(f, a + 32, a + 44, 1, 0));
            const side = i % 4;
            const x = side === 0 ? 180 : side === 1 ? 1500 : side === 2 ? 260 + rnd('wx' + i) * 300 : 1350 + rnd('wx' + i) * 250;
            const y = side < 2 ? 260 + rnd('wy' + i) * 600 : side === 2 ? 920 : 180 + rnd('wy2' + i) * 120;
            const j = jitter(f, 'w' + i, 2);
            return (
              <div key={i} style={{position: 'absolute', left: x + j.x, top: y + j.y, fontFamily: FONT_BOLD, fontWeight: 700, fontSize: 40 + (i % 3) * 10, color: C.red, opacity: op * 0.9, transform: `scale(${ramp(f, a, a + 8, 1.3, 1, EASE_OUT)})`, textShadow: '0 0 14px rgba(229,57,53,0.6)'}}>
                {w}
              </div>
            );
          })}
        </>
      }
    >
      <Layer depth={0.45}>
        {Array.from({length: 30}).map((_, i) => {
          const x = rnd('sl' + i) * 1920;
          const y = ((rnd('sy' + i) * 1400 - scroll * 0.5) % 1400 + 1400) % 1400 - 160;
          return <line key={i} x1={x} y1={y} x2={x} y2={y + 120} stroke="#6FA8FF" strokeWidth={2} opacity={0.18} />;
        })}
      </Layer>
      <Layer depth={0.65}>
        <g opacity={0.55}>
          {cards(3, 0.6, 7)}
          {cards(5, 0.6, 7)}
        </g>
        {[0, 1, 2].map((i) => {
          const lane = i === 1 ? 5 : 3;
          const yy = 300 + i * 260 + Math.sin(f * 0.07 + i) * 20;
          const x = track(yy + scroll, lane) + (lane > 2 ? 520 : -520);
          return <Hero key={i} x={x} y={yy} frame={f + i * 20} pose="slide" scale={0.75} fill="#5a5e6e" emotion="empty" rot={-12} seed={'g' + i} />;
        })}
      </Layer>
      <Layer depth={1}>
        {cards(0, 1, 8)}
        <Hero x={heroX - 10} y={heroY + 10} frame={f} pose="slide" scale={1.15} rot={tilt - 12} emotion={f < 200 ? 'smile' : 'empty'} wind={2} />
        <Glow cx={heroX} cy={heroY - 140} r={260} color={C.screen} opacity={0.3} />
      </Layer>
      <Sfx name="slide" at={0} volume={0.7} dur={390} />
      <Sfx name="whisper" at={40} volume={0.7} />
      <Sfx name="whisper" at={150} volume={0.7} />
      <Sfx name="whisper" at={260} volume={0.7} />
      {[60, 130, 190, 240, 280, 315, 345, 370].map((d) => (
        <Sfx key={d} name="ding" at={d} volume={0.35} />
      ))}
    </SceneFrame>
  );
};
