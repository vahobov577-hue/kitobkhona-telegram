import React, {useContext} from 'react';
import {AbsoluteFill, Audio, getStaticFiles, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT_HAND, FONT_SERIF, FONT_TITLE, gradeAt, H, W} from '../theme';
import {clamp, EASE, EASE_OUT, ramp} from '../lib';
import {AudioOn, Cam, CamCtx, ShotCtx, VertCtx} from './context';
import {ColorGrade} from './ColorGrade';
import {FilmGrain} from './FilmGrain';
import {Vignette} from './Vignette';

type Props = {
  cam?: (t: number) => Cam; // extra camera on top of the default slow drift/zoom
  drift?: [number, number]; // default drift in px over the shot
  zoom?: [number, number];
  bg?: string; // flat background colour
  sat?: number; // override saturation
  tint?: string;
  tintOpacity?: number;
  fadeIn?: number;
  fadeOut?: number;
  fadeColor?: string;
  ungraded?: React.ReactNode; // world layers drawn on top, exempt from the grade (first warm lamp, leaves…)
  overlay?: React.ReactNode; // text etc. (not affected by camera or grade)
  grain?: boolean;
  vignette?: number;
  children?: React.ReactNode;
};

/** One shot: slow drift + zoom 1.00→1.04, colour grade by act, grain, vignette, fades. */
export const Shot: React.FC<Props> = ({cam, drift = [0, 0], zoom = [1, 1.04], bg = '#1b1c1f', sat, tint, tintOpacity, fadeIn = 0, fadeOut = 0, fadeColor = '#000', ungraded, overlay, grain = true, vignette = 1, children}) => {
  const t = useCurrentFrame();
  const {d, g0} = useContext(ShotCtx);
  const u = clamp(t / Math.max(1, d - 1));
  const base: Required<Cam> = {x: drift[0] * (u - 0.5), y: drift[1] * (u - 0.5), zoom: zoom[0] + (zoom[1] - zoom[0]) * EASE(u), rot: 0, fx: W / 2, fy: H / 2};
  const extra = cam ? cam(t) : {};
  const value: Required<Cam> = {
    x: base.x + (extra.x ?? 0),
    y: base.y + (extra.y ?? 0),
    zoom: base.zoom * (extra.zoom ?? 1),
    rot: extra.rot ?? 0,
    fx: extra.fx ?? base.fx,
    fy: extra.fy ?? base.fy,
  };
  const s = sat ?? gradeAt(g0 + t);
  const fi = fadeIn > 0 ? 1 - clamp(t / fadeIn) : 0;
  const fo = fadeOut > 0 ? clamp((t - (d - fadeOut)) / fadeOut) : 0;
  return (
    <CamCtx.Provider value={value}>
      <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
        <ColorGrade saturation={s} tint={tint} tintOpacity={tintOpacity}>
          {children}
        </ColorGrade>
        {ungraded}
        {vignette > 0 ? <Vignette strength={vignette} /> : null}
        {grain ? <FilmGrain /> : null}
        {overlay}
        {fi > 0 ? <AbsoluteFill style={{background: fadeColor, opacity: fi}} /> : null}
        {fo > 0 ? <AbsoluteFill style={{background: fadeColor, opacity: fo}} /> : null}
      </AbsoluteFill>
    </CamCtx.Provider>
  );
};

const useScaleText = () => (useContext(VertCtx).vertical ? 1.45 : 1);

/** Dialogue line — Patrick Hand, white, centred at the top on a soft blurred dark "pillow". */
export const Line: React.FC<{text: string; from?: number; to?: number; color?: string; y?: number; size?: number}> = ({text, from = 0, to = 9999, color = '#fff', y, size = 52}) => {
  const t = useCurrentFrame();
  const k = useScaleText();
  const v = useContext(VertCtx).vertical;
  if (t < from || t > to) return null;
  const op = Math.min(ramp(t, from, from + 6, 0, 1, EASE_OUT), ramp(t, to - 6, to, 1, 0));
  const top = y ?? (v ? 300 : 70);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: top - 30, left: '50%', transform: 'translateX(-50%)', width: v ? 900 : 1100, height: size * k + 70, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0) 75%)', filter: 'blur(12px)', opacity: op}} />
      <div style={{position: 'absolute', top, width: '100%', textAlign: 'center', fontFamily: FONT_HAND, fontSize: size * k, color, opacity: op, padding: '0 60px', boxSizing: 'border-box', textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)', transform: `translateY(${ramp(t, from, from + 8, 8, 0, EASE_OUT)}px)`}}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Narrator — serif italic, white (on black, or at the bottom). */
export const Narr: React.FC<{text: string; from?: number; to?: number; size?: number; y?: number | 'center'}> = ({text, from = 0, to = 9999, size = 64, y = 'center'}) => {
  const t = useCurrentFrame();
  const k = useScaleText();
  const vertical = useContext(VertCtx).vertical;
  if (t < from || t > to) return null;
  if (vertical && typeof y === 'number') y = 1500;
  const op = Math.min(ramp(t, from, from + 12, 0, 1, EASE_OUT), ramp(t, to - 10, to, 1, 0));
  return (
    <AbsoluteFill style={{justifyContent: y === 'center' ? 'center' : 'flex-start', alignItems: 'center', pointerEvents: 'none'}}>
      <div style={{position: y === 'center' ? 'relative' : 'absolute', top: y === 'center' ? undefined : y, fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: size * k, color: '#f2f0ea', opacity: op, textAlign: 'center', padding: '0 80px', textShadow: '0 2px 14px rgba(0,0,0,0.9)'}}>{text}</div>
    </AbsoluteFill>
  );
};

/** Title — Cormorant Garamond SemiBold, letter-spacing .25em */
export const Title: React.FC<{text: string; sub?: string; from?: number; subFrom?: number; size?: number}> = ({text, sub, from = 0, subFrom = 30, size = 120}) => {
  const t = useCurrentFrame();
  const k = useScaleText();
  const v = useContext(VertCtx).vertical;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', pointerEvents: 'none'}}>
      <div style={{fontFamily: FONT_TITLE, fontWeight: 600, fontSize: size * (v ? 0.95 : 1), letterSpacing: '0.25em', marginRight: '-0.25em', color: '#f2f0ea', opacity: ramp(t, from, from + 14, 0, 1, EASE_OUT), transform: `scale(${ramp(t, from, from + 40, 1.04, 1, EASE_OUT)})`}}>{text}</div>
      {sub ? <div style={{fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 40 * k, color: '#cfccc4', marginTop: 24, opacity: ramp(t, subFrom, subFrom + 14, 0, 1, EASE_OUT)}}>{sub}</div> : null}
    </AbsoluteFill>
  );
};

/** small "DAY N" label (top-left) */
export const Day: React.FC<{n: string}> = ({n}) => {
  const t = useCurrentFrame();
  const k = useScaleText();
  return <div style={{position: 'absolute', left: 60, top: 46, fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 32 * k, letterSpacing: '0.25em', color: '#f2f0ea', opacity: 0.85 * ramp(t, 0, 8)}}>{n}</div>;
};

/* ---------------- sound ---------------- */
const hasFile = (name: string) => getStaticFiles().some((s) => s.name === name);
export const Sfx: React.FC<{name: string; at?: number; volume?: number; dur?: number}> = ({name, at = 0, volume = 1, dur}) => {
  const on = useContext(AudioOn);
  const file = `audio/sfx/${name}.wav`;
  if (!on || !hasFile(file)) return null;
  return (
    <Sequence from={at} durationInFrames={dur ?? 400} layout="none">
      <Audio src={staticFile(file)} volume={volume} />
    </Sequence>
  );
};
export const musicFile = (): string | null => {
  if (hasFile('audio/music.mp3')) return 'audio/music.mp3';
  if (hasFile('audio/music.wav')) return 'audio/music.wav';
  return null;
};
export {C};
