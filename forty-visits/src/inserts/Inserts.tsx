import React from 'react';
import {C, FONT_HAND, FONT_TITLE} from '../theme';
import {clamp, rnd} from '../lib';

const SANS = 'Helvetica, Arial, sans-serif';
const SW = 380;
const SH = 780;

const PhoneIcon: React.FC<{x: number; y: number; s?: number; color?: string; rot?: number}> = ({x, y, s = 1, color = '#fff', rot = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <path d="M -12 -14 Q -16 -2 -6 10 Q 6 20 16 14 L 12 6 Q 6 8 0 2 Q -6 -4 -4 -10 Z" fill={color} />
  </g>
);

/** big phone lying on a desk (no hand): incoming MOM call / missed calls / connected */
export const DeskPhone: React.FC<{x: number; y: number; s?: number; rot?: number; mode: 'incoming' | 'missed' | 'off' | 'connected'; pressed?: 'red' | 'green'; buzz?: number; frame: number; timer?: string}> = ({x, y, s = 1, rot = 0, mode, pressed, buzz = 0, frame, timer = '0:01'}) => {
  const bx = buzz ? Math.sin(frame * 2.4) * 5 * buzz : 0;
  const by = buzz ? Math.cos(frame * 3.1) * 3 * buzz : 0;
  return (
    <g transform={`translate(${x + bx} ${y + by}) rotate(${rot}) scale(${s})`}>
      <rect x={-SW / 2 - 18 + 14} y={-SH / 2 - 18 + 18} width={SW + 36} height={SH + 36} rx={58} fill="#000" opacity={0.3} />
      <rect x={-SW / 2 - 18} y={-SH / 2 - 18} width={SW + 36} height={SH + 36} rx={58} fill="#111214" />
      <rect x={-SW / 2} y={-SH / 2} width={SW} height={SH} rx={42} fill={mode === 'off' ? '#060607' : '#1d2a44'} />
      {mode === 'incoming' || mode === 'connected' ? (
        <g>
          <circle cx={0} cy={-200} r={74} fill="#5a6a8a" />
          <circle cx={0} cy={-216} r={28} fill="#9aa8c6" />
          <path d="M -46 -150 Q 0 -196 46 -150" fill="#9aa8c6" />
          <text x={0} y={-80} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={58} fill="#fff">MOM</text>
          <text x={0} y={-36} textAnchor="middle" fontFamily={SANS} fontSize={26} fill="#c9d3e6">{mode === 'connected' ? timer : 'mobile'}</text>
          {mode === 'incoming'
            ? [0, 1, 2].map((i) => {
                const r = ((frame * 2 + i * 40) % 120) + 74;
                return <circle key={i} cx={0} cy={-200} r={r} fill="none" stroke="#fff" strokeWidth={2} opacity={(1 - (r - 74) / 120) * 0.4} />;
              })
            : null}
          <g transform={`translate(-100 260) scale(${pressed === 'red' ? 0.88 : 1})`}>
            <circle r={58} fill="#d9443a" />
            <PhoneIcon x={0} y={0} s={1.8} rot={135} />
          </g>
          {mode === 'incoming' ? (
            <g transform={`translate(100 260) scale(${pressed === 'green' ? 0.88 : 1})`}>
              <circle r={58} fill="#3fa65a" />
              <PhoneIcon x={0} y={0} s={1.8} />
            </g>
          ) : null}
        </g>
      ) : null}
      {mode === 'missed' ? (
        <g>
          <text x={0} y={-230} textAnchor="middle" fontFamily={SANS} fontWeight={300} fontSize={86} fill="#fff">13:12</text>
          <g transform="translate(0 -120)">
            <rect x={-SW / 2 + 18} y={-48} width={SW - 36} height={110} rx={22} fill="#f2f2f0" />
            <circle cx={-SW / 2 + 64} cy={6} r={26} fill="#d9443a" />
            <PhoneIcon x={-SW / 2 + 64} y={6} s={1.1} />
            <text x={-SW / 2 + 104} y={-4} fontFamily={SANS} fontWeight={700} fontSize={24} fill="#222">Missed calls</text>
            <text x={-SW / 2 + 104} y={30} fontFamily={SANS} fontSize={24} fill="#d9443a">from Mom (14)</text>
          </g>
        </g>
      ) : null}
    </g>
  );
};

/** chat with mom (phone screen content, centred in a 380×780 screen) */
export const MomChat: React.FC<{x: number; y: number; s?: number; rot?: number; scroll?: number; voice?: boolean}> = ({x, y, s = 1, rot = 0, scroll = 0, voice = true}) => {
  const msgs = ['Did you eat?', "Are you warm? It's cold there", 'Dad fixed the gate :)'];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-SW / 2 - 16} y={-SH / 2 - 16} width={SW + 32} height={SH + 32} rx={56} fill="#111214" />
      <clipPath id="momchat">
        <rect x={-SW / 2} y={-SH / 2} width={SW} height={SH} rx={42} />
      </clipPath>
      <g clipPath="url(#momchat)">
        <rect x={-SW / 2} y={-SH / 2} width={SW} height={SH} fill="#f3f3f1" />
        <g transform={`translate(0 ${-scroll})`}>
          {msgs.map((m, i) => (
            <g key={i} transform={`translate(${-SW / 2 + 20} ${-SH / 2 + 130 + i * 110})`}>
              <rect width={Math.min(330, 40 + m.length * 11)} height={60} rx={24} fill="#e4e4e2" />
              <text x={18} y={38} fontFamily={SANS} fontSize={21} fill="#111">{m}</text>
              {i === 2 ? <path d="M 220 26 q 6 -10 12 0 q 6 -10 12 0 q -12 16 -12 16 q 0 0 -12 -16 Z" fill={C.red} /> : null}
            </g>
          ))}
          {voice ? (
            <g transform={`translate(${-SW / 2 + 20} ${-SH / 2 + 470})`}>
              <rect width={300} height={70} rx={30} fill="#e4e4e2" />
              <circle cx={36} cy={35} r={22} fill="#3478f6" />
              <path d="M 30 24 L 46 35 L 30 46 Z" fill="#fff" />
              {Array.from({length: 22}).map((_, i) => (
                <rect key={i} x={70 + i * 8} y={35 - (4 + rnd('w' + i) * 18)} width={4} height={(4 + rnd('w' + i) * 18) * 2} rx={2} fill="#9aa0a8" />
              ))}
              <text x={256} y={42} fontFamily={SANS} fontSize={17} fill="#666">0:47</text>
              <circle cx={318} cy={35} r={8} fill="#3478f6" />
            </g>
          ) : null}
        </g>
        <rect x={-SW / 2} y={-SH / 2} width={SW} height={90} fill="#e8e8e6" />
        <text x={0} y={-SH / 2 + 60} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={28} fill="#111">Mom</text>
      </g>
    </g>
  );
};

/** voice message player: waveform with progress + lines of transcript appearing */
export const VoiceMessage: React.FC<{x: number; y: number; s?: number; progress: number; lines: string[]; shown: number}> = ({x, y, s = 1, progress, lines, shown}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-560} y={-90} width={1120} height={180} rx={90} fill="#1d2a44" />
    <circle cx={-470} cy={0} r={56} fill="#3478f6" />
    {progress > 0 && progress < 1 ? (
      <g fill="#fff">
        <rect x={-490} y={-22} width={12} height={44} rx={3} />
        <rect x={-462} y={-22} width={12} height={44} rx={3} />
      </g>
    ) : (
      <path d="M -488 -26 L -446 0 L -488 26 Z" fill="#fff" />
    )}
    {Array.from({length: 60}).map((_, i) => {
      const hh = 8 + rnd('vm' + i) * 46;
      const played = i / 60 < progress;
      return <rect key={i} x={-380 + i * 13} y={-hh} width={7} height={hh * 2} rx={3} fill={played ? '#ffffff' : '#5a6a8a'} />;
    })}
    <text x={430} y={14} fontFamily={SANS} fontSize={34} fill="#c9d3e6">0:{String(Math.floor(47 * progress)).padStart(2, '0')}</text>
    {lines.map((l, i) => (
      <text key={i} x={0} y={190 + i * 78} textAnchor="middle" fontFamily={FONT_HAND} fontSize={56} fill="#f2f0ea" opacity={clamp(shown - i)}>
        {l}
      </text>
    ))}
  </g>
);

/** paper calendar with handwritten plans; entries get crossed out (cross 0..1 each) */
export const PlanCalendar: React.FC<{x: number; y: number; s?: number; entries: {text: string; cross: number; show: number}[]; month?: string}> = ({x, y, s = 1, entries, month = 'PLANS'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-300 + 10} y={-380 + 12} width={600} height={760} fill="#000" opacity={0.18} />
    <rect x={-300} y={-380} width={600} height={760} fill="#fbfaf6" />
    <rect x={-300} y={-380} width={600} height={90} fill="#d9d4c8" />
    <text x={0} y={-318} textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={600} fontSize={46} letterSpacing={6} fill="#333">{month}</text>
    {Array.from({length: 7}).map((_, i) => (
      <line key={i} x1={-260} y1={-200 + i * 80} x2={260} y2={-200 + i * 80} stroke="#c9d6e6" strokeWidth={2} />
    ))}
    {entries.map((e, i) => {
      const yy = -230 + i * 160;
      const w = e.text.length * 26;
      return (
        <g key={i} opacity={clamp(e.show)}>
          <text x={0} y={yy + 40} textAnchor="middle" fontFamily={FONT_HAND} fontSize={64} fill="#222">{e.text}</text>
          <path d={`M ${-w / 2 - 10} ${yy + 40} Q 0 ${yy + 10} ${w / 2 + 10} ${yy + 20}`} stroke={C.red} strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(e.cross)} />
          <path d={`M ${-w / 2 - 10} ${yy + 10} L ${w / 2 + 10} ${yy + 50}`} stroke={C.red} strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(e.cross * 1.6 - 0.6)} />
        </g>
      );
    })}
  </g>
);

/** paper napkin with handwriting revealed line by line (reveal = number of lines, fractional) */
export const Napkin: React.FC<{x: number; y: number; s?: number; rot?: number; reveal: number; circle?: number; strike?: number; extra?: number}> = ({x, y, s = 1, rot = 0, reveal, circle = 0, strike = 0, extra = 0}) => {
  const lines = ['Mom: 62', 'Me: 34', '2 visits / year', '~20 years'];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M -330 -330 L 330 -322 L 326 330 L -324 336 Z" fill="#f4f1ea" />
      <path d="M -330 -330 L 330 -322 L 326 330 L -324 336 Z" fill="none" stroke="#d9d4c8" strokeWidth={3} strokeDasharray="8 6" />
      {lines.map((l, i) => {
        const k = clamp(reveal - i);
        return (
          <g key={i}>
            <clipPath id={`nk${i}`}>
              <rect x={-260} y={-260 + i * 90} width={520 * k} height={90} />
            </clipPath>
            <text x={-250} y={-200 + i * 90} fontFamily={FONT_HAND} fontSize={66} fill="#2a3a6a" clipPath={`url(#nk${i})`}>{l}</text>
          </g>
        );
      })}
      <g opacity={clamp(reveal - 4)}>
        <text x={-40} y={210} fontFamily={FONT_HAND} fontSize={110} fill="#2a3a6a">= 40</text>
        <ellipse cx={70} cy={176} rx={150} ry={80} fill="none" stroke="#2a3a6a" strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(circle)} transform="rotate(-6 70 176)" />
      </g>
      {strike > 0 ? <path d="M -60 190 L 220 150" stroke={C.red} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(strike)} /> : null}
      {extra > 0 ? (
        <g>
          <clipPath id="nkx">
            <rect x={-300} y={240} width={600 * clamp(extra)} height={90} />
          </clipPath>
          <text x={-250} y={300} fontFamily={FONT_HAND} fontSize={70} fill={C.red} clipPath="url(#nkx)">+ every Sunday</text>
        </g>
      ) : null}
    </g>
  );
};

/** glass jar with `n` white marbles (0..~60); a marble can be falling at (fx, fy) */
export const MarbleJar: React.FC<{x: number; y: number; s?: number; n: number; falling?: [number, number] | null}> = ({x, y, s = 1, n, falling}) => {
  const marbles: [number, number][] = [];
  const R = 22;
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / 6);
    const col = i % 6;
    marbles.push([-110 + col * 44 + (row % 2) * 20 + (rnd('mj' + i) - 0.5) * 6, -R - row * 38]);
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={170} ry={20} fill="#000" opacity={0.25} />
      <path d="M -150 -470 L -150 -20 Q -150 0 -130 0 L 130 0 Q 150 0 150 -20 L 150 -470 Z" fill="#cfe3ea" opacity={0.18} />
      {marbles.map(([mx, my], i) => (
        <g key={i}>
          <circle cx={mx} cy={my} r={R} fill="#f4f4f0" />
          <circle cx={mx - 7} cy={my - 8} r={6} fill="#fff" />
          <circle cx={mx} cy={my} r={R} fill="none" stroke="#c9c9c4" strokeWidth={2} />
        </g>
      ))}
      {falling ? (
        <g>
          <circle cx={falling[0]} cy={falling[1]} r={R} fill="#f4f4f0" />
          <circle cx={falling[0] - 7} cy={falling[1] - 8} r={6} fill="#fff" />
        </g>
      ) : null}
      <path d="M -150 -470 L -150 -20 Q -150 0 -130 0 L 130 0 Q 150 0 150 -20 L 150 -470" fill="none" stroke="#e8f2f5" strokeWidth={6} opacity={0.7} />
      <rect x={-130} y={-440} width={18} height={380} rx={9} fill="#fff" opacity={0.25} />
      <rect x={-160} y={-500} width={320} height={34} rx={10} fill="#a9b6bb" opacity={0.7} />
    </g>
  );
};

/** laptop screen content: boss email + mom chat; cursor at (cx, cy) in screen coords; reply state */
export const TwoWindows: React.FC<{cursor: [number, number]; reply?: number; sent?: boolean}> = ({cursor, reply = 0, sent = false}) => {
  const replyText = 'Taking Saturday off.';
  return (
    <g>
      <rect x={0} y={0} width={760} height={470} fill="#dfe4ea" />
      {/* email */}
      <g transform="translate(20 30)">
        <rect width={420} height={300} rx={8} fill="#fff" />
        <rect width={420} height={40} rx={8} fill="#5a6a7a" />
        <text x={16} y={27} fontFamily={SANS} fontWeight={700} fontSize={18} fill="#fff">Mail — from: Boss</text>
        <text x={20} y={90} fontFamily={SANS} fontWeight={700} fontSize={22} fill="#111">Need you this Saturday.</text>
        <rect x={20} y={110} width={300} height={8} fill="#ddd" />
        <rect x={20} y={130} width={240} height={8} fill="#ddd" />
        {reply > 0 ? (
          <g>
            <rect x={20} y={180} width={380} height={50} rx={6} fill="#f2f4f8" stroke="#9ab" />
            <text x={34} y={213} fontFamily={SANS} fontSize={20} fill="#111">{replyText.slice(0, Math.floor(replyText.length * clamp(reply)))}</text>
            <rect x={300} y={246} width={100} height={36} rx={6} fill={sent ? '#3fa65a' : '#3478f6'} />
            <text x={350} y={270} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={17} fill="#fff">{sent ? 'Sent ✓' : 'Send'}</text>
          </g>
        ) : null}
      </g>
      {/* mom chat */}
      <g transform="translate(460 90)">
        <rect width={280} height={330} rx={8} fill="#fff" />
        <rect width={280} height={40} rx={8} fill="#e2a64b" />
        <text x={16} y={27} fontFamily={SANS} fontWeight={700} fontSize={18} fill="#fff">Mom</text>
        <rect x={14} y={60} width={250} height={120} rx={18} fill="#f1e6d4" />
        <text x={28} y={95} fontFamily={SANS} fontSize={17} fill="#111">Dad&apos;s birthday Saturday.</text>
        <text x={28} y={122} fontFamily={SANS} fontSize={17} fill="#111">Don&apos;t worry if you</text>
        <text x={28} y={149} fontFamily={SANS} fontSize={17} fill="#111">can&apos;t come</text>
        <path d="M 130 140 q 5 -9 10 0 q 5 -9 10 0 q -10 14 -10 14 q 0 0 -10 -14 Z" fill={C.red} />
      </g>
      <path d={`M ${cursor[0]} ${cursor[1]} l 0 26 l 7 -6 l 6 12 l 5 -2 l -6 -12 l 9 0 Z`} fill="#111" stroke="#fff" strokeWidth={1.5} />
    </g>
  );
};

/** calculator on the laptop screen */
export const CalcScreen: React.FC<{reveal: number; result: number}> = ({reveal, result}) => {
  const line = '2 visits a year × 20 years =';
  return (
    <g>
      <rect x={0} y={0} width={760} height={470} fill="#1d1f24" />
      <text x={730} y={150} textAnchor="end" fontFamily={SANS} fontSize={38} fill="#9aa0aa">{line.slice(0, Math.floor(line.length * clamp(reveal)))}</text>
      <text x={730} y={380} textAnchor="end" fontFamily={SANS} fontWeight={300} fontSize={230 * (0.6 + 0.4 * clamp(result))} fill="#fff" opacity={clamp(result * 3)}>40</text>
    </g>
  );
};

/** train ticket */
export const Ticket: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-420 + 10} y={-170 + 12} width={840} height={340} rx={20} fill="#000" opacity={0.2} />
    <rect x={-420} y={-170} width={840} height={340} rx={20} fill="#f6efe0" />
    <rect x={-420} y={-170} width={840} height={70} rx={20} fill="#c96d5a" />
    <text x={-380} y={-122} fontFamily={FONT_TITLE} fontWeight={600} fontSize={34} letterSpacing={6} fill="#fff">RAIL TICKET</text>
    <text x={0} y={10} textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={600} fontSize={70} letterSpacing={4} fill="#222">CITY → HOMETOWN</text>
    <text x={0} y={100} textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={600} fontSize={52} letterSpacing={6} fill="#c96d5a">SAT 06:10</text>
    <line x1={250} y1={-100} x2={250} y2={170} stroke="#c9b9a2" strokeWidth={4} strokeDasharray="12 10" />
  </g>
);
