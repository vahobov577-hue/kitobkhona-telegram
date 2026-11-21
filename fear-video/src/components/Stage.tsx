import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Audio, getStaticFiles, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, FLOOR_Y, FONT_BOLD, FONT_HAND, H, W} from '../theme';
import {clamp, EASE, EASE_OUT, jitter, ramp, rnd, wobbler} from '../lib';

/* ---------------- Camera ---------------- */
export type Cam = {x?: number; y?: number; zoom?: number; rot?: number; fx?: number; fy?: number};
const CamCtx = createContext<Required<Cam>>({x: 0, y: 0, zoom: 1, rot: 0, fx: W / 2, fy: H / 2});

/** camera that centres world point (qx,qy) at the given zoom */
export const lookAt = (qx: number, qy: number, zoom = 1, rot = 0, sx = 0, sy = 0): Cam => ({
  fx: qx,
  fy: qy,
  x: qx - W / 2 + sx,
  y: qy - H / 2 + sy,
  zoom,
  rot,
});

type FrameProps = {
  dur: number;
  cam?: (f: number) => Cam;
  fadeIn?: number;
  fadeOut?: number;
  fadeInColor?: string;
  fadeOutColor?: string;
  floor?: boolean;
  floorY?: number;
  breathe?: boolean;
  bg?: React.ReactNode;
  vignette?: number;
  children: React.ReactNode;
  overlay?: React.ReactNode; // not affected by camera
};

/** Scene wrapper: background, camera with parallax layers, vignette, fades through black. */
export const SceneFrame: React.FC<FrameProps> = ({
  dur,
  cam,
  fadeIn = 9,
  fadeOut = 9,
  fadeInColor = '#000',
  fadeOutColor = '#000',
  floor = true,
  floorY = FLOOR_Y,
  breathe = true,
  bg,
  vignette = 1,
  children,
  overlay,
}) => {
  const f = useCurrentFrame();
  const c = cam ? cam(f) : {};
  const breath = breathe ? ramp(f, 0, dur, 1, 1.04, EASE) : 1;
  const value: Required<Cam> = {
    x: c.x ?? 0,
    y: c.y ?? 0,
    zoom: (c.zoom ?? 1) * breath,
    rot: c.rot ?? 0,
    fx: c.fx ?? W / 2,
    fy: c.fy ?? H / 2,
  };
  const fi = fadeIn > 0 ? 1 - clamp(f / fadeIn) : 0;
  const fo = fadeOut > 0 ? clamp((f - (dur - fadeOut)) / fadeOut) : 0;
  return (
    <CamCtx.Provider value={value}>
      <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
        {bg}
        {floor ? (
          <Layer depth={1}>
            <FloorLine y={floorY} />
          </Layer>
        ) : null}
        {children}
        {vignette > 0 ? (
          <AbsoluteFill
            style={{
              background: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.85) 100%)',
              opacity: vignette,
            }}
          />
        ) : null}
        {overlay}
        {fi > 0 ? <AbsoluteFill style={{backgroundColor: fadeInColor, opacity: fi}} /> : null}
        {fo > 0 ? <AbsoluteFill style={{backgroundColor: fadeOutColor, opacity: fo}} /> : null}
      </AbsoluteFill>
    </CamCtx.Provider>
  );
};

const FloorLine: React.FC<{y: number}> = ({y}) => {
  const f = useCurrentFrame();
  const w = wobbler(f, 'floor', 1);
  return <path d={w`M -3000 ${y} L 0 ${y + 0.5} L 960 ${y} L 1920 ${y + 0.5} L 5000 ${y}`} stroke={C.floor} strokeWidth={2} fill="none" />;
};

/** A parallax layer: depth 0 = static, 1 = midground (camera), >1 = foreground */
export const Layer: React.FC<{depth?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({depth = 1, children, style}) => {
  const c = useContext(CamCtx);
  const z = 1 + (c.zoom - 1) * depth;
  const transform = `translate(${-c.x * depth}px, ${-c.y * depth}px) rotate(${c.rot * depth}deg) scale(${z})`;
  return (
    <AbsoluteFill style={{transform, transformOrigin: `${c.fx}px ${c.fy}px`, ...style}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
        {children}
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- Text ---------------- */
type TextProps = {
  text: string;
  from: number;
  to: number;
  y?: number;
  x?: number;
  size?: number;
  bold?: boolean;
  color?: string;
  fadeIn?: number;
  fadeOut?: number;
};

/** Narrator: white, centered top, 12-frame fade-in */
export const Narration: React.FC<TextProps> = ({text, from, to, y = 128, x = W / 2, size = 64, bold = false, color = '#fff', fadeIn = 12, fadeOut = 12}) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const op = Math.min(ramp(f, from, from + fadeIn, 0, 1, EASE_OUT), ramp(f, to - fadeOut, to, 1, 0, EASE));
  const dy = ramp(f, from, from + 18, 14, 0, EASE_OUT);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 900,
        width: 1800,
        top: y - size * 0.7 + dy,
        textAlign: 'center',
        fontFamily: FONT_HAND,
        fontSize: size,
        color,
        opacity: op,
        letterSpacing: 1,
        WebkitTextStroke: bold ? `${size * 0.035}px ${color}` : undefined,
        textShadow: '0 2px 12px rgba(0,0,0,0.6)',
      }}
    >
      {text}
    </div>
  );
};

/** Shadow line: red, big, jittering ±2px, fades out */
export const ShadowText: React.FC<TextProps & {seed?: string}> = ({text, from, to, y = 220, x = W / 2, size = 92, seed = 'st', fadeIn = 6, fadeOut = 14}) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const j = jitter(f, seed + text, 2, 2);
  const op = Math.min(ramp(f, from, from + fadeIn, 0, 1, EASE_OUT), ramp(f, to - fadeOut, to, 1, 0, EASE));
  const sc = ramp(f, from, from + 10, 1.12, 1, EASE_OUT);
  const blur = ramp(f, to - fadeOut, to, 0, 6, EASE);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 900 + j.x,
        width: 1800,
        top: y - size * 0.7 + j.y,
        textAlign: 'center',
        fontFamily: FONT_BOLD,
        fontWeight: 700,
        fontSize: size,
        color: C.red,
        opacity: op,
        transform: `scale(${sc})`,
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
        textShadow: `0 0 18px rgba(229,57,53,0.55), 0 0 4px rgba(229,57,53,0.8)`,
        letterSpacing: 1,
      }}
    >
      {text}
    </div>
  );
};

/** DAY N counter, top-left */
export const DayCounter: React.FC<{label: string; from?: number; to?: number; change?: {at: number; label: string}}> = ({label, from = 6, change}) => {
  const f = useCurrentFrame();
  const op = ramp(f, from, from + 12, 0, 0.8, EASE_OUT);
  let txt = label;
  let roll = 0;
  if (change) {
    roll = ramp(f, change.at - 6, change.at + 6, 0, 1, EASE);
    if (f >= change.at) txt = change.label;
  }
  const flick = change ? Math.sin(roll * Math.PI) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        top: 48 - flick * 8,
        fontFamily: FONT_BOLD,
        fontWeight: 700,
        fontSize: 34,
        letterSpacing: 4,
        color: '#fff',
        opacity: op * (1 - flick * 0.7),
      }}
    >
      {txt}
    </div>
  );
};

/* ---------------- Particles ---------------- */
export const Motes: React.FC<{n: number; x0: number; x1: number; y0: number; y1: number; seed: string; fall?: number; color?: string; size?: number; opacity?: number}> = ({
  n,
  x0,
  x1,
  y0,
  y1,
  seed,
  fall = 0.3,
  color = '#fff',
  size = 2.5,
  opacity = 0.5,
}) => {
  const f = useCurrentFrame();
  const h = y1 - y0;
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const bx = x0 + rnd(seed + 'x' + i) * (x1 - x0);
        const sp = (0.4 + rnd(seed + 'v' + i)) * fall;
        const py = y0 + ((rnd(seed + 'y' + i) * h + f * sp) % h);
        const px = bx + Math.sin(f * 0.02 + i) * 14;
        const tw = 0.5 + 0.5 * Math.sin(f * 0.07 + i * 2.1);
        return <circle key={i} cx={px} cy={py} r={size * (0.5 + rnd(seed + 's' + i))} fill={color} opacity={opacity * tw} />;
      })}
    </g>
  );
};

/* ---------------- Audio ---------------- */
export const AudioOn = createContext(true);

const hasFile = (name: string) => getStaticFiles().some((s) => s.name === name);

/** Sound effect at a local frame (inside the current Sequence) */
export const Sfx: React.FC<{name: string; at: number; volume?: number; dur?: number}> = ({name, at, volume = 1, dur}) => {
  const on = useContext(AudioOn);
  const file = `audio/sfx/${name}.wav`;
  if (!on || !hasFile(file)) return null;
  return (
    <Sequence from={at} durationInFrames={dur ?? 300} layout="none">
      <Audio src={staticFile(file)} volume={volume} />
    </Sequence>
  );
};

export const musicFile = (): string | null => {
  if (hasFile('audio/music.mp3')) return 'audio/music.mp3';
  if (hasFile('audio/music.wav')) return 'audio/music.wav';
  return null;
};
