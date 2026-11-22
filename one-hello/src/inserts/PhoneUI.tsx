import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT_HAND, FONT_TITLE} from '../theme';
import {clamp, EASE_OUT, ramp} from '../lib';

const SW = 380; // screen width
const SH = 780;
const SANS = 'Helvetica, Arial, sans-serif';

/** black silhouette hand holding the phone from below (drawn in phone-local coords) */
export const HoldHand: React.FC<{side?: 1 | -1; thumbX?: number; thumbY?: number; thumb?: boolean}> = ({side = 1, thumbX, thumbY, thumb = true}) => (
  <g fill={C.sil}>
    <path d={`M ${side * 60} ${SH / 2 + 420} L ${side * 40} ${SH / 2 + 60} Q ${side * 30} ${SH / 2 - 40} ${side * -SW / 2 - side * 22} ${SH / 2 - 60} L ${side * -SW / 2 - side * 30} ${SH / 2 + 60} Q ${side * -80} ${SH / 2 + 140} ${side * -120} ${SH / 2 + 420} Z`} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={side > 0 ? SW / 2 - 6 : -SW / 2 - 30} y={SH / 2 - 260 + i * 70} width={36} height={56} rx={18} />
    ))}
    {thumb ? (
      <path
        d={`M ${side * -SW / 2 - side * 20} ${SH / 2 - 40} Q ${side * -SW / 2 + side * 40} ${SH / 2 - 160} ${thumbX ?? side * -60} ${thumbY ?? SH / 2 - 210}`}
        stroke={C.sil}
        strokeWidth={46}
        strokeLinecap="round"
        fill="none"
      />
    ) : null}
  </g>
);

/** finger (index) coming from below to tap at (x, y) in phone coords */
export const Finger: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g fill={C.sil}>
    <path d={`M ${x + 150} ${y + 700} Q ${x + 60} ${y + 260} ${x} ${y + 20}`} stroke={C.sil} strokeWidth={52} strokeLinecap="round" fill="none" />
    <ellipse cx={x + 120} cy={y + 520} rx={120} ry={160} />
  </g>
);

const Popper: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -10 10 L 6 -12 L 12 14 Z" fill="#e2a33b" />
    <circle cx={10} cy={-14} r={3} fill="#e0554a" />
    <circle cx={16} cy={-6} r={2.5} fill="#5aa0e0" />
    <circle cx={4} cy={-18} r={2.5} fill="#6ac06a" />
  </g>
);

const NOTIFS = ['HBD', 'happy bday bro!!', 'Happy birthday!!', 'hbd man', 'Happy b-day Leo!', 'have a great one', 'HBD!!!', 'happy birthday :)', 'bday boy!', 'hbd leo'];

export type PhoneMode =
  | {kind: 'notifs'; t: number}
  | {kind: 'counter'; value: number}
  | {kind: 'chat'; title: string; msgs: {text: string; me?: boolean; meta?: string}[]; scroll?: number}
  | {kind: 'chats'; rows: {name: string; text: string; meta: string; unread?: boolean}[]; scroll?: number}
  | {kind: 'photos'; scroll: number}
  | {kind: 'alarm'; date: string; time: string; label: string; pressed?: 'stop' | 'snooze'}
  | {kind: 'contact'; typed: string; caret: boolean}
  | {kind: 'calling'; name: string; t: number; endPress?: number}
  | {kind: 'connected'; name: string; timer: string}
  | {kind: 'lock'; t: number; n: number}
  | {kind: 'off'};

/** A phone (screen in local coords centred on 0,0). */
export const Phone: React.FC<{x: number; y: number; scale?: number; rot?: number; mode: PhoneMode; buzz?: number; hand?: boolean; glow?: number}> = ({x, y, scale = 1, rot = 0, mode, buzz = 0, hand = true, glow = 1}) => {
  const f = useCurrentFrame();
  const bx = buzz ? Math.sin(f * 2.3) * 4 * buzz : 0;
  const by = buzz ? Math.cos(f * 2.9) * 2 * buzz : 0;
  const clip = `ph${Math.round(x)}${Math.round(y)}`;
  return (
    <g transform={`translate(${x + bx} ${y + by}) rotate(${rot}) scale(${scale})`}>
      <defs>
        <clipPath id={clip}>
          <rect x={-SW / 2} y={-SH / 2} width={SW} height={SH} rx={42} />
        </clipPath>
        <radialGradient id={clip + 'g'}>
          <stop offset="0%" stopColor="#cfe0ff" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#cfe0ff" stopOpacity={0} />
        </radialGradient>
      </defs>
      {mode.kind !== 'off' ? <ellipse cx={0} cy={0} rx={SW * 1.6} ry={SH * 1.0} fill={`url(#${clip}g)`} opacity={glow} /> : null}
      <rect x={-SW / 2 - 16} y={-SH / 2 - 16} width={SW + 32} height={SH + 32} rx={56} fill="#111214" />
      <g clipPath={`url(#${clip})`}>
        <rect x={-SW / 2} y={-SH / 2} width={SW} height={SH} fill={mode.kind === 'off' ? '#050506' : mode.kind === 'alarm' || mode.kind === 'calling' || mode.kind === 'connected' || mode.kind === 'lock' ? '#1d2a44' : '#f3f3f1'} />
        <Screen mode={mode} f={f} />
      </g>
      <rect x={-50} y={-SH / 2 - 4} width={100} height={22} rx={11} fill="#111214" />
      {hand ? <HoldHand /> : null}
    </g>
  );
};

const Screen: React.FC<{mode: PhoneMode; f: number}> = ({mode, f}) => {
  const top = -SH / 2;
  switch (mode.kind) {
    case 'notifs': {
      const n = Math.min(26, Math.floor(mode.t / 3));
      return (
        <g>
          <rect x={-SW / 2} y={top} width={SW} height={SH} fill="#1d2a44" />
          <text x={0} y={top + 110} textAnchor="middle" fontFamily={SANS} fontSize={64} fontWeight={300} fill="#fff">23:47</text>
          {Array.from({length: n}).map((_, i) => {
            const age = mode.t - i * 3;
            const yy = top + 170 + (n - 1 - i) * 74 - Math.max(0, (n - 7)) * 74;
            if (yy > SH / 2 || yy < top + 140) return null;
            const s = clamp(ramp(age, 0, 5, 0.6, 1, EASE_OUT), 0, 1);
            return (
              <g key={i} transform={`translate(0 ${yy}) scale(${s})`} opacity={ramp(age, 0, 3)}>
                <rect x={-SW / 2 + 16} y={0} width={SW - 32} height={64} rx={16} fill="#f2f2f0" opacity={0.95} />
                <circle cx={-SW / 2 + 46} cy={32} r={16} fill={['#e0a04b', '#5a8ad0', '#6ab06a', '#d0605a'][i % 4]} />
                <text x={-SW / 2 + 72} y={28} fontFamily={SANS} fontWeight={700} fontSize={17} fill="#222">{['Sam', 'Jess', 'Mark', 'Anna', 'Tom', 'Kate', 'Ali', 'Ben'][i % 8]}</text>
                <text x={-SW / 2 + 72} y={50} fontFamily={SANS} fontSize={17} fill="#444">{NOTIFS[i % NOTIFS.length]}</text>
                {i % 3 === 0 ? <Popper x={SW / 2 - 46} y={32} s={1.2} /> : null}
              </g>
            );
          })}
        </g>
      );
    }
    case 'counter':
      return (
        <g>
          <rect x={-SW / 2} y={top} width={SW} height={SH} fill="#1d2a44" />
          <text x={0} y={-40} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={150} fill="#fff">{Math.round(mode.value)}</text>
          <text x={0} y={30} textAnchor="middle" fontFamily={SANS} fontSize={30} fill="#b9c6dd">birthday wishes</text>
          <Popper x={0} y={120} s={4} />
        </g>
      );
    case 'chats':
      return (
        <g transform={`translate(0 ${-(mode.scroll ?? 0)})`}>
          <text x={-SW / 2 + 24} y={top + 80} fontFamily={SANS} fontWeight={700} fontSize={40} fill="#111">Chats</text>
          {mode.rows.map((r, i) => (
            <g key={i} transform={`translate(0 ${top + 120 + i * 110})`}>
              <circle cx={-SW / 2 + 52} cy={40} r={32} fill="#b9bcc2" />
              <circle cx={-SW / 2 + 52} cy={30} r={12} fill="#7d8188" />
              <text x={-SW / 2 + 100} y={30} fontFamily={SANS} fontWeight={700} fontSize={22} fill="#111">{r.name}</text>
              <text x={-SW / 2 + 100} y={60} fontFamily={SANS} fontSize={19} fill={r.unread ? '#111' : '#777'}>{r.text}</text>
              <text x={SW / 2 - 20} y={30} textAnchor="end" fontFamily={SANS} fontSize={16} fill="#999">{r.meta}</text>
              {r.unread ? <circle cx={SW / 2 - 30} cy={58} r={9} fill="#3478f6" /> : null}
              <rect x={-SW / 2 + 100} y={92} width={SW - 120} height={1.5} fill="#ddd" />
            </g>
          ))}
        </g>
      );
    case 'chat':
      return (
        <g>
          <rect x={-SW / 2} y={top} width={SW} height={90} fill="#e8e8e6" />
          <text x={0} y={top + 60} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={26} fill="#111">{mode.title}</text>
          <g transform={`translate(0 ${-(mode.scroll ?? 0)})`}>
            {mode.msgs.map((m, i) => {
              const yy = top + 140 + i * 120;
              const w = Math.min(SW - 80, 30 + m.text.length * 12);
              const x0 = m.me ? SW / 2 - 20 - w : -SW / 2 + 20;
              return (
                <g key={i}>
                  {m.meta ? <text x={0} y={yy - 14} textAnchor="middle" fontFamily={SANS} fontSize={15} fill="#999">{m.meta}</text> : null}
                  <rect x={x0} y={yy} width={w} height={54} rx={22} fill={m.me ? '#3478f6' : '#e4e4e2'} />
                  <text x={x0 + 18} y={yy + 35} fontFamily={SANS} fontSize={20} fill={m.me ? '#fff' : '#111'}>{m.text}</text>
                </g>
              );
            })}
          </g>
        </g>
      );
    case 'photos':
      return (
        <g transform={`translate(0 ${-mode.scroll})`}>
          {Array.from({length: 18}).map((_, i) => {
            const cx = -SW / 2 + 8 + (i % 2) * (SW / 2);
            const cy = top + 8 + Math.floor(i / 2) * 250;
            return (
              <g key={i}>
                <rect x={cx} y={cy} width={SW / 2 - 16} height={240} fill={['#c9b9a2', '#a9b9c9', '#c2c9a9', '#d0b0a8'][i % 4]} />
                {[0, 1, 2, 3].map((k) => (
                  <g key={k} transform={`translate(${cx + 30 + k * 38} ${cy + 230})`} fill={C.sil}>
                    <circle cx={0} cy={-90 - (k % 2) * 8} r={15} />
                    <path d="M -15 -72 L 15 -72 L 10 0 L -10 0 Z" />
                  </g>
                ))}
                <path d={`M ${cx + 130} ${cy + 26} l 16 0 M ${cx + 138} ${cy + 18} l 0 16`} stroke="#fff" strokeWidth={4} opacity={0.5} />
              </g>
            );
          })}
        </g>
      );
    case 'alarm':
      return (
        <g>
          <text x={0} y={top + 170} textAnchor="middle" fontFamily={SANS} fontSize={28} fill="#c9d3e6">{mode.date}</text>
          <text x={0} y={top + 300} textAnchor="middle" fontFamily={SANS} fontWeight={300} fontSize={130} fill="#fff">{mode.time}</text>
          <text x={0} y={top + 360} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={22} fill="#dfe6f2" letterSpacing={2}>{mode.label}</text>
          <g transform={`translate(0 ${top + 500}) scale(${mode.pressed === 'snooze' ? 0.92 : 1})`}>
            <rect x={-120} y={-36} width={240} height={72} rx={36} fill="#fff" />
            <text x={0} y={12} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={30} fill="#1d2a44">SNOOZE</text>
          </g>
          <g transform={`translate(0 ${top + 600}) scale(${mode.pressed === 'stop' ? 0.9 : 1})`}>
            <rect x={-80} y={-28} width={160} height={56} rx={28} fill={mode.pressed === 'stop' ? '#d9443a' : 'none'} stroke="#8fa0c0" strokeWidth={3} />
            <text x={0} y={10} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={24} fill="#c9d3e6">STOP</text>
          </g>
        </g>
      );
    case 'contact':
      return (
        <g>
          <rect x={-SW / 2} y={top} width={SW} height={110} fill="#e8e8e6" />
          <circle cx={0} cy={top + 60} r={30} fill="#b9bcc2" />
          <text x={0} y={top + 135} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={28} fill="#111">DAN</text>
          <text x={0} y={top + 200} textAnchor="middle" fontFamily={SANS} fontSize={16} fill="#999">2 years ago</text>
          <rect x={-SW / 2 + 20} y={top + 220} width={300} height={70} rx={24} fill="#e4e4e2" />
          <text x={-SW / 2 + 40} y={top + 252} fontFamily={SANS} fontSize={19} fill="#111">congrats on the new</text>
          <text x={-SW / 2 + 40} y={top + 276} fontFamily={SANS} fontSize={19} fill="#111">job man!</text>
          <text x={-SW / 2 + 30} y={top + 314} fontFamily={SANS} fontSize={14} fill="#aaa">Seen</text>
          <rect x={-SW / 2 + 16} y={SH / 2 - 330} width={SW - 32} height={56} rx={28} fill="#fff" stroke="#ccc" strokeWidth={2} />
          <text x={-SW / 2 + 40} y={SH / 2 - 294} fontFamily={SANS} fontSize={22} fill="#111">{mode.typed}{mode.caret ? '|' : ''}</text>
          <rect x={-SW / 2} y={SH / 2 - 260} width={SW} height={260} fill="#d4d5d8" />
          {Array.from({length: 27}).map((_, i) => (
            <rect key={i} x={-SW / 2 + 10 + (i % 10) * 36} y={SH / 2 - 245 + Math.floor(i / 10) * 60} width={30} height={48} rx={6} fill="#fff" />
          ))}
          <g transform={`translate(${SW / 2 - 60} ${top + 60})`}>
            <rect x={-34} y={-24} width={68} height={48} rx={24} fill="#3fa65a" />
            <text x={0} y={8} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={17} fill="#fff">CALL</text>
          </g>
        </g>
      );
    case 'calling':
      return (
        <g>
          <circle cx={0} cy={top + 220} r={70} fill="#3a4a6a" />
          <circle cx={0} cy={top + 200} r={26} fill="#7d8aa6" />
          <text x={0} y={top + 350} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={44} fill="#fff">{mode.name}</text>
          <text x={0} y={top + 395} textAnchor="middle" fontFamily={SANS} fontSize={24} fill="#c9d3e6">calling{'.'.repeat(1 + (Math.floor(mode.t / 15) % 3))}</text>
          {[0, 1, 2].map((i) => {
            const r = ((mode.t * 2 + i * 40) % 120) + 70;
            return <circle key={i} cx={0} cy={top + 220} r={r} fill="none" stroke="#fff" strokeWidth={2} opacity={(1 - (r - 70) / 120) * 0.4} />;
          })}
          <g transform={`translate(0 ${SH / 2 - 140}) scale(${1 - (mode.endPress ?? 0) * 0.1})`}>
            <circle r={48} fill="#d9443a" />
            <path d="M -22 4 Q 0 -14 22 4" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />
          </g>
        </g>
      );
    case 'connected':
      return (
        <g>
          <circle cx={0} cy={top + 220} r={70} fill="#5a6a4a" />
          <circle cx={0} cy={top + 200} r={26} fill="#a6b48a" />
          <text x={0} y={top + 350} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={44} fill="#fff">{mode.name}</text>
          <text x={0} y={top + 400} textAnchor="middle" fontFamily={SANS} fontSize={34} fill="#ffd28a">{mode.timer}</text>
          <g transform={`translate(0 ${SH / 2 - 140})`}>
            <circle r={48} fill="#d9443a" />
          </g>
        </g>
      );
    case 'lock': {
      const n = Math.min(6, Math.floor(mode.t / 12) + 1);
      return (
        <g>
          <text x={0} y={top + 130} textAnchor="middle" fontFamily={SANS} fontWeight={300} fontSize={80} fill="#fff">20:14</text>
          {Array.from({length: n}).map((_, i) => (
            <g key={i} transform={`translate(0 ${top + 190 + i * 80})`}>
              <rect x={-SW / 2 + 16} y={0} width={SW - 32} height={68} rx={16} fill="#f2f2f0" opacity={0.92} />
              <text x={-SW / 2 + 36} y={42} fontFamily={SANS} fontSize={19} fill="#333">{mode.n + i * 3} new likes</text>
            </g>
          ))}
        </g>
      );
    }
    default:
      return null;
  }
};

export {FONT_HAND, FONT_TITLE};
