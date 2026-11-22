import React from 'react';
import {C, FLOOR_Y} from '../theme';
import {Hero, heroJoint} from '../components/Hero';
import {Chain} from '../components/Monster';
import {Friend, Glow, HandPhone} from '../components/Things';
import {Chair, Desk} from '../components/Props';

export const TABLE_X = 1000;
export const TABLE_TOP = FLOOR_Y - 129 * 1.3;
export const HERO_D = 560;
export const FRIENDS = [
  {x: 1460, facing: -1 as const, behind: false},
  {x: 900, facing: 1 as const, behind: true},
  {x: 1170, facing: -1 as const, behind: true},
];

/** Dinner table. friendOp/warm per friend, `phoneLit` for the hero. */
export const DinnerTable: React.FC<{f: number; friendOp?: number[]; warm?: number[]; laugh?: number[]; heroSat?: number; chains?: boolean; heroHead?: number; heroPhone?: boolean; heroEmotion?: 'empty' | 'smile' | 'neutral'; friendRig?: (i: number) => object | undefined; friendX?: (i: number) => number; friendPose?: (i: number) => 'sit' | 'stand'}> = ({
  f,
  friendOp = [1, 1, 1],
  warm = [0, 0, 0],
  laugh = [0, 0, 0],
  heroSat = 1,
  chains = true,
  heroHead = 18,
  heroPhone = true,
  heroEmotion = 'empty',
  friendRig,
  friendX,
  friendPose,
}) => {
  const hp = {x: HERO_D, y: FLOOR_Y, frame: f, pose: 'sit' as const, scale: 1.3, rig: heroPhone ? {armF: [36, 112] as [number, number], head: heroHead} : {armF: [62, 22] as [number, number], head: 4}};
  const hand = heroJoint(hp, 'haF');
  const neck = heroJoint(hp, 'neck');
  return (
    <g>
      {FRIENDS.map((fr, i) =>
        fr.behind ? (
          <g key={i}>
            <Chair x={fr.x} y={FLOOR_Y - 20} scale={1.2} flip={fr.facing < 0} />
            <Friend x={friendX ? friendX(i) : fr.x} y={FLOOR_Y - 20} frame={f + i * 17} pose={friendPose ? friendPose(i) : 'sit'} scale={1.2} facing={fr.facing} opacity={friendOp[i]} warm={warm[i]} laugh={laugh[i]} seed={'fr' + i} rig={friendRig?.(i)} />
          </g>
        ) : null,
      )}
      <Desk x={TABLE_X} y={FLOOR_Y} width={760} />
      {[820, 1000, 1180].map((x) => (
        <ellipse key={x} cx={x} cy={TABLE_TOP - 2} rx={46} ry={9} fill="#d9d2c2" stroke={C.ink} strokeWidth={2.5} />
      ))}
      <Chair x={HERO_D - 10} y={FLOOR_Y} />
      {FRIENDS.map((fr, i) =>
        !fr.behind ? (
          <g key={i}>
            <Chair x={fr.x + 10} y={FLOOR_Y} flip />
            <Friend x={friendX ? friendX(i) : fr.x} y={FLOOR_Y} frame={f + i * 17} pose={friendPose ? friendPose(i) : 'sit'} facing={fr.facing} opacity={friendOp[i]} warm={warm[i]} laugh={laugh[i]} seed={'fr' + i} rig={friendRig?.(i)} />
          </g>
        ) : null,
      )}
      {heroPhone ? <Glow cx={neck[0] + 30} cy={neck[1] - 40} r={170} color={C.screen} opacity={0.45} /> : null}
      <Hero {...hp} emotion={heroEmotion} saturation={heroSat} handItem={heroPhone ? <HandPhone rot={160} screen="feed" scroll={f * 2} /> : undefined} />
      {chains && heroPhone ? <Chain from={[neck[0], neck[1]]} to={[hand[0] + 4, hand[1] - 12]} sag={12} width={3} link={12} seed="dn" /> : null}
    </g>
  );
};
