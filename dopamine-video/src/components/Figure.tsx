import React from 'react';
import {ellipsePath, Wob} from '../lib';
import {BL, Joints, V} from './rig';

export const HEAD_RX = 37;
export const HEAD_RY = 42;

type Props = {
  j: Joints;
  w: Wob;
  fill: string;
  backFill?: string;
  ink: string;
  outline?: number;
  limbW?: number;
  breath?: number; // scaleY of upper body
  face?: (head: V, rot: number) => React.ReactNode;
  overHead?: (head: V, rot: number) => React.ReactNode;
  handItem?: React.ReactNode;
  handItemBack?: React.ReactNode;
};

const pt = (w: Wob, p: V) => w`${p[0]} ${p[1]}`;

/** Draws the sausage-limb character from solved joints. */
export const Figure: React.FC<Props> = ({
  j,
  w,
  fill,
  backFill,
  ink,
  outline = 2.6,
  limbW = 13,
  breath = 1,
  face,
  overHead,
  handItem,
  handItemBack,
}) => {
  const limb = (a: V, b: V, c: V, col: string, key: string) => {
    // quadratic that passes through the joint
    const ctrl: V = [2 * b[0] - (a[0] + c[0]) / 2, 2 * b[1] - (a[1] + c[1]) / 2];
    const dd = `M ${pt(w, a)} Q ${pt(w, ctrl)} ${pt(w, c)}`;
    return (
      <g key={key}>
        <path d={dd} stroke={ink} strokeWidth={limbW + outline * 2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={dd} stroke={col} strokeWidth={limbW} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  };

  const bf = backFill ?? fill;
  const L = BL;
  // drop-shaped body in local coords (hip at 0,0; neck at 0,-L)
  const body = w`M 0 ${-L - 8} C 16 ${-L - 8} 22 ${-L * 0.55} 34 ${-L * 0.22} C 44 ${-L * 0.02} 34 12 0 12 C -34 12 -44 ${-L * 0.02} -34 ${-L * 0.22} C -22 ${-L * 0.55} -16 ${-L - 8} 0 ${-L - 8} Z`;
  const upper = `translate(${j.hip[0]} ${j.hip[1]}) scale(1 ${breath}) translate(${-j.hip[0]} ${-j.hip[1]})`;
  return (
    <g>
      {limb(j.hiB, j.knB, j.ftB, bf, 'lb')}
      <g transform={upper}>
        {limb(j.shB, j.elB, j.haB, bf, 'ab')}
        {handItemBack ? <g transform={`translate(${j.haB[0]} ${j.haB[1]})`}>{handItemBack}</g> : null}
      </g>
      {limb(j.hiF, j.knF, j.ftF, fill, 'lf')}
      <g transform={upper}>
        <g transform={`translate(${j.hip[0]} ${j.hip[1]}) rotate(${j.bodyRot})`}>
          <path d={body} fill={fill} stroke={ink} strokeWidth={outline} strokeLinejoin="round" />
        </g>
        <g transform={`translate(${j.head[0]} ${j.head[1]}) rotate(${j.headRot})`}>
          <path d={ellipsePath(w, 0, 0, HEAD_RX, HEAD_RY)} fill={fill} stroke={ink} strokeWidth={outline} />
          {face ? face(j.head, j.headRot) : null}
        </g>
        {overHead ? overHead(j.head, j.headRot) : null}
        {limb(j.shF, j.elF, j.haF, fill, 'af')}
        {handItem ? <g transform={`translate(${j.haF[0]} ${j.haF[1]})`}>{handItem}</g> : null}
      </g>
    </g>
  );
};
