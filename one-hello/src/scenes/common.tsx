import React from 'react';
import {Layer} from '../effects/Parallax';
import {AptRoom, AptMood, TableCake, TABLE_Y} from '../environments/Apartment';
import {Glow} from '../environments/common';
import {Phone} from '../inserts/PhoneUI';
import {LEO} from './kit';
import {Expr} from '../characters/Silhouette';

/** S3 / S31 — the birthday table composition (must be identical framing) */
export const BIRTHDAY_LEO = {x: 760, y: 830};
export const Birthday: React.FC<{frame: number; mood: AptMood; candle?: number; phone: 'hand' | 'down'; expr?: Expr; look?: [number, number]; buzz?: number; extra?: React.ReactNode; cake?: boolean; screen?: 'notifs' | 'contact'}> = ({frame, mood, candle = 1, phone, expr = 'sad', look = [2, 3], buzz = 0, extra, cake = true, screen = 'notifs'}) => (
  <>
    <Layer depth={0.75} blur={2.5}>
      <AptRoom mood={mood} />
    </Layer>
    <Layer depth={1}>
      {LEO({
        x: BIRTHDAY_LEO.x,
        y: BIRTHDAY_LEO.y,
        frame,
        scale: 1.6,
        pose: 'sitDesk',
        expr,
        look,
        eyeGlow: phone === 'hand' && mood === 'dark' ? '#e3ecff' : undefined,
        rig: phone === 'hand' ? {armF: [100, 40], head: 14} : {armF: [70, 16], head: 4},
        handItem: phone === 'hand' ? <Phone x={0} y={-30} scale={0.09} mode={screen === 'notifs' ? {kind: 'notifs', t: 80} : {kind: 'contact', typed: 'Hey', caret: false}} hand={false} glow={0} /> : undefined,
      })}
      <rect x={BIRTHDAY_LEO.x - 70} y={TABLE_Y + 20} width={20} height={240} fill="#1a1a1a" />
      <TableCake x={980} candle={candle} cake={cake} phone={phone === 'down' ? 'down' : 'none'} buzz={buzz} />
      {phone === 'hand' ? <Glow cx={BIRTHDAY_LEO.x + 110} cy={TABLE_Y - 260} r={260} color="#cfe0ff" opacity={0.35} /> : null}
      {extra}
    </Layer>
  </>
);
