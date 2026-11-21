// Shared skeleton for Hero and Shadow. Origin = between the feet on the floor,
// +x = the direction the character faces, angles in degrees.
// dir(a): a=0 points down, a=90 points forward, a=180 points up.

export type V = [number, number];
export type Pose =
  | 'stand'
  | 'sit'
  | 'sitDesk'
  | 'hug'
  | 'walk'
  | 'fall'
  | 'lie'
  | 'speak'
  | 'climb'
  | 'tie'
  | 'armsOut'
  | 'lean'
  | 'cower';

export type Rig = {
  hipX: number;
  hipY: number;
  body: number; // forward lean
  head: number; // extra head tilt
  armB: [number, number]; // back arm: shoulder angle, elbow bend
  armF: [number, number]; // front arm
  legB: [number, number]; // back leg: hip angle, knee bend
  legF: [number, number];
  grounded: boolean;
};

export const BL = 92; // hip -> neck
export const UA = 46;
export const LA = 44;
export const TL = 50;
export const SL = 52;
export const HEAD_OFF = 40;

const rad = (d: number) => (d * Math.PI) / 180;
export const dir = (a: number): V => [Math.sin(rad(a)), Math.cos(rad(a))];
const add = (a: V, b: V, k = 1): V => [a[0] + b[0] * k, a[1] + b[1] * k];

const STAND: Rig = {
  hipX: 0,
  hipY: -(TL + SL),
  body: 0,
  head: 0,
  armB: [-9, -6],
  armF: [9, 6],
  legB: [-3, 0],
  legF: [3, 0],
  grounded: true,
};

export const getRig = (pose: Pose, frame: number, speed = 1): Rig => {
  const ph = frame * 0.2 * speed;
  const s = Math.sin(ph);
  switch (pose) {
    case 'stand':
      return {...STAND, armF: [9 + Math.sin(frame * 0.05) * 1.5, 6], armB: [-9 - Math.sin(frame * 0.05) * 1.5, -6]};
    case 'walk':
      return {
        ...STAND,
        body: 4,
        armF: [-20 * s, 18],
        armB: [20 * s, 18],
        legF: [24 * s, 10 + 22 * Math.max(0, Math.cos(ph))],
        legB: [-24 * s, 10 + 22 * Math.max(0, -Math.cos(ph))],
      };
    case 'climb':
      return {
        ...STAND,
        body: 14,
        head: -4,
        armF: [40 - 30 * s, 30],
        armB: [40 + 30 * s, 30],
        legF: [40 + 32 * s, 40 + 30 * s],
        legB: [40 - 32 * s, 40 - 30 * s],
        grounded: true,
      };
    case 'sit':
      return {
        ...STAND,
        hipY: -62,
        body: -4,
        head: 4,
        armF: [28, 40],
        armB: [20, 48],
        legF: [88, 86],
        legB: [84, 82],
        grounded: false,
      };
    case 'sitDesk':
      return {
        ...STAND,
        hipY: -62,
        body: 8,
        head: 6,
        armF: [62, 22],
        armB: [52, 30],
        legF: [86, 84],
        legB: [82, 80],
        grounded: false,
      };
    case 'hug':
      return {
        ...STAND,
        hipY: -16,
        body: 24,
        head: 22,
        armF: [38, -112],
        armB: [30, -104],
        legF: [146, 142],
        legB: [140, 136],
        grounded: false,
      };
    case 'fall':
      return {
        ...STAND,
        body: -10,
        head: -14,
        armF: [140 + 15 * Math.sin(frame * 0.6), 30],
        armB: [-150 + 15 * Math.sin(frame * 0.7), -30],
        legF: [28, 30],
        legB: [-8, 10],
        grounded: false,
      };
    case 'lie':
      return {
        ...STAND,
        head: -6,
        armF: [130, 120],
        armB: [-14, -6],
        legF: [4, 6],
        legB: [-2, 0],
        grounded: false,
      };
    case 'speak':
      return {
        ...STAND,
        body: 3,
        armF: [62 + 10 * Math.sin(frame * 0.13), 62 + 14 * Math.sin(frame * 0.21)],
        armB: [-10, -10],
      };
    case 'tie':
      return {
        ...STAND,
        head: -4,
        armF: [158 + 6 * Math.sin(frame * 0.5), 62],
        armB: [-158 - 6 * Math.sin(frame * 0.5), -62],
      };
    case 'armsOut':
      return {
        ...STAND,
        armF: [102 + 4 * Math.sin(frame * 0.08), 12],
        armB: [-102 - 4 * Math.sin(frame * 0.08), -12],
        legF: [12, 0],
        legB: [-12, 0],
      };
    case 'lean':
      return {
        ...STAND,
        body: 22,
        head: 16,
        armF: [70, 40],
        armB: [20, 20],
        legF: [8, 0],
        legB: [-6, 0],
      };
    case 'cower':
      return {
        ...STAND,
        body: -6,
        head: 14,
        armF: [150, 120],
        armB: [-150, -120],
        legF: [10, 16],
        legB: [-10, 12],
      };
  }
};

export const lerpRig = (a: Rig, b: Rig, t: number): Rig => {
  const l = (x: number, y: number) => x + (y - x) * t;
  const l2 = (x: [number, number], y: [number, number]): [number, number] => [l(x[0], y[0]), l(x[1], y[1])];
  return {
    hipX: l(a.hipX, b.hipX),
    hipY: l(a.hipY, b.hipY),
    body: l(a.body, b.body),
    head: l(a.head, b.head),
    armB: l2(a.armB, b.armB),
    armF: l2(a.armF, b.armF),
    legB: l2(a.legB, b.legB),
    legF: l2(a.legF, b.legF),
    grounded: t < 0.5 ? a.grounded : b.grounded,
  };
};

export type Joints = {
  hip: V;
  neck: V;
  head: V;
  headRot: number;
  bodyRot: number;
  shB: V;
  elB: V;
  haB: V;
  shF: V;
  elF: V;
  haF: V;
  hiB: V;
  knB: V;
  ftB: V;
  hiF: V;
  knF: V;
  ftF: V;
};

export const solve = (r: Rig): Joints => {
  let hip: V = [r.hipX, r.hipY];
  const up: V = [Math.sin(rad(r.body)), -Math.cos(rad(r.body))];
  const perp: V = [Math.cos(rad(r.body)), Math.sin(rad(r.body))];
  const leg = (h: V, [a, k]: [number, number]) => {
    const kn = add(h, dir(a), TL);
    const ft = add(kn, dir(a - k), SL);
    return [kn, ft] as const;
  };
  const build = (hp: V) => {
    const neck = add(hp, up, BL);
    const head = add(neck, [Math.sin(rad(r.body + r.head)), -Math.cos(rad(r.body + r.head))], HEAD_OFF);
    const shB = add(add(neck, up, -14), perp, -15);
    const shF = add(add(neck, up, -14), perp, 15);
    const elB = add(shB, dir(r.armB[0]), UA);
    const haB = add(elB, dir(r.armB[0] + r.armB[1]), LA);
    const elF = add(shF, dir(r.armF[0]), UA);
    const haF = add(elF, dir(r.armF[0] + r.armF[1]), LA);
    const hiB = add(hp, perp, -11);
    const hiF = add(hp, perp, 11);
    const [knB, ftB] = leg(hiB, r.legB);
    const [knF, ftF] = leg(hiF, r.legF);
    return {hip: hp, neck, head, headRot: r.body + r.head, bodyRot: r.body, shB, elB, haB, shF, elF, haF, hiB, knB, ftB, hiF, knF, ftF};
  };
  let j = build(hip);
  if (r.grounded) {
    const low = Math.max(j.ftB[1], j.ftF[1]);
    hip = [hip[0], hip[1] - low];
    j = build(hip);
  }
  return j;
};
