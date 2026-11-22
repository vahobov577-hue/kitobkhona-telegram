import React, {useId} from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT_BOLD, FONT_HAND} from '../theme';
import {clamp, ellipsePath, rectPath, rnd, wobbler} from '../lib';
import {Figure} from './Figure';
import {getRig, solve} from './rig';
import {mixColor} from './Hero';

const SW = 2.6;
const useW = (seed: string, scale = 1) => wobbler(useCurrentFrame(), seed, 1 / scale);

/* ---------------- Handheld phone (hand item / prop) ---------------- */
export type PhoneScreen = 'off' | 'notif' | 'feed' | 'black' | 'lock';
export const HandPhone: React.FC<{scale?: number; rot?: number; screen?: PhoneScreen; glow?: number; faceDown?: boolean; scroll?: number; buzz?: number; battery?: string}> = ({
  scale = 1,
  rot = -15,
  screen = 'feed',
  glow = 1,
  faceDown = false,
  scroll = 0,
  buzz = 0,
  battery,
}) => {
  const f = useCurrentFrame();
  const id = useId().replace(/:/g, '');
  const bz = buzz > 0 ? Math.sin(f * 2.6) * 2.5 * buzz : 0;
  const lit = screen !== 'off' && screen !== 'black' && !faceDown;
  return (
    <g transform={`scale(${scale}) rotate(${rot + bz})`}>
      <defs>
        <radialGradient id={`hp${id}`}>
          <stop offset="0%" stopColor={C.screen} stopOpacity={0.55} />
          <stop offset="100%" stopColor={C.screen} stopOpacity={0} />
        </radialGradient>
        <clipPath id={`hc${id}`}>
          <rect x={-10} y={-31} width={20} height={37} rx={3} />
        </clipPath>
      </defs>
      {lit ? <circle cx={0} cy={-12} r={120} fill={`url(#hp${id})`} opacity={glow} /> : null}
      {buzz > 0 ? (
        <g opacity={buzz}>
          <path d="M -20 -26 q -5 6 0 12 M -25 -30 q -8 10 0 20 M 20 -26 q 5 6 0 12 M 25 -30 q 8 10 0 20" stroke="#fff" strokeWidth={1.6} fill="none" opacity={0.7} />
        </g>
      ) : null}
      <rect x={-13} y={-34} width={26} height={44} rx={5} fill={faceDown ? '#2a2a32' : '#1b1b21'} stroke={C.ink} strokeWidth={2.4} />
      {!faceDown ? (
        <g clipPath={`url(#hc${id})`}>
          <rect x={-10} y={-31} width={20} height={37} fill={screen === 'black' ? '#050507' : screen === 'off' ? '#15161b' : '#dbe8ff'} />
          {screen === 'feed'
            ? Array.from({length: 6}).map((_, i) => {
                const yy = -31 + ((i * 14 - scroll) % 84 + 84) % 84 - 10;
                return (
                  <g key={i}>
                    <rect x={-8} y={yy} width={16} height={9} rx={1.5} fill={i % 2 ? '#9cc2ff' : C.screen} />
                    <rect x={-8} y={yy + 10} width={10} height={1.6} fill="#7f95b8" />
                  </g>
                );
              })
            : null}
          {screen === 'notif' || screen === 'lock' ? (
            <g>
              <text x={0} y={-18} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={7} fill="#24324a">
                23:47
              </text>
              {screen === 'notif' ? <rect x={-9} y={-12} width={18} height={7} rx={2} fill="#fff" stroke={C.red} strokeWidth={0.8} /> : null}
              {screen === 'notif' ? <circle cx={-6} cy={-8.5} r={1.8} fill={C.red} /> : null}
            </g>
          ) : null}
          {battery ? (
            <text x={0} y={-8} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={8} fill={C.red}>
              {battery}
            </text>
          ) : null}
        </g>
      ) : null}
    </g>
  );
};

/* ---------------- Notification badge ---------------- */
export const Notif: React.FC<{x: number; y: number; t: number; n?: number | string; size?: number}> = ({x, y, t, n = 1, size = 22}) => {
  if (t < 0) return null;
  const pop = t < 6 ? 1.35 * Math.sin((t / 6) * Math.PI * 0.75) + (t / 6) * 0.2 : 1;
  const s = clamp(pop, 0, 1.4);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={size} fill={C.red} stroke={C.ink} strokeWidth={2.5} />
      <text y={size * 0.36} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={size * 1.05} fill="#fff">
        {n}
      </text>
    </g>
  );
};

/* ---------------- Feed card ---------------- */
export const FeedCard: React.FC<{x: number; y: number; w?: number; h?: number; seed?: string; likes?: string; rot?: number}> = ({x, y, w = 360, h = 300, seed = 'fc', likes, rot = 0}) => {
  const ww = useW(seed);
  const hue = rnd(seed) < 0.5 ? C.furn : '#3b4a66';
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={rectPath(ww, -w / 2, -h / 2, w, h, 14)} fill="#22232a" stroke={C.ink} strokeWidth={3} />
      <circle cx={-w / 2 + 34} cy={-h / 2 + 32} r={16} fill={C.furnLight} />
      <rect x={-w / 2 + 60} y={-h / 2 + 22} width={w * 0.4} height={8} rx={4} fill="#4a4a55" />
      <rect x={-w / 2 + 60} y={-h / 2 + 36} width={w * 0.25} height={6} rx={3} fill="#3a3a44" />
      <rect x={-w / 2 + 16} y={-h / 2 + 60} width={w - 32} height={h - 120} rx={8} fill={hue} />
      <path d={`M ${-w / 2 + 34} ${h / 2 - 30} c -8 -6 -8 -14 0 -10 c 8 -4 8 4 0 10 Z`} fill={C.red} transform={`scale(1.6) translate(${(-w / 2 + 34) * -0.375} ${(h / 2 - 30) * -0.375})`} />
      {likes ? (
        <text x={-w / 2 + 70} y={h / 2 - 22} fontFamily={FONT_BOLD} fontWeight={700} fontSize={24} fill="#fff">
          {likes}
        </text>
      ) : (
        <rect x={-w / 2 + 70} y={h / 2 - 38} width={90} height={10} rx={5} fill="#4a4a55" />
      )}
    </g>
  );
};

/* ---------------- Nightstand ---------------- */
export const Nightstand: React.FC<{x: number; y: number; scale?: number}> = ({x, y, scale = 1.3}) => {
  const w = useW('ns', scale);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={rectPath(w, -45, -78, 90, 78, 4)} fill={C.furn} stroke={C.ink} strokeWidth={SW} />
      <path d={rectPath(w, -38, -66, 76, 26, 3)} fill={C.furnLight} stroke={C.ink} strokeWidth={2} />
      <circle cx={0} cy={-53} r={3} fill={C.ink} />
      <path d={rectPath(w, -50, -84, 100, 8, 3)} fill={C.furnLight} stroke={C.ink} strokeWidth={SW} />
    </g>
  );
};

/* ---------------- Bed seen from above ---------------- */
export const TopBed: React.FC<{x: number; y: number; scale?: number}> = ({x, y, scale = 1}) => {
  const w = useW('tb', scale);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={rectPath(w, -230, -420, 460, 840, 20)} fill={C.grey2} stroke={C.ink} strokeWidth={4} />
      <path d={rectPath(w, -210, -400, 420, 800, 16)} fill="#3d3d49" stroke={C.ink} strokeWidth={3} />
      <path d={rectPath(w, -150, -385, 300, 110, 30)} fill="#d9d2c2" stroke={C.ink} strokeWidth={3} />
      <path d={w`M -210 30 Q 0 0 210 30 L 210 400 L -210 400 Z`} fill="#4a4a5c" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
      <path d={w`M -200 60 Q 0 36 200 60`} stroke={C.ink} strokeWidth={2} fill="none" opacity={0.5} />
    </g>
  );
};

/* ---------------- Book ---------------- */
export const Book: React.FC<{x: number; y: number; scale?: number; open?: number}> = ({x, y, scale = 1.3, open = 1}) => {
  const w = useW('book', scale);
  const a = open * 60;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={w`M 0 0 L ${-46 * Math.cos((a * Math.PI) / 180)} ${-46 * Math.sin((a * Math.PI) / 180) * 0.35 - 2} L ${-46 * Math.cos((a * Math.PI) / 180)} ${-6 - 46 * Math.sin((a * Math.PI) / 180) * 0.35} L 0 -8 Z`} fill="#e9e2d2" stroke={C.ink} strokeWidth={2} />
      <path d={w`M 0 0 L 46 -2 L 46 -8 L 0 -8 Z`} fill="#e9e2d2" stroke={C.ink} strokeWidth={2} />
      <path d={w`M -46 2 L 48 2 L 48 -2 L -46 -2 Z`} fill="#7a3b3a" stroke={C.ink} strokeWidth={2} />
      {open > 0.5 ? <path d="M 10 -5 L 38 -6 M 10 -3 L 32 -3.5" stroke="#999" strokeWidth={0.8} /> : null}
    </g>
  );
};

/* ---------------- Hourglass (sand can flow sideways) ---------------- */
export const Hourglass: React.FC<{x: number; y: number; scale?: number; level?: number}> = ({x, y, scale = 1.3, level = 0.5}) => {
  const w = useW('hg', scale);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={rectPath(w, -26, -8, 52, 8, 2)} fill={C.furnLight} stroke={C.ink} strokeWidth={2} />
      <path d={rectPath(w, -26, -92, 52, 8, 2)} fill={C.furnLight} stroke={C.ink} strokeWidth={2} />
      <path d={w`M -20 -84 Q -20 -56 -3 -48 Q -20 -40 -20 -8 L 20 -8 Q 20 -40 3 -48 Q 20 -56 20 -84 Z`} fill="#2d3340" stroke={C.ink} strokeWidth={2} opacity={0.9} />
      <path d={`M ${-16 * level} ${-84 + 30 * (1 - level)} L ${16 * level} ${-84 + 30 * (1 - level)} L 2 -52 L -2 -52 Z`} fill="#d8c79a" />
      <path d={`M -16 -9 Q 0 ${-9 - 22 * (1 - level)} 16 -9 Z`} fill="#d8c79a" />
    </g>
  );
};

/* ---------------- Drawer (desk drawer seen from the front) ---------------- */
export const DrawerBox: React.FC<{x: number; y: number; scale?: number; open?: number; shake?: number; leak?: number}> = ({x, y, scale = 1.3, open = 0, shake = 0, leak = 0}) => {
  const f = useCurrentFrame();
  const w = useW('dr', scale);
  const sx = shake ? Math.sin(f * 2.1) * 3 * shake : 0;
  const sy = shake ? Math.cos(f * 2.7) * 1.5 * shake : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={rectPath(w, -170, -150, 340, 150, 6)} fill={C.furn} stroke={C.ink} strokeWidth={SW} />
      {leak > 0 ? (
        <g opacity={leak * (0.7 + 0.3 * Math.sin(f * 0.6))}>
          <rect x={-120} y={-112} width={240} height={5} fill={C.red} style={{filter: 'blur(3px)'}} />
          <rect x={-120} y={-48} width={240} height={5} fill={C.red} style={{filter: 'blur(3px)'}} />
          <rect x={-123} y={-110} width={5} height={64} fill={C.red} style={{filter: 'blur(3px)'}} />
          <rect x={118} y={-110} width={5} height={64} fill={C.red} style={{filter: 'blur(3px)'}} />
        </g>
      ) : null}
      <g transform={`translate(${sx} ${sy + open * 24}) scale(${1 + open * 0.08})`}>
        <path d={rectPath(w, -120, -110, 240, 64, 4)} fill={C.furnLight} stroke={C.ink} strokeWidth={SW} />
        <path d={rectPath(w, -26, -84, 52, 12, 6)} fill={C.grey2} stroke={C.ink} strokeWidth={2} />
      </g>
    </g>
  );
};

/* ---------------- Poster ---------------- */
export const Poster: React.FC<{x: number; y: number; label: string; rot?: number; scale?: number; seed?: string}> = ({x, y, label, rot = 0, scale = 1, seed = 'po'}) => {
  const w = useW(seed, scale);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <path d={rectPath(w, -95, -125, 190, 250, 4)} fill="#e7e0cf" stroke={C.ink} strokeWidth={3} />
      <path d={rectPath(w, -75, -100, 150, 120, 4)} fill="#c9c1ae" stroke={C.ink} strokeWidth={2} />
      {label === 'GYM' ? <path d="M -40 -40 L 40 -40 M -48 -54 L -48 -26 M -40 -58 L -40 -22 M 48 -54 L 48 -26 M 40 -58 L 40 -22" stroke={C.ink} strokeWidth={7} strokeLinecap="round" /> : null}
      {label === 'MY BUSINESS' ? <path d="M -40 0 L -40 -30 L -15 -30 L -15 0 M -5 0 L -5 -55 L 20 -55 L 20 0 M 30 0 L 30 -80 L 55 -80 L 55 0" stroke={C.ink} strokeWidth={4} fill="#9aa3b5" /> : null}
      {label === 'DRAW' ? <path d="M -50 -10 Q -20 -80 10 -30 Q 30 0 55 -60 M 30 -90 L 60 -60" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" /> : null}
      <text x={0} y={70} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={label.length > 6 ? 24 : 36} fill={C.ink}>
        {label}
      </text>
      <circle cx={0} cy={-118} r={4} fill={C.red} />
    </g>
  );
};

/* ---------------- Tear-off calendar ---------------- */
export const Calendar: React.FC<{x: number; y: number; scale?: number; label: string; sub?: string}> = ({x, y, scale = 1.3, label, sub}) => {
  const w = useW('cal', scale);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={rectPath(w, -70, -90, 140, 180, 6)} fill="#e9e2d2" stroke={C.ink} strokeWidth={3} />
      <path d={rectPath(w, -70, -90, 140, 38, 6)} fill={C.red} stroke={C.ink} strokeWidth={3} />
      <circle cx={-35} cy={-90} r={5} fill={C.ink} />
      <circle cx={35} cy={-90} r={5} fill={C.ink} />
      <text x={0} y={30} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={64} fill={C.ink}>
        {label}
      </text>
      {sub ? (
        <text x={0} y={-62} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={20} fill="#fff">
          {sub}
        </text>
      ) : null}
    </g>
  );
};

/* ---------------- A flying calendar sheet ---------------- */
export const Sheet: React.FC<{x: number; y: number; rot: number; label: string; opacity?: number}> = ({x, y, rot, label, opacity = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
    <rect x={-60} y={-60} width={120} height={120} rx={4} fill="#e9e2d2" stroke={C.ink} strokeWidth={3} />
    <text x={0} y={18} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={46} fill={C.ink}>
      {label}
    </text>
  </g>
);

/* ---------------- Friend silhouette ---------------- */
export const Friend: React.FC<{x: number; y: number; frame: number; scale?: number; pose?: 'sit' | 'stand'; warm?: number; opacity?: number; facing?: 1 | -1; laugh?: number; seed?: string; rig?: object}> = ({
  x,
  y,
  frame,
  scale = 1.3,
  pose = 'sit',
  warm = 0,
  opacity = 1,
  facing = 1,
  laugh = 0,
  seed = 'fr',
  rig,
}) => {
  const w = wobbler(frame, seed, 1 / scale);
  const r = {...getRig(pose, frame), ...(rig as object)};
  const j = solve({...r, head: r.head + (laugh ? Math.sin(frame * 0.7) * 6 * laugh - 6 * laugh : 0)});
  const fill = mixColor('#3a3846', '#e9b97a', warm);
  return (
    <g opacity={opacity} transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}>
      {warm > 0.05 ? <Glow cx={0} cy={-150} r={190} color="#ffb661" opacity={0.35 * warm} /> : null}
      <Figure j={j} w={w} fill={fill} ink="#141218" />
    </g>
  );
};

/* ---------------- Speech bubble ---------------- */
export const Bubble: React.FC<{x: number; y: number; w?: number; h?: number; text?: string; opacity?: number; tail?: -1 | 1}> = ({x, y, w = 150, h = 70, text, opacity = 1, tail = 1}) => {
  const ww = useW('bb' + x);
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <path d={ellipsePath(ww, 0, 0, w / 2, h / 2)} fill="#f1ebdd" stroke={C.ink} strokeWidth={3} />
      <path d={`M ${tail * 10} ${h / 2 - 4} L ${tail * 26} ${h / 2 + 22} L ${tail * 30} ${h / 2 - 8} Z`} fill="#f1ebdd" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
      {text ? (
        <text y={10} textAnchor="middle" fontFamily={FONT_HAND} fontSize={30} fill={C.ink}>
          {text}
        </text>
      ) : null}
    </g>
  );
};

/* ---------------- Hill + dawn ---------------- */
export const HILL_TOP = 700;
export const Hill: React.FC = () => {
  const w = useW('hill');
  return (
    <g>
      <path d={w`M -400 ${HILL_TOP + 120} Q 300 ${HILL_TOP + 30} 900 ${HILL_TOP + 150} T 2400 ${HILL_TOP + 90} L 2400 1500 L -400 1500 Z`} fill="#3a1d34" />
      <path d={w`M -300 1500 L -300 ${HILL_TOP + 200} Q 600 ${HILL_TOP - 14} 1000 ${HILL_TOP} Q 1400 ${HILL_TOP + 14} 2300 ${HILL_TOP + 220} L 2300 1500 Z`} fill="#1a1020" stroke={C.ink} strokeWidth={3} />
    </g>
  );
};

/* ---------------- Sun drawing on paper ---------------- */
export const SunDrawing: React.FC<{x: number; y: number; t: number; glow?: number; scale?: number}> = ({x, y, t, glow = 0, scale = 1}) => {
  const circ = clamp(t / 0.5);
  const rays = clamp((t - 0.5) / 0.5);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {glow > 0 ? <circle r={140} fill={C.sun} opacity={0.18 * glow} style={{filter: 'blur(18px)'}} /> : null}
      <circle r={44} fill={glow > 0 ? C.sun : 'none'} fillOpacity={glow} stroke="#3a3a3a" strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - circ} />
      {Array.from({length: 10}).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const k = clamp(rays * 10 - i);
        return <line key={i} x1={Math.cos(a) * 58} y1={Math.sin(a) * 58} x2={Math.cos(a) * (58 + 34 * k)} y2={Math.sin(a) * (58 + 34 * k)} stroke={glow > 0.5 ? '#d9a400' : '#3a3a3a'} strokeWidth={4} strokeLinecap="round" opacity={k > 0 ? 1 : 0} />;
      })}
      {circ >= 1 ? (
        <g>
          <circle cx={-14} cy={-8} r={4} fill="#3a3a3a" />
          <circle cx={14} cy={-8} r={4} fill="#3a3a3a" />
          <path d="M -16 12 Q 0 26 16 12" stroke="#3a3a3a" strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
};

/* ---------------- Pencil (hand item) ---------------- */
export const Pencil: React.FC<{rot?: number}> = ({rot = 30}) => (
  <g transform={`rotate(${rot})`}>
    <rect x={-4} y={-40} width={8} height={40} fill="#f0c33c" stroke={C.ink} strokeWidth={1.6} />
    <path d="M -4 0 L 4 0 L 0 10 Z" fill="#e9d3a8" stroke={C.ink} strokeWidth={1.4} />
  </g>
);

/* ---------------- Soft glow (radial gradient) ---------------- */
export const Glow: React.FC<{cx: number; cy: number; r: number; color: string; opacity?: number; ry?: number}> = ({cx, cy, r, color, opacity = 0.4, ry}) => {
  const id = useId().replace(/:/g, '');
  return (
    <g>
      <defs>
        <radialGradient id={`gl${id}`}>
          <stop offset="0%" stopColor={color} stopOpacity={1} />
          <stop offset="25%" stopColor={color} stopOpacity={0.6} />
          <stop offset="55%" stopColor={color} stopOpacity={0.18} />
          <stop offset="80%" stopColor={color} stopOpacity={0.04} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={r} ry={ry ?? r} fill={`url(#gl${id})`} opacity={opacity} />
    </g>
  );
};
