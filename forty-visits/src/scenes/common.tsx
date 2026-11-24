import React from 'react';
import {C} from '../theme';
import {noise} from '../lib';
import {Layer} from '../effects/Parallax';
import {DeskTop} from '../environments/Office';
import {DeskPhone} from '../inserts/Inserts';
import {Park} from '../environments/ParkBench';
import {Pigeon, Sandwich} from '../characters/Extras';
import {Expr} from '../characters/Silhouette';
import {ARTHUR, SAM} from './kit';

/** S1 / S35 — identical desk framing; the finger presses red or green */
export const DeskCall: React.FC<{t: number; mode: 'incoming' | 'missed' | 'connected'; press?: 'red' | 'green'; pressAt?: number; timer?: string}> = ({t, mode, press, pressAt = 999, timer}) => {
  const pressed = t >= pressAt && t < pressAt + 6 ? press : undefined;
  const fx = press === 'green' ? 1060 : 860;
  const fy = 540 + 260 * 0.95;
  const ty = t < pressAt - 18 ? 1300 : t < pressAt ? 1300 - ((t - (pressAt - 18)) / 18) * (1300 - fy - 40) : t < pressAt + 10 ? fy + 40 : fy + 40 + (t - pressAt - 10) * 30;
  return (
    <>
      <Layer depth={0.9} blur={1.5}>
        <DeskTop />
      </Layer>
      <Layer depth={1}>
        <DeskPhone x={960} y={540} s={0.95} rot={-4} mode={mode} pressed={pressed} buzz={mode === 'incoming' && t < pressAt ? 1 : 0} frame={t} timer={timer} />
        {press && t > pressAt - 20 && t < pressAt + 40 ? (
          <g transform={`translate(${fx + 20} ${ty})`} fill={C.sil}>
            <rect x={-26} y={-20} width={52} height={160} rx={26} />
            <ellipse cx={30} cy={210} rx={110} ry={130} />
            <rect x={-20} y={300} width={200} height={700} rx={80} />
          </g>
        ) : null}
      </Layer>
    </>
  );
};

export const SEAT_Y = 798; // bench seat (Park, BENCH_Y - 62)

/** wide bench: Sam (left, laptop + sandwich) and Arthur (right, feeding pigeons) */
export const BenchWide: React.FC<{g: number; mood?: 'grey' | 'day' | 'rain'; samExpr?: Expr; arthurExpr?: Expr; leaves?: number; samTalk?: number; arthurTalk?: number; pigeons?: boolean; flyAt?: number; extra?: React.ReactNode; samHand?: React.ReactNode}> = ({g, mood = 'grey', samExpr = 'tired', arthurExpr = 'neutral', leaves = 0, samTalk = 0, arthurTalk = 0, pigeons = true, flyAt, extra, samHand}) => (
  <>
    <Layer depth={0.8} blur={2}>
      <Park mood={mood} leaves={leaves} />
    </Layer>
    <Layer depth={1}>
      {SAM({x: 760, y: SEAT_Y + 80, frame: g, scale: 1.6, pose: 'sit', expr: samExpr, talk: samTalk, look: [3, 3], rig: {head: 16, armF: [60, 70], armB: [50, 70]}, handItem: samHand ?? <Sandwich />})}
      <rect x={640} y={SEAT_Y - 20} width={200} height={14} rx={4} fill="#2a2b30" transform={`rotate(-4 740 ${SEAT_Y})`} />
      {ARTHUR({x: 1160, y: SEAT_Y + 80, frame: g + 30, scale: 1.55, pose: 'sit', facing: -1, expr: arthurExpr, talk: arthurTalk, look: [-3, 2], rig: {armF: [70 + 10 * Math.max(0, Math.sin(g * 0.08)), 10]}})}
      {pigeons
        ? [0, 1, 2, 3].map((i) => (
            <Pigeon key={i} x={1250 + i * 110} y={1010 + (i % 2) * 18} frame={g + i * 9} s={0.9} facing={i % 2 ? 1 : -1} seed={'pg' + i} fly={flyAt !== undefined && i === 1 ? Math.max(0, (g - flyAt) / 30) : 0} />
          ))
        : null}
      {extra}
    </Layer>
  </>
);

/** bench over-the-shoulder: subject sits facing the camera, the other is a blurred head in the foreground */
export const BenchOTS: React.FC<{g: number; subject: 'sam' | 'arthur'; expr?: Expr; talk?: number; tilt?: number; look?: [number, number]; mood?: 'grey' | 'day' | 'rain'; fg?: boolean; leaves?: number; hand?: React.ReactNode}> = ({g, subject, expr = 'neutral', talk = 0, tilt = 0, look = [0, 0], mood = 'grey', fg = true, leaves = 0, hand}) => {
  const p = {x: 960, y: 900, frame: g, scale: 2.6, pose: 'sit' as const, expr, talk, tilt, look, rig: {armF: [40, 60] as [number, number]}, handItem: hand};
  return (
    <>
      <Layer depth={0.6} blur={3.5}>
        <Park mood={mood} leaves={leaves} bench={false} />
      </Layer>
      <Layer depth={1}>
        <rect x={420} y={570} width={1080} height={28} rx={6} fill="#5a4a3a" />
        <rect x={420} y={630} width={1080} height={28} rx={6} fill="#5a4a3a" />
        {subject === 'sam' ? SAM(p) : ARTHUR({...p, rig: {body: 16, head: 6, armF: [40, 60]}})}
        <rect x={360} y={778} width={1200} height={38} rx={8} fill="#6a5644" />
      </Layer>
      {fg ? (
        <Layer depth={1.3} blur={16}>
          {subject === 'sam' ? ARTHUR({x: 1660, y: 1760, frame: g, scale: 3.4, back: true}) : SAM({x: 280, y: 1760, frame: g, scale: 3.4, back: true})}
        </Layer>
      ) : null}
      {mood === 'rain' ? null : null}
    </>
  );
};
export const tremor = (g: number) => noise('tr', g * 1.6) * 1;
