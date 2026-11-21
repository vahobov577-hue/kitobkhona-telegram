import React, {useId} from 'react';
import {C} from '../theme';
import {clamp, noise, rnd, wobbler} from '../lib';
import {Figure} from './Figure';
import {resolveRig} from './Hero';
import {Joints, Pose, Rig, solve, V} from './rig';

export type ShadowProps = {
  x: number;
  y: number;
  frame: number;
  pose?: Pose;
  poseTo?: Pose;
  poseT?: number;
  rig?: Partial<Rig>;
  scale?: number; // relative to hero (0.3 .. 4)
  base?: number; // base hero scale in this shot
  facing?: 1 | -1;
  opacity?: number;
  dissolve?: number; // 0..1 → smoke particles rising
  glow?: number;
  smile?: number;
  eyes?: number; // eye openness multiplier
  seed?: string;
};

const BLACK = '#060606';

const samplePoint = (j: Joints, i: number, seed: string): V => {
  const segs: [V, V, number][] = [
    [j.hip, j.neck, 34],
    [j.hip, j.neck, 20],
    [j.head, j.head, 36],
    [j.head, j.head, 30],
    [j.shF, j.haF, 6],
    [j.shB, j.haB, 6],
    [j.hiF, j.ftF, 6],
    [j.hiB, j.ftB, 6],
  ];
  const s = segs[Math.floor(rnd(seed + 's' + i) * segs.length)];
  const t = rnd(seed + 't' + i);
  const a = rnd(seed + 'a' + i) * Math.PI * 2;
  const rr = Math.sqrt(rnd(seed + 'r' + i)) * s[2];
  return [s[0][0] + (s[1][0] - s[0][0]) * t + Math.cos(a) * rr, s[0][1] + (s[1][1] - s[0][1]) * t + Math.sin(a) * rr];
};

export const Shadow: React.FC<ShadowProps> = ({
  x,
  y,
  frame,
  pose = 'stand',
  poseTo,
  poseT = 0,
  rig,
  scale = 1,
  base = 1.3,
  facing = 1,
  opacity = 1,
  dissolve = 0,
  glow = 1,
  smile = 1,
  eyes = 1,
  seed = 'shadow',
}) => {
  const id = useId().replace(/:/g, '');
  const s = scale * base;
  const w = wobbler(frame, seed, 1.4 / s);
  const r = resolveRig(pose, frame, 1, poseTo, poseT, rig);
  const j = solve(r);
  const breath = 1 + 0.02 * Math.sin(frame * 0.07);
  const bodyOp = 1 - clamp(dissolve / 0.75);
  const flick = 0.85 + 0.15 * noise(seed + 'fl', frame * 0.3);
  const N = 240;
  const parts: React.ReactNode[] = [];
  if (dissolve > 0) {
    for (let i = 0; i < N; i++) {
      const th = rnd(seed + 'th' + i) * 0.55;
      const pr = clamp((dissolve - th) / 0.45);
      if (pr <= 0 || pr >= 1) continue;
      const p0 = samplePoint(j, i, seed);
      const sp = 0.5 + rnd(seed + 'sp' + i);
      const px = p0[0] + noise(seed + 'nx' + i, pr * 3) * 70 * pr + (rnd(seed + 'dx' + i) - 0.5) * 80 * pr;
      const py = p0[1] - 170 * pr * sp;
      const ember = rnd(seed + 'e' + i) < 0.22;
      const rad = ember ? 2 + rnd(seed + 'z' + i) * 3 : (5 + rnd(seed + 'z' + i) * 9) * (1 + pr * 1.6);
      parts.push(
        <circle key={i} cx={px} cy={py} r={rad} fill={ember ? C.red : i % 3 === 0 ? '#3a1416' : '#1d1416'} opacity={(1 - pr) * (ember ? 1 : 0.9)} />,
      );
    }
  }
  return (
    <g opacity={opacity} transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      <defs>
        <filter id={`g${id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceAlpha" stdDeviation={9} result="b" />
          <feFlood floodColor={C.red} floodOpacity={0.8 * glow * flick} />
          <feComposite in2="b" operator="in" result="g" />
          <feMerge>
            <feMergeNode in="g" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`e${id}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={2.2} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`s${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={3} />
        </filter>
      </defs>
      {bodyOp > 0 ? (
        <g opacity={bodyOp} filter={`url(#g${id})`}>
          <Figure
            j={j}
            w={w}
            fill={BLACK}
            ink={BLACK}
            outline={2}
            limbW={14}
            breath={breath}
            face={() => (
              <g filter={`url(#e${id})`}>
                <path d={`M -22 -10 L -4 -2 L -20 1 Z`} fill={C.red} transform={`scale(1 ${eyes})`} />
                <path d={`M 34 -10 L 16 -2 L 32 1 Z`} fill={C.red} transform={`scale(1 ${eyes})`} />
                <path
                  d={`M -18 15 Q -6 ${15 + 12 * smile} 6 ${16 + 4 * smile} Q 14 ${13 + 2 * smile} 26 ${10 - 4 * smile}`}
                  stroke={C.red}
                  strokeWidth={3.4}
                  fill="none"
                  strokeLinecap="round"
                  opacity={clamp(smile * 1.2)}
                />
              </g>
            )}
          />
        </g>
      ) : null}
      {parts.length ? <g filter={`url(#g${id})`}><g filter={`url(#s${id})`}>{parts}</g></g> : null}
    </g>
  );
};
