import React from 'react';
import {C} from '../theme';
import {noise, wobbler} from '../lib';
import {Figure, HEAD_RX} from './Figure';
import {getRig, lerpRig, Pose, Rig, solve} from './rig';

export const mixColor = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, '0')).join('');
};

export type Emotion = 'neutral' | 'sad' | 'tired' | 'scared' | 'determined' | 'smile' | 'bored' | 'empty' | 'shocked';

export type HeroProps = {
  x: number;
  y: number;
  frame: number;
  pose: Pose;
  poseTo?: Pose;
  poseT?: number;
  rig?: Partial<Rig>;
  emotion?: Emotion;
  emotionTo?: Emotion;
  emotionT?: number;
  headband?: boolean;
  headbandT?: number;
  scale?: number;
  facing?: 1 | -1;
  mouth?: number; // 0..1 open mouth override (speech)
  rot?: number; // rotation about pivot (degrees)
  pivot?: [number, number];
  shrink?: number; // cower squash 0..1
  opacity?: number;
  tremble?: number;
  speed?: number;
  look?: number; // eye shift forward
  handItem?: React.ReactNode;
  handItemBack?: React.ReactNode;
  seed?: string;
  fill?: string;
  wind?: number; // headband tail strength
  saturation?: number; // 0 grey .. 1 cream
  eyesClosed?: boolean;
  age?: number; // 0..1 slouch + eye bags
};

export const Face: React.FC<{
  emotion: Emotion;
  blink: number;
  mouth?: number;
  look?: number;
  age?: number;
}> = ({emotion, blink, mouth, look = 0, age = 0}) => {
  const fx = 6 + look;
  const ink = C.ink;
  const ex = [fx - 13, fx + 13];
  const sw = 2.6;
  const eyes = (rx = 4, ry = 5.5) =>
    ex.map((e) => <ellipse key={e} cx={e} cy={-2} rx={rx} ry={Math.max(0.6, ry * blink)} fill={ink} />);
  let browL = '';
  let browR = '';
  let eyeEls: React.ReactNode = eyes();
  let mouthEl: React.ReactNode = <path d={`M ${fx - 7} 19 Q ${fx} 21.5 ${fx + 7} 19`} stroke={ink} strokeWidth={sw} fill="none" strokeLinecap="round" />;
  let extra: React.ReactNode = null;
  switch (emotion) {
    case 'sad':
      browL = `M ${fx - 21} -12 L ${fx - 8} -18`;
      browR = `M ${fx + 8} -18 L ${fx + 21} -12`;
      eyeEls = eyes(3.6, 5);
      mouthEl = <path d={`M ${fx - 8} 23 Q ${fx} 15 ${fx + 8} 23`} stroke={ink} strokeWidth={sw} fill="none" strokeLinecap="round" />;
      break;
    case 'tired':
      eyeEls = ex.map((e) => (
        <g key={e}>
          <path d={`M ${e - 5} -2 Q ${e} ${-2 + 6 * Math.max(0.3, blink)} ${e + 5} -2 Z`} fill={ink} />
          <path d={`M ${e - 6} -2.5 L ${e + 6} -2.5`} stroke={ink} strokeWidth={2.4} strokeLinecap="round" />
          <path d={`M ${e - 5} 7 Q ${e} 10 ${e + 5} 7`} stroke={ink} strokeWidth={1.4} fill="none" opacity={0.5} strokeLinecap="round" />
        </g>
      ));
      mouthEl = <path d={`M ${fx - 6} 21 L ${fx + 6} 22`} stroke={ink} strokeWidth={sw} strokeLinecap="round" />;
      break;
    case 'scared':
      eyeEls = ex.map((e) => (
        <g key={e}>
          <ellipse cx={e} cy={-3} rx={8} ry={9 * Math.max(0.15, blink)} fill="#fff" stroke={ink} strokeWidth={2} />
          <circle cx={e + look * 0.4} cy={-2} r={3 * Math.max(0.2, blink)} fill={ink} />
        </g>
      ));
      browL = `M ${fx - 23} -18 Q ${fx - 15} -27 ${fx - 6} -21`;
      browR = `M ${fx + 6} -21 Q ${fx + 15} -27 ${fx + 23} -18`;
      mouthEl = <path d={`M ${fx - 8} 22 Q ${fx - 4} 17 ${fx} 22 Q ${fx + 4} 27 ${fx + 8} 21`} stroke={ink} strokeWidth={sw} fill="none" strokeLinecap="round" />;
      extra = <path d={`M ${HEAD_RX - 6} -26 Q ${HEAD_RX + 2} -14 ${HEAD_RX - 4} -10 Q ${HEAD_RX - 10} -14 ${HEAD_RX - 6} -26 Z`} fill="#9fd3ff" stroke={ink} strokeWidth={1.5} />;
      break;
    case 'determined':
      browL = `M ${fx - 23} -19 L ${fx - 6} -11`;
      browR = `M ${fx + 6} -11 L ${fx + 23} -19`;
      eyeEls = eyes(4, 4.6);
      mouthEl = (
        <g>
          <rect x={fx - 11} y={14} width={22} height={10} rx={2} fill="#fff" stroke={ink} strokeWidth={2.2} />
          <path d={`M ${fx - 11} 19 L ${fx + 11} 19 M ${fx - 4} 14 L ${fx - 4} 24 M ${fx + 4} 14 L ${fx + 4} 24`} stroke={ink} strokeWidth={1.4} />
        </g>
      );
      break;
    case 'smile':
      eyeEls = ex.map((e) => <path key={e} d={`M ${e - 5} 0 Q ${e} ${-8 * Math.max(0.3, blink)} ${e + 5} 0`} stroke={ink} strokeWidth={3} fill="none" strokeLinecap="round" />);
      mouthEl = <path d={`M ${fx - 12} 13 Q ${fx} 32 ${fx + 12} 13 Z`} fill={ink} stroke={ink} strokeWidth={1.5} strokeLinejoin="round" />;
      extra = (
        <g opacity={0.45}>
          <ellipse cx={ex[0] - 6} cy={11} rx={6} ry={3.5} fill="#e9a395" />
          <ellipse cx={ex[1] + 6} cy={11} rx={6} ry={3.5} fill="#e9a395" />
        </g>
      );
      break;
    case 'bored':
      eyeEls = ex.map((e) => (
        <g key={e}>
          <ellipse cx={e} cy={0} rx={4} ry={Math.max(0.6, 3.5 * blink)} fill={ink} />
          <path d={`M ${e - 6} -3 L ${e + 6} -3`} stroke={ink} strokeWidth={2.6} strokeLinecap="round" />
        </g>
      ));
      mouthEl = <path d={`M ${fx - 7} 21 L ${fx + 6} 20`} stroke={ink} strokeWidth={sw} strokeLinecap="round" />;
      break;
    case 'empty':
      eyeEls = ex.map((e) => (
        <g key={e}>
          <ellipse cx={e} cy={-2} rx={7} ry={7.5 * Math.max(0.15, blink)} fill="#cfe2ff" stroke={ink} strokeWidth={2} />
          <ellipse cx={e} cy={-2} rx={3} ry={3 * Math.max(0.15, blink)} fill="#6FA8FF" opacity={0.6} />
        </g>
      ));
      mouthEl = <ellipse cx={fx} cy={21} rx={4} ry={2.5} fill={ink} />;
      break;
    case 'shocked':
      eyeEls = ex.map((e) => (
        <g key={e}>
          <ellipse cx={e} cy={-3} rx={8.5} ry={10 * Math.max(0.15, blink)} fill="#fff" stroke={ink} strokeWidth={2} />
          <circle cx={e} cy={-3} r={2.2} fill={ink} />
        </g>
      ));
      browL = `M ${fx - 24} -20 Q ${fx - 15} -29 ${fx - 6} -23`;
      browR = `M ${fx + 6} -23 Q ${fx + 15} -29 ${fx + 24} -20`;
      mouthEl = <ellipse cx={fx} cy={22} rx={6} ry={8} fill={ink} />;
      break;
    default:
      break;
  }
  if (age > 0.05) {
    extra = (
      <g>
        {extra}
        {ex.map((e) => (
          <path key={'b' + e} d={`M ${e - 7} ${6 + 2 * age} Q ${e} ${12 + 4 * age} ${e + 7} ${6 + 2 * age}`} stroke="#6b6358" strokeWidth={1.2 + 1.6 * age} fill="none" opacity={age} strokeLinecap="round" />
        ))}
        <path d={`M -20 -28 Q -10 -31 0 -28`} stroke="#8a8274" strokeWidth={1.2} fill="none" opacity={age * 0.7} />
      </g>
    );
  }
  if (mouth !== undefined && mouth > 0.02) {
    mouthEl = <ellipse cx={fx} cy={20} rx={6 + mouth * 2} ry={1.5 + mouth * 7} fill={ink} />;
  }
  return (
    <g>
      {eyeEls}
      {browL ? <path d={browL} stroke={ink} strokeWidth={3.2} strokeLinecap="round" fill="none" /> : null}
      {browR ? <path d={browR} stroke={ink} strokeWidth={3.2} strokeLinecap="round" fill="none" /> : null}
      {mouthEl}
      {extra}
    </g>
  );
};

export const Headband: React.FC<{frame: number; t: number; wind?: number}> = ({frame, t, wind = 1}) => {
  const band = `M ${-HEAD_RX - 1} -14 Q 0 -32 ${HEAD_RX + 1} -14`;
  const tailT = Math.max(0, (t - 0.75) / 0.25);
  const knot: [number, number] = [-HEAD_RX + 2, -17];
  const tail = (k: number, len: number, ph: number) => {
    const pts: string[] = [];
    const n = 8;
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const xx = knot[0] - u * len * tailT;
      const yy = knot[1] + u * (10 + k * 10) + Math.sin(frame * 0.32 * wind + u * 4.5 + ph) * 7 * u * wind;
      pts.push(`${xx.toFixed(1)} ${yy.toFixed(1)}`);
    }
    return `M ${pts.join(' L ')}`;
  };
  return (
    <g>
      {tailT > 0 ? (
        <g>
          {[tail(0, 58, 0), tail(1, 46, 1.4)].map((d, i) => (
            <g key={i}>
              <path d={d} stroke={C.ink} strokeWidth={i === 0 ? 11 : 9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d={d} stroke={C.red} strokeWidth={i === 0 ? 7 : 5.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
        </g>
      ) : null}
      <path d={band} stroke={C.ink} strokeWidth={14} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} strokeLinecap="round" />
      <path d={band} stroke={C.red} strokeWidth={9} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} strokeLinecap="round" />
      {tailT > 0 ? <circle cx={knot[0]} cy={knot[1]} r={6 * tailT} fill={C.red} stroke={C.ink} strokeWidth={2} /> : null}
    </g>
  );
};

export const resolveRig = (pose: Pose, frame: number, speed = 1, poseTo?: Pose, poseT = 0, over?: Partial<Rig>) => {
  let r = getRig(pose, frame, speed);
  if (poseTo && poseT > 0) r = lerpRig(r, getRig(poseTo, frame, speed), Math.min(1, poseT));
  return {...r, ...over};
};

export const Hero: React.FC<HeroProps> = (p) => {
  const {
    x,
    y,
    frame,
    pose,
    poseTo,
    poseT = 0,
    emotion = 'neutral',
    emotionTo,
    emotionT = 0,
    headband = false,
    headbandT = 1,
    scale = 1.3,
    facing = 1,
    rot = 0,
    pivot = [0, 0],
    shrink = 0,
    opacity = 1,
    tremble = 0,
    speed = 1,
    seed = 'hero',
    wind = 1,
    saturation = 1,
    age = 0,
  } = p;
  const w = wobbler(frame, seed, 1 / scale);
  const r0 = resolveRig(pose, frame, speed, poseTo, poseT, p.rig);
  const r = age > 0 ? {...r0, body: r0.body + 10 * age, head: r0.head + 12 * age} : r0;
  const j = solve(r);
  const breath = 1 + 0.01 + 0.01 * Math.sin(frame * 0.09);
  const cyc = (frame + 37) % 90;
  const blink = p.eyesClosed ? 0.06 : cyc < 2 ? 0.15 : cyc < 4 ? 0.5 : 1;
  const emo = emotionTo && emotionT >= 0.5 ? emotionTo : emotion;
  const tx = tremble ? noise(seed + 'tx', frame * 0.9) * tremble : 0;
  const ty = tremble ? noise(seed + 'ty', frame * 0.9) * tremble : 0;
  const lie = pose === 'lie' || pose === 'lieBed';
  const fillC = p.fill ?? mixColor(C.hero, '#8d8d8d', 1 - saturation);
  const backC = p.fill ?? mixColor(C.heroShade, '#7a7a7a', 1 - saturation);
  const inner = (
    <Figure
      j={j}
      w={w}
      fill={fillC}
      backFill={backC}
      ink={C.ink}
      outline={2.6}
      breath={breath}
      handItem={p.handItem}
      handItemBack={p.handItemBack}
      face={() => <Face emotion={emo} blink={blink} mouth={p.mouth} look={p.look} age={age} />}
      overHead={
        headband
          ? (h, rr) => (
              <g transform={`translate(${h[0]} ${h[1]}) rotate(${rr})`}>
                <Headband frame={frame} t={headbandT} wind={wind} />
              </g>
            )
          : undefined
      }
    />
  );
  return (
    <g
      opacity={opacity}
      transform={`translate(${x + tx} ${y + ty}) rotate(${rot} ${pivot[0] * scale * facing} ${pivot[1] * scale}) scale(${scale * facing} ${scale * (1 - shrink * 0.18)})`}
    >
      {lie ? <g transform="translate(-118 -40) rotate(90)">{inner}</g> : inner}
    </g>
  );
};

/** World position of a hero joint (for attaching effects). */
export const heroJoint = (
  p: Pick<HeroProps, 'x' | 'y' | 'frame' | 'pose' | 'poseTo' | 'poseT' | 'rig' | 'scale' | 'facing' | 'speed'>,
  key: 'haF' | 'haB' | 'head' | 'neck' | 'hip' | 'shF',
): [number, number] => {
  const r = resolveRig(p.pose, p.frame, p.speed ?? 1, p.poseTo, p.poseT ?? 0, p.rig);
  const j = solve(r);
  const s = p.scale ?? 1.3;
  const fc = p.facing ?? 1;
  return [p.x + j[key][0] * s * fc, p.y + j[key][1] * s];
};
