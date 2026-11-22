import React from 'react';
import {C} from '../theme';
import {clamp} from '../lib';
import {Hero, heroJoint} from '../components/Hero';
import {PhoneMonster} from '../components/Monster';
import {Staircase, WallClock} from '../components/Props';
import {Layer} from '../components/Stage';

// The staircase confrontation. Used by scenes 1, 2, 3 (rewind), 27 (exact repeat) and 28.
export const SD = {x0: 60, y0: 1110, x1: 1180, y1: 700, steps: 11};
export const stairY = (x: number) => {
  const sw = (SD.x1 - SD.x0) / SD.steps;
  const sh = (SD.y0 - SD.y1) / SD.steps;
  if (x >= SD.x1) return SD.y1;
  const k = (x - SD.x0) / sw;
  return SD.y0 - (Math.floor(k) + 1) * sh;
};
export const MONSTER = {x: 1520, y: SD.y1};

export type ShowdownState = {
  frame: number;
  heroX?: number;
  monsterScale?: number;
  roar?: number;
  sag?: number;
  snap?: number;
  grow?: number;
  tremble?: number;
  emotion?: 'scared' | 'determined' | 'shocked';
  headband?: boolean;
  clockSpin?: number; // degrees for the background clock
  heroPose?: 'pull' | 'stand' | 'walk';
  heroSpeed?: number;
  monsterY?: number;
  chainCount?: number;
  monsterX?: number;
  monsterGlow?: number;
  monsterEyes?: number;
};

export const Showdown: React.FC<ShowdownState> = ({
  frame,
  heroX = 720,
  monsterScale = 6,
  roar = 1,
  sag = 26,
  snap = 0,
  grow = 1,
  tremble = 2,
  emotion = 'scared',
  headband = false,
  clockSpin,
  heroPose = 'pull',
  heroSpeed = 1,
  monsterY = MONSTER.y,
  chainCount = 3,
  monsterX = MONSTER.x,
  monsterGlow = 1,
  monsterEyes = 1,
}) => {
  const hy = stairY(heroX);
  const hp = {x: heroX, y: hy, frame, pose: heroPose, facing: 1 as const, scale: 1.3, speed: heroSpeed};
  const neck = heroJoint(hp, 'neck');
  const hand = heroJoint(hp, 'haF');
  const handB = heroJoint(hp, 'haB');
  const targets: [number, number][] = [
    [neck[0] + 6, neck[1] + 4],
    [hand[0], hand[1]],
    [handB[0], handB[1] + 2],
  ];
  return (
    <>
      <Layer depth={0.5}>
        <rect x={-2000} y={-2000} width={6000} height={6000} fill={C.bg} />
        {clockSpin !== undefined ? <WallClock x={420} y={260} scale={1.2} minute={clockSpin} hour={clockSpin / 12} /> : null}
        <ellipse cx={MONSTER.x} cy={monsterY - 300} rx={700} ry={520} fill={C.red} opacity={0.07 * clamp(monsterScale / 6)} />
      </Layer>
      <Layer depth={1}>
        <PhoneMonster x={monsterX} y={monsterY} scale={monsterScale} roar={roar} chains={chainCount} targets={targets} chainSag={sag} chainSnap={snap} chainGrow={grow} glow={monsterGlow} eyes={monsterEyes} />
        <Staircase x0={SD.x0} y0={SD.y0} x1={SD.x1} y1={SD.y1} steps={SD.steps} />
        <Hero {...hp} emotion={emotion} tremble={tremble} headband={headband} wind={1.4} />
      </Layer>
    </>
  );
};
