import React, {useId} from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT_BOLD} from '../theme';
import {ellipsePath, rectPath, rnd, wobbler} from '../lib';

type Base = {x: number; y: number; scale?: number; seed?: string};
const SW = 2.6;

const useW = (seed: string, scale: number) => {
  const f = useCurrentFrame();
  return wobbler(f, seed, 1 / scale);
};

/* ---------------- Desk ---------------- */
export const Desk: React.FC<Base & {width?: number; height?: number}> = ({x, y, scale = 1.3, seed = 'desk', width = 330, height = 125}) => {
  const w = useW(seed, scale);
  const hw = width / 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={rectPath(w, -hw + 14, -height + 10, 14, height - 10, 3)} fill={C.grey2} stroke={C.ink} strokeWidth={SW} />
      <path d={rectPath(w, hw - 28, -height + 10, 14, height - 10, 3)} fill={C.grey2} stroke={C.ink} strokeWidth={SW} />
      <path d={rectPath(w, hw - 120, -height + 10, 92, 46, 3)} fill={C.furn} stroke={C.ink} strokeWidth={SW} />
      <path d={w`M ${hw - 86} ${-height + 33} L ${hw - 62} ${-height + 33}`} stroke={C.ink} strokeWidth={SW} strokeLinecap="round" />
      <path d={rectPath(w, -hw, -height - 4, width, 16, 4)} fill={C.furn} stroke={C.ink} strokeWidth={SW} />
    </g>
  );
};

/* ---------------- Chair (stool w/ back) ---------------- */
export const Chair: React.FC<Base & {flip?: boolean}> = ({x, y, scale = 1.3, seed = 'chair', flip = false}) => {
  const w = useW(seed, scale);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * (flip ? -1 : 1)} ${scale})`}>
      <path d={w`M -40 -148 L -34 -50`} stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
      <path d={w`M -40 -148 L -34 -50`} stroke={C.grey2} strokeWidth={9} strokeLinecap="round" />
      <path d={w`M -34 -42 L -38 0 M 30 -42 L 34 0`} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
      <path d={w`M -34 -42 L -38 0 M 30 -42 L 34 0`} stroke={C.grey2} strokeWidth={5} strokeLinecap="round" />
      <path d={rectPath(w, -46, -52, 88, 12, 4)} fill={C.furn} stroke={C.ink} strokeWidth={SW} />
    </g>
  );
};

/* ---------------- Laptop ---------------- */
export type LaptopScreen = 'upload' | 'uploading' | 'views' | 'off' | 'counter';
export const Laptop: React.FC<
  Base & {
    open?: number; // 0 closed .. 1 open
    screen?: LaptopScreen;
    glow?: number;
    cursorOn?: boolean;
    pressed?: number;
    progress?: number;
    views?: string;
    cobweb?: number;
  }
> = ({x, y, scale = 1.3, seed = 'laptop', open = 1, screen = 'upload', glow = 1, cursorOn = true, pressed = 0, progress = 0, views = '0 views', cobweb = 0}) => {
  const w = useW(seed, scale);
  const id = useId().replace(/:/g, '');
  const SWd = 128;
  const SHt = 86;
  const lidH = SHt * open;
  const on = screen !== 'off' && open > 0.15;
  const g = on ? glow * Math.min(1, (open - 0.15) / 0.5) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <radialGradient id={`lg${id}`}>
          <stop offset="0%" stopColor={C.screen} stopOpacity={0.55} />
          <stop offset="100%" stopColor={C.screen} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`sc${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfeaff" />
          <stop offset="100%" stopColor="#7cc6ee" />
        </linearGradient>
      </defs>
      {g > 0 ? <ellipse cx={0} cy={-lidH / 2 - 8} rx={260} ry={200} fill={`url(#lg${id})`} opacity={g} /> : null}
      {/* lid */}
      {open > 0.05 ? (
        <g>
          <path d={w`M ${-SWd / 2 - 6} -6 L ${SWd / 2 + 6} -6 L ${SWd / 2 + 2} ${-6 - lidH - 6} L ${-SWd / 2 - 2} ${-6 - lidH - 6} Z`} fill={C.grey2} stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" />
          {open > 0.3 ? (
            <g>
              <path
                d={rectPath(w, -SWd / 2 + 3, -6 - lidH, SWd - 6, lidH - 6, 3)}
                fill={on ? `url(#sc${id})` : '#20242c'}
                opacity={on ? 0.35 + 0.65 * g : 1}
                stroke={C.ink}
                strokeWidth={1.6}
              />
              {on && open > 0.85 ? (
                <g opacity={g} transform={`translate(0 ${-6 - lidH / 2 - 3})`}>
                  {screen === 'upload' || screen === 'uploading' ? (
                    <g>
                      <rect x={-50} y={-30} width={100} height={8} rx={3} fill="#5aa5d1" opacity={0.6} />
                      <g transform={`scale(${1 - pressed * 0.08})`}>
                        <rect x={-34} y={-12} width={68} height={24} rx={6} fill={screen === 'uploading' ? '#3d7fb0' : C.red} stroke={C.ink} strokeWidth={1.8} />
                        <text x={0} y={5} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={13} fill="#fff" letterSpacing={0.5}>
                          {screen === 'uploading' ? 'UPLOADED' : 'UPLOAD'}
                        </text>
                      </g>
                      {screen === 'uploading' ? (
                        <g>
                          <rect x={-40} y={20} width={80} height={6} rx={3} fill="#2b6c9a" opacity={0.5} />
                          <rect x={-40} y={20} width={80 * progress} height={6} rx={3} fill="#fff" />
                        </g>
                      ) : null}
                      {cursorOn && screen === 'upload' ? (
                        <path d="M 22 2 L 22 20 L 26 16 L 30 24 L 33 22 L 29 15 L 35 15 Z" fill="#fff" stroke={C.ink} strokeWidth={1.4} strokeLinejoin="round" />
                      ) : null}
                    </g>
                  ) : null}
                  {screen === 'views' || screen === 'counter' ? (
                    <g>
                      <rect x={-48} y={-30} width={58} height={34} rx={3} fill="#2b6c9a" opacity={0.75} />
                      <path d="M -24 -20 L -24 -6 L -12 -13 Z" fill="#fff" />
                      <rect x={16} y={-28} width={32} height={5} rx={2} fill="#2b6c9a" opacity={0.6} />
                      <rect x={16} y={-18} width={22} height={5} rx={2} fill="#2b6c9a" opacity={0.6} />
                      <text x={-48} y={22} fontFamily={FONT_BOLD} fontWeight={700} fontSize={14} fill={C.ink}>
                        {views}
                      </text>
                    </g>
                  ) : null}
                </g>
              ) : null}
            </g>
          ) : null}
          {cobweb > 0 ? <Cobweb x={SWd / 2 - 2} y={-6 - lidH - 4} s={1} t={cobweb} /> : null}
        </g>
      ) : null}
      {open <= 0.3 ? (
        <path d={w`M ${-SWd / 2 - 8} -6 L ${SWd / 2 + 8} -6 L ${SWd / 2 + 4} ${-6 - 7 * (1 - open / 0.3) - lidH} L ${-SWd / 2 - 4} ${-6 - 7 * (1 - open / 0.3) - lidH} Z`} fill={C.grey2} stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" />
      ) : null}
      {/* base */}
      <path d={w`M ${-SWd / 2 - 14} 0 L ${SWd / 2 + 14} 0 L ${SWd / 2 + 6} -7 L ${-SWd / 2 - 6} -7 Z`} fill={C.furn} stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" />
      {cobweb > 0 && open <= 0.05 ? <Cobweb x={SWd / 2 + 12} y={-14} s={1.5} t={cobweb} /> : null}
    </g>
  );
};

/* corner cobweb (top-right corner at x,y) */
export const Cobweb: React.FC<{x: number; y: number; s?: number; t: number; flip?: boolean}> = ({x, y, s = 1, t, flip}) => {
  const rays = 5;
  const R = 46;
  const lines: string[] = [];
  for (let i = 0; i < rays; i++) {
    const a = (Math.PI / 2) * (i / (rays - 1));
    lines.push(`M 0 0 L ${(-Math.cos(a) * R).toFixed(1)} ${(Math.sin(a) * R).toFixed(1)}`);
  }
  for (let k = 1; k <= 3; k++) {
    const r = (R * k) / 3.4;
    let d = '';
    for (let i = 0; i < rays; i++) {
      const a = (Math.PI / 2) * (i / (rays - 1));
      const px = -Math.cos(a) * r;
      const py = Math.sin(a) * r;
      d += i === 0 ? `M ${px.toFixed(1)} ${py.toFixed(1)}` : ` Q ${(-Math.cos(a - 0.2) * r * 0.85).toFixed(1)} ${(Math.sin(a - 0.2) * r * 0.85).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    lines.push(d);
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (flip ? -1 : 1)} ${s})`} opacity={0.75 * t}>
      {lines.map((d, i) => (
        <path key={i} d={d} stroke="#9a9aa4" strokeWidth={1} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} />
      ))}
    </g>
  );
};

/* ---------------- Sofa ---------------- */
export const Sofa: React.FC<Base & {width?: number}> = ({x, y, scale = 1.3, seed = 'sofa', width = 380}) => {
  const w = useW(seed, scale);
  const hw = width / 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={rectPath(w, -hw + 18, -150, width - 36, 96, 18)} fill={C.furn} stroke={C.ink} strokeWidth={SW} />
      <path d={w`M 0 -146 L 0 -70`} stroke={C.ink} strokeWidth={2} opacity={0.6} />
      <path d={rectPath(w, -hw + 30, -74, width - 60, 30, 8)} fill={C.furnLight} stroke={C.ink} strokeWidth={SW} />
      <path d={w`M 0 -72 L 0 -46`} stroke={C.ink} strokeWidth={2} opacity={0.6} />
      <path d={rectPath(w, -hw + 18, -48, width - 36, 34, 6)} fill={C.furn} stroke={C.ink} strokeWidth={SW} />
      <path d={rectPath(w, -hw, -100, 42, 88, 14)} fill={C.furnLight} stroke={C.ink} strokeWidth={SW} />
      <path d={rectPath(w, hw - 42, -100, 42, 88, 14)} fill={C.furnLight} stroke={C.ink} strokeWidth={SW} />
      <path d={w`M ${-hw + 24} -12 L ${-hw + 22} 0 M ${hw - 24} -12 L ${hw - 22} 0`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

/* ---------------- Bed ---------------- */
export const Bed: React.FC<Base> = ({x, y, scale = 1.3, seed = 'bed'}) => {
  const w = useW(seed, scale);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={rectPath(w, -210, -140, 22, 140, 4)} fill={C.grey2} stroke={C.ink} strokeWidth={SW} />
      <path d={rectPath(w, -196, -64, 400, 40, 6)} fill={C.furn} stroke={C.ink} strokeWidth={SW} />
      <path d={rectPath(w, -184, -92, 80, 30, 12)} fill="#d9d2c2" stroke={C.ink} strokeWidth={SW} />
      <path d={w`M -100 -66 Q 40 -86 200 -66 L 200 -40 L -100 -40 Z`} fill="#3b3b48" stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" />
      <path d={w`M -190 -24 L -190 0 M 196 -24 L 196 0`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
};

/* ---------------- Alarm clock ---------------- */
export const AlarmClock: React.FC<Base & {time?: string}> = ({x, y, scale = 1.3, seed = 'alarm', time = '02:47'}) => {
  const w = useW(seed, scale);
  const f = useCurrentFrame();
  const colon = Math.floor(f / 15) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={8} cy={-16} rx={40} ry={18} fill={C.red} opacity={0.12} />
      <path d={rectPath(w, -26, -30, 60, 30, 7)} fill="#232329" stroke={C.ink} strokeWidth={SW} />
      <rect x={-21} y={-25} width={50} height={20} rx={3} fill="#140808" />
      <text x={4} y={-9.5} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={15} fill={C.red} style={{filter: 'drop-shadow(0 0 3px #E53935)'}}>
        {colon ? time : time.replace(':', ' ')}
      </text>
    </g>
  );
};

/* ---------------- Window ---------------- */
export const Window: React.FC<Base & {sky?: 'night' | 'morning' | 'dark'; w?: number; h?: number}> = ({x, y, scale = 1, seed = 'window', sky = 'night', w: ww = 230, h: hh = 270}) => {
  const w = useW(seed, scale);
  const id = useId().replace(/:/g, '');
  const f = useCurrentFrame();
  const stars = [
    [0.15, 0.2],
    [0.75, 0.15],
    [0.35, 0.6],
    [0.85, 0.7],
    [0.6, 0.38],
    [0.2, 0.82],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          {sky === 'morning' ? (
            <>
              <stop offset="0%" stopColor="#f2a0a8" />
              <stop offset="60%" stopColor="#f7b583" />
              <stop offset="100%" stopColor="#ffd59a" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#0f1524" />
              <stop offset="100%" stopColor="#1d2840" />
            </>
          )}
        </linearGradient>
        <clipPath id={`wc${id}`}>
          <rect x={-ww / 2} y={-hh / 2} width={ww} height={hh} />
        </clipPath>
      </defs>
      <path d={rectPath(w, -ww / 2 - 12, -hh / 2 - 12, ww + 24, hh + 24, 4)} fill={C.grey2} stroke={C.ink} strokeWidth={SW} />
      <g clipPath={`url(#wc${id})`}>
        <rect x={-ww / 2} y={-hh / 2} width={ww} height={hh} fill={`url(#sky${id})`} />
        {sky === 'night'
          ? stars.map(([sx, sy], i) => (
              <circle key={i} cx={-ww / 2 + sx * ww} cy={-hh / 2 + sy * hh} r={1.8} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(f * 0.05 + i * 1.7))} />
            ))
          : null}
        {sky === 'night' ? (
          <g>
            <circle cx={ww * 0.18} cy={-hh * 0.2} r={50} fill={C.moon} opacity={0.08} />
            <path d={ellipsePath(w, ww * 0.18, -hh * 0.2, 30, 30)} fill={C.moon} stroke={C.ink} strokeWidth={2} />
            <circle cx={ww * 0.18 - 8} cy={-hh * 0.2 - 6} r={6} fill="#ddd3b8" />
            <circle cx={ww * 0.18 + 10} cy={-hh * 0.2 + 9} r={4} fill="#ddd3b8" />
          </g>
        ) : null}
        {sky === 'morning' ? <circle cx={-ww * 0.15} cy={hh * 0.3} r={34} fill="#fff1c9" opacity={0.95} /> : null}
      </g>
      <path d={w`M 0 ${-hh / 2} L 0 ${hh / 2} M ${-ww / 2} 0 L ${ww / 2} 0`} stroke={C.grey2} strokeWidth={10} />
      <path d={rectPath(w, -ww / 2, -hh / 2, ww, hh, 2)} fill="none" stroke={C.ink} strokeWidth={SW} />
      <path d={rectPath(w, -ww / 2 - 22, hh / 2 + 6, ww + 44, 14, 3)} fill={C.furn} stroke={C.ink} strokeWidth={SW} />
    </g>
  );
};

/* ---------------- Door ---------------- */
export const Door: React.FC<Base & {light?: number; open?: number}> = ({x, y, scale = 1.3, seed = 'door', light = 1}) => {
  const w = useW(seed, scale);
  const id = useId().replace(/:/g, '');
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <radialGradient id={`dl${id}`} cx="0.5" cy="1" r="0.8">
          <stop offset="0%" stopColor="#ffe9b8" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#ffe9b8" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={0} rx={160} ry={26} fill={`url(#dl${id})`} opacity={light} />
      <path d={rectPath(w, -82, -300, 164, 300, 3)} fill={C.grey2} stroke={C.ink} strokeWidth={SW} />
      <path d={rectPath(w, -70, -290, 140, 290, 2)} fill={C.furn} stroke={C.ink} strokeWidth={SW} />
      <path d={rectPath(w, -54, -270, 108, 100, 4)} fill="none" stroke={C.ink} strokeWidth={1.6} opacity={0.6} />
      <path d={rectPath(w, -54, -150, 108, 120, 4)} fill="none" stroke={C.ink} strokeWidth={1.6} opacity={0.6} />
      <circle cx={50} cy={-150} r={7} fill="#c9b98a" stroke={C.ink} strokeWidth={2} />
      <path d={rectPath(w, -46, -232, 92, 34, 5)} fill={C.hero} stroke={C.ink} strokeWidth={SW} />
      <text x={0} y={-207} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={22} fill={C.ink} letterSpacing={1.5}>
        START
      </text>
      <rect x={-70} y={-3} width={140} height={3} fill="#ffe9b8" opacity={0.9 * light} />
    </g>
  );
};

/* ---------------- Mirror ---------------- */
export const Mirror: React.FC<
  Base & {
    crack?: number;
    children?: React.ReactNode; // reflection, drawn in mirror-local coords (center 0,0)
  }
> = ({x, y, scale = 1.3, seed = 'mirror', crack = 0, children}) => {
  const w = useW(seed, scale);
  const id = useId().replace(/:/g, '');
  const cy = -215;
  const cracks: string[] = [];
  const NC = 9;
  for (let i = 0; i < NC; i++) {
    const a = (i / NC) * Math.PI * 2 + rnd(seed + 'ca' + i) * 0.5;
    let px = 12;
    let py = -40;
    let d = `M ${px} ${py}`;
    const segs = 4;
    for (let k = 1; k <= segs; k++) {
      const rr = (k / segs) * (110 + rnd(seed + 'cl' + i) * 60);
      const aa = a + (rnd(seed + 'cj' + i + k) - 0.5) * 0.5;
      px = 12 + Math.cos(aa) * rr;
      py = -40 + Math.sin(aa) * rr * 1.3;
      d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    cracks.push(d);
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <clipPath id={`mc${id}`}>
          <ellipse cx={0} cy={0} rx={84} ry={124} />
        </clipPath>
        <linearGradient id={`mg${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2f3440" />
          <stop offset="100%" stopColor="#1a1d24" />
        </linearGradient>
      </defs>
      <path d={w`M -50 0 L -20 ${cy + 120} M 50 0 L 20 ${cy + 120} M 0 0 L 0 ${cy + 130}`} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
      <path d={w`M -50 0 L -20 ${cy + 120} M 50 0 L 20 ${cy + 120} M 0 0 L 0 ${cy + 130}`} stroke={C.grey2} strokeWidth={5} strokeLinecap="round" />
      <g transform={`translate(0 ${cy})`}>
        <path d={ellipsePath(w, 0, 0, 96, 136)} fill={C.furn} stroke={C.ink} strokeWidth={SW} />
        <ellipse cx={0} cy={0} rx={84} ry={124} fill={`url(#mg${id})`} />
        <g clipPath={`url(#mc${id})`}>
          {children}
          <path d="M -60 -60 L -30 -95 M -64 -30 L -10 -96" stroke="#fff" strokeWidth={4} opacity={0.08} strokeLinecap="round" />
          {crack > 0
            ? cracks.map((d, i) => (
                <g key={i}>
                  <path d={d} stroke={C.red} strokeWidth={6} opacity={0.35} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - crack} strokeLinejoin="round" />
                  <path d={d} stroke="#ff6b5e" strokeWidth={2} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - crack} strokeLinejoin="round" />
                </g>
              ))
            : null}
        </g>
        <path d={ellipsePath(w, 0, 0, 84, 124)} fill="none" stroke={C.ink} strokeWidth={SW} />
      </g>
    </g>
  );
};

/* ---------------- Microphone on stand ---------------- */
export const Microphone: React.FC<Base> = ({x, y, scale = 1.3, seed = 'mic'}) => {
  const w = useW(seed, scale);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={w`M -34 0 L 0 -14 L 34 0`} stroke={C.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d={w`M 0 -14 L 0 -168 L -18 -190`} stroke={C.ink} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={w`M 0 -14 L 0 -168 L -18 -190`} stroke={C.grey2} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(-22 -196) rotate(-40)">
        <path d={rectPath(w, -11, -30, 22, 40, 11)} fill="#565663" stroke={C.ink} strokeWidth={SW} />
        <path d="M -11 -8 L 11 -8 M -11 -16 L 11 -16" stroke={C.ink} strokeWidth={1.5} opacity={0.7} />
      </g>
    </g>
  );
};

/* ---------------- Staircase (diagonal) ---------------- */
export const Staircase: React.FC<{x0: number; y0: number; x1: number; y1: number; steps: number; seed?: string}> = ({x0, y0, x1, y1, steps, seed = 'stairs'}) => {
  const f = useCurrentFrame();
  const w = wobbler(f, seed, 1);
  const sw = (x1 - x0) / steps;
  const sh = (y0 - y1) / steps;
  let d = `M ${x0 - 20} ${y0 + 400}`;
  d += ` L ${x0 - 20} ${y0}`;
  const pts: number[] = [];
  for (let i = 0; i < steps; i++) {
    pts.push(x0 + i * sw, y0 - (i + 1) * sh, x0 + (i + 1) * sw, y0 - (i + 1) * sh);
  }
  let s = '';
  for (let i = 0; i < pts.length; i += 2) s += w` L ${pts[i]} ${pts[i + 1]}`;
  d += ` L ${x0} ${y0 - sh}` + s + ` L ${x1 + 600} ${y1} L ${x1 + 600} ${y0 + 400} Z`;
  return (
    <g>
      <path d={d} fill="#26262d" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
      {Array.from({length: steps}).map((_, i) => (
        <path key={i} d={w`M ${x0 + i * sw} ${y0 - (i + 1) * sh} L ${x0 + (i + 1) * sw} ${y0 - (i + 1) * sh}`} stroke="#5a5a66" strokeWidth={3} strokeLinecap="round" />
      ))}
    </g>
  );
};

/* ---------------- Phone (hand item) ---------------- */
export const Phone: React.FC<{scale?: number; glow?: number; rot?: number}> = ({scale = 1, glow = 1, rot = -15}) => {
  const id = useId().replace(/:/g, '');
  return (
    <g transform={`scale(${scale}) rotate(${rot})`}>
      <defs>
        <radialGradient id={`pg${id}`}>
          <stop offset="0%" stopColor="#dff3ff" stopOpacity={0.6} />
          <stop offset="100%" stopColor="#dff3ff" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={0} cy={-10} r={110} fill={`url(#pg${id})`} opacity={glow} />
      <rect x={-13} y={-34} width={26} height={44} rx={5} fill="#22232a" stroke={C.ink} strokeWidth={2.4} />
      <rect x={-10} y={-30} width={20} height={36} rx={3} fill="#cfefff" opacity={0.4 + 0.6 * glow} />
    </g>
  );
};

/* ---------------- Wall clock ---------------- */
export const WallClock: React.FC<Base & {minute?: number; hour?: number}> = ({x, y, scale = 1.3, seed = 'clock', minute = 50, hour = 300}) => {
  const w = useW(seed, scale);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={ellipsePath(w, 0, 0, 46, 46)} fill={C.hero} stroke={C.ink} strokeWidth={SW} />
      <circle cx={0} cy={0} r={40} fill="none" stroke={C.ink} strokeWidth={1.2} opacity={0.4} />
      {Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={Math.sin(a) * 34} y1={-Math.cos(a) * 34} x2={Math.sin(a) * 39} y2={-Math.cos(a) * 39} stroke={C.ink} strokeWidth={i % 3 === 0 ? 3 : 1.5} />;
      })}
      <line x1={0} y1={0} x2={Math.sin((hour * Math.PI) / 180) * 20} y2={-Math.cos((hour * Math.PI) / 180) * 20} stroke={C.ink} strokeWidth={4.5} strokeLinecap="round" />
      <line x1={0} y1={0} x2={Math.sin((minute * Math.PI) / 180) * 31} y2={-Math.cos((minute * Math.PI) / 180) * 31} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      <circle cx={0} cy={0} r={3.5} fill={C.red} />
    </g>
  );
};

/* ---------------- Camera on tripod with REC ---------------- */
export const RecCamera: React.FC<Base & {rec?: boolean; pressed?: number}> = ({x, y, scale = 1.3, seed = 'cam', rec = false, pressed = 0}) => {
  const w = useW(seed, scale);
  const f = useCurrentFrame();
  const blinkOn = Math.floor(f / 12) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={w`M 0 -150 L -40 0 M 0 -150 L 40 0 M 0 -150 L 4 0`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
      <path d={w`M 0 -150 L -40 0 M 0 -150 L 40 0 M 0 -150 L 4 0`} stroke={C.grey2} strokeWidth={3} strokeLinecap="round" />
      <path d={rectPath(w, -40, -196, 74, 46, 7)} fill="#3b3b46" stroke={C.ink} strokeWidth={SW} />
      <path d={rectPath(w, -66, -186, 28, 26, 4)} fill="#2a2a32" stroke={C.ink} strokeWidth={SW} />
      <circle cx={-68} cy={-173} r={9} fill="#1b1b22" stroke={C.ink} strokeWidth={2} />
      <circle cx={-70} cy={-175} r={3} fill="#9fd3ff" opacity={0.6} />
      <g transform={`translate(18 -205) scale(${1 - pressed * 0.2})`}>
        <circle cx={0} cy={0} r={9} fill={C.red} stroke={C.ink} strokeWidth={2.2} />
      </g>
      {rec ? (
        <g>
          <circle cx={-26} cy={-185} r={4} fill={C.red} opacity={blinkOn ? 1 : 0.2} />
          <text x={-16} y={-180} fontFamily={FONT_BOLD} fontWeight={700} fontSize={13} fill="#fff">
            REC
          </text>
        </g>
      ) : null}
    </g>
  );
};

/* ---------------- Picture frame (wall) ---------------- */
export const Frame: React.FC<Base> = ({x, y, scale = 1.3, seed = 'frame'}) => {
  const w = useW(seed, scale);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={rectPath(w, -50, -38, 100, 76, 3)} fill={C.grey2} stroke={C.ink} strokeWidth={SW} />
      <path d={w`M -38 26 L -12 -6 L 6 14 L 18 2 L 38 26 Z`} fill={C.furn} />
      <circle cx={24} cy={-16} r={7} fill={C.furnLight} />
    </g>
  );
};
