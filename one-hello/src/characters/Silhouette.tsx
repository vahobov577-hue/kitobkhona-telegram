import React from 'react';
import {C} from '../theme';
import {rnd} from '../lib';
import {getRig, lerpRig, Pose, Rig, solve, V} from './rig';

export type Expr = 'neutral' | 'sad' | 'happy' | 'surprised' | 'worried' | 'tired' | 'determined' | 'closed' | 'awkward';
export type Acc = 'none' | 'mia' | 'dan' | 'neighbor' | 'headphones' | 'pony' | 'kid';

export type SilProps = {
  x: number;
  y: number;
  frame: number;
  scale?: number;
  facing?: 1 | -1;
  pose?: Pose;
  poseTo?: Pose;
  poseT?: number;
  rig?: Partial<Rig>;
  expr?: Expr;
  look?: [number, number]; // pupil offset
  tilt?: number; // extra head tilt (deg)
  acc?: Acc;
  handItem?: React.ReactNode;
  handItemBack?: React.ReactNode;
  opacity?: number;
  seed?: string;
  speed?: number;
  fill?: string;
  talk?: number; // 0..1 head bob while speaking
  eyeGlow?: string; // tint of the eye whites (e.g. phone light)
  rot?: number;
  bodyScale?: number;
  back?: boolean; // seen from behind: no face
};

const HEAD_R = 46;
const LIMB = 6.5;
const MITT = 6.5;

export const resolveSil = (p: Pick<SilProps, 'pose' | 'poseTo' | 'poseT' | 'rig' | 'frame' | 'speed'>) => {
  let r = getRig(p.pose ?? 'stand', p.frame, p.speed ?? 1);
  if (p.poseTo && (p.poseT ?? 0) > 0) r = lerpRig(r, getRig(p.poseTo, p.frame, p.speed ?? 1), Math.min(1, p.poseT ?? 0));
  return solve({...r, ...p.rig});
};

/** world position of a joint */
export const silJoint = (p: SilProps, key: 'haF' | 'haB' | 'head' | 'neck' | 'hip'): V => {
  const j = resolveSil(p);
  const s = p.scale ?? 1.3;
  const fc = p.facing ?? 1;
  return [p.x + j[key][0] * s * fc, p.y + j[key][1] * s];
};

const Eyes: React.FC<{expr: Expr; blink: number; look: [number, number]; glow?: string}> = ({expr, blink, look, glow}) => {
  const W = glow ?? C.eye;
  const ex = [-15, 15];
  const ey = -4;
  const brow = (x: number, side: number) => {
    // inner end points to the face centre
    const ix = x - side * 7; // inner x
    const ox = x + side * 7; // outer x
    const by = ey - 15;
    let d = `M ${ox} ${by + 1} Q ${x} ${by - 3} ${ix} ${by + 1}`; // neutral: soft arc
    if (expr === 'sad' || expr === 'worried' || expr === 'awkward') d = `M ${ox} ${by + 3} L ${ix} ${by - 4}`; // inner up
    if (expr === 'surprised') d = `M ${ox} ${by - 3} Q ${x} ${by - 9} ${ix} ${by - 3}`;
    if (expr === 'determined') d = `M ${ox} ${by - 3} L ${ix} ${by + 3}`; // inner down
    if (expr === 'happy') d = `M ${ox} ${by} Q ${x} ${by - 4} ${ix} ${by}`;
    if (expr === 'tired') d = `M ${ox} ${by + 4} L ${ix} ${by + 3}`;
    return <path d={d} stroke={W} strokeWidth={3} strokeLinecap="round" fill="none" />;
  };
  return (
    <g>
      {ex.map((x, i) => {
        const side = i === 0 ? -1 : 1;
        if (expr === 'happy') {
          return (
            <g key={i}>
              <path d={`M ${x - 8} ${ey + 3} Q ${x} ${ey - 7} ${x + 8} ${ey + 3}`} stroke={W} strokeWidth={3.6} fill="none" strokeLinecap="round" />
              {brow(x, side)}
            </g>
          );
        }
        if (expr === 'closed' || blink < 0.2) {
          return (
            <g key={i}>
              <path d={`M ${x - 8} ${ey + 1} Q ${x} ${ey + 4} ${x + 8} ${ey + 1}`} stroke={W} strokeWidth={3} fill="none" strokeLinecap="round" />
              {brow(x, side)}
            </g>
          );
        }
        const big = expr === 'surprised' ? 1.35 : 1;
        const hh = (expr === 'tired' ? 3.6 : 6) * big * blink;
        const ww = 9 * big;
        const almond = `M ${x - ww} ${ey} Q ${x} ${ey - hh * 1.6} ${x + ww} ${ey} Q ${x} ${ey + hh * 1.6} ${x - ww} ${ey} Z`;
        return (
          <g key={i}>
            <path d={almond} fill={W} />
            <circle cx={x + look[0]} cy={ey + look[1] * 0.5} r={expr === 'surprised' ? 2.6 : 3.3} fill={C.sil} />
            <circle cx={x + look[0] + 1.2} cy={ey + look[1] * 0.5 - 1.4} r={1} fill="#fff" />
            {expr === 'tired' ? <path d={`M ${x - ww} ${ey - 1} L ${x + ww} ${ey - 1}`} stroke={C.sil} strokeWidth={2.4} /> : null}
            {brow(x, side)}
          </g>
        );
      })}
    </g>
  );
};

const Accessory: React.FC<{acc: Acc; frame: number; front: boolean}> = ({acc, frame, front}) => {
  const sway = Math.sin(frame * 0.07) * 4;
  if (acc === 'mia' || acc === 'pony') {
    if (!front) {
      return (
        <path
          d={`M -8 -40 C 10 -78 50 -70 52 -40 C 54 -10 ${62 + sway} 20 ${54 + sway} 58 C ${42 + sway} 30 34 0 24 -20 Z`}
          fill={C.sil}
        />
      );
    }
    return acc === 'mia' ? <path d={`M ${-HEAD_R + 2} -14 Q 0 -44 ${HEAD_R - 2} -14`} stroke="#f2f2f2" strokeWidth={8} fill="none" strokeLinecap="round" /> : null;
  }
  if (acc === 'dan' && front) {
    return (
      <g>
        <path d={`M ${-HEAD_R - 2} -12 Q ${-HEAD_R} -56 0 -58 Q ${HEAD_R} -56 ${HEAD_R + 2} -12 Z`} fill={C.sil} />
        <path d={`M ${HEAD_R - 6} -14 Q ${HEAD_R + 30} -14 ${HEAD_R + 36} -6 L ${HEAD_R - 8} -8 Z`} fill={C.sil} />
        <path d={`M ${-HEAD_R + 6} -16 Q 0 -24 ${HEAD_R - 4} -16`} stroke="#2a2a2a" strokeWidth={2} fill="none" />
      </g>
    );
  }
  if (acc === 'neighbor' && !front) {
    return <circle cx={-4} cy={-HEAD_R - 10} r={17} fill={C.sil} />;
  }
  if (acc === 'headphones' && front) {
    return (
      <g>
        <path d={`M ${-HEAD_R - 4} -6 Q ${-HEAD_R - 6} -66 0 -66 Q ${HEAD_R + 6} -66 ${HEAD_R + 4} -6`} stroke={C.sil} strokeWidth={8} fill="none" />
        <path d={`M ${-HEAD_R - 2} -6 Q ${-HEAD_R - 4} -62 0 -62`} stroke="#3a3a3a" strokeWidth={2} fill="none" />
        <rect x={-HEAD_R - 14} y={-16} width={18} height={30} rx={8} fill={C.sil} />
        <rect x={HEAD_R - 4} y={-16} width={18} height={30} rx={8} fill={C.sil} />
      </g>
    );
  }
  return null;
};

/** The silhouette character (black, white eyes + brows). Origin = feet on the floor. */
export const Silhouette: React.FC<SilProps> = (p) => {
  const {x, y, frame, scale = 1.3, facing = 1, expr = 'neutral', look = [0, 0], tilt = 0, acc = 'none', opacity = 1, seed = 'sil', fill = C.sil, talk = 0, rot = 0} = p;
  const j = resolveSil(p);
  // blink every 80–120 frames
  const period = 80 + Math.floor(rnd(seed + 'bp') * 40);
  const cyc = (frame + Math.floor(rnd(seed + 'bo') * period)) % period;
  const blink = cyc < 3 ? 0.1 : cyc < 5 ? 0.5 : 1;
  const breath = 1 + 0.012 * Math.sin(frame * 0.08 + rnd(seed) * 6);
  const bob = talk ? Math.sin(frame * 0.35) * 2.5 * talk : 0;
  const headRot = j.headRot + tilt + (talk ? Math.sin(frame * 0.17) * 3 * talk : 0);
  const limb = (a: V, b: V, c: V, key: string) => {
    const ctrl: V = [2 * b[0] - (a[0] + c[0]) / 2, 2 * b[1] - (a[1] + c[1]) / 2];
    return (
      <g key={key}>
        <path d={`M ${a[0]} ${a[1]} Q ${ctrl[0]} ${ctrl[1]} ${c[0]} ${c[1]}`} stroke={fill} strokeWidth={LIMB} fill="none" strokeLinecap="round" />
        <circle cx={c[0]} cy={c[1]} r={MITT} fill={fill} />
      </g>
    );
  };
  const L = 92;
  // drop that narrows downwards: wide at the shoulders, narrow at the hips
  const body = `M -38 ${-L + 10} C -42 ${-L * 0.55} -34 ${-L * 0.12} -26 0 C -18 10 18 10 26 0 C 34 ${-L * 0.12} 42 ${-L * 0.55} 38 ${-L + 10} C 34 ${-L - 10} -34 ${-L - 10} -38 ${-L + 10} Z`;
  return (
    <g opacity={opacity} transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale * facing} ${scale})`}>
      {limb(j.hiB, j.knB, j.ftB, 'lb')}
      {limb(j.hiF, j.knF, j.ftF, 'lf')}
      <g transform={`translate(${j.hip[0]} ${j.hip[1]}) scale(1 ${breath}) translate(${-j.hip[0]} ${-j.hip[1]})`}>
        {limb(j.shB, j.elB, j.haB, 'ab')}
        {p.handItemBack ? <g transform={`translate(${j.haB[0]} ${j.haB[1]})`}>{p.handItemBack}</g> : null}
        <g transform={`translate(${j.hip[0]} ${j.hip[1]}) rotate(${j.bodyRot}) scale(${p.bodyScale ?? 1})`}>
          <path d={body} fill={fill} />
        </g>
        <g transform={`translate(${j.head[0]} ${j.head[1] + 6 + bob}) rotate(${headRot})`}>
          <Accessory acc={acc} frame={frame} front={false} />
          <circle cx={0} cy={0} r={HEAD_R} fill={fill} />
          <Accessory acc={acc} frame={frame} front />
          {p.back ? null : (
            <g transform={`translate(${4} 0)`}>
              <Eyes expr={expr} blink={blink} look={look} glow={p.eyeGlow} />
            </g>
          )}
        </g>
        {limb(j.shF, j.elF, j.haF, 'af')}
        {p.handItem ? <g transform={`translate(${j.haF[0]} ${j.haF[1]})`}>{p.handItem}</g> : null}
      </g>
    </g>
  );
};

/** Dog silhouette, wagging tail. Origin = paws on the floor. */
export const Dog: React.FC<{x: number; y: number; frame: number; scale?: number; facing?: 1 | -1; wag?: number}> = ({x, y, frame, scale = 1, facing = 1, wag = 1}) => {
  const t = Math.sin(frame * 0.9) * 25 * wag;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`} fill={C.sil}>
      <ellipse cx={0} cy={-52} rx={52} ry={24} />
      <circle cx={52} cy={-80} r={22} />
      <path d="M 60 -96 L 70 -118 L 50 -100 Z" />
      <ellipse cx={74} cy={-72} rx={14} ry={9} />
      {[-34, -18, 22, 38].map((lx, i) => (
        <rect key={i} x={lx - 4} y={-40} width={8} height={40} rx={4} />
      ))}
      <path d={`M -48 -60 Q -70 -70 ${-78 + t * 0.2} ${-92 + Math.abs(t) * 0.1}`} stroke={C.sil} strokeWidth={7} fill="none" strokeLinecap="round" transform={`rotate(${t} -48 -60)`} />
      <ellipse cx={58} cy={-84} rx={3.5} ry={3} fill="#f4f4f0" />
    </g>
  );
};
