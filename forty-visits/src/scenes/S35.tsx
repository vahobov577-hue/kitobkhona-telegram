import React from 'react';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {OfficeNight} from '../environments/Office';
import {DeskCall} from './common';
import {DESK_ZOOM} from './S01';
import {SAM, useT} from './kit';

// LOOP ↔ S1: the same desk frame — MOM calling → green, immediately
const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot zoom={DESK_ZOOM} sat={1}>
      <DeskCall t={t} mode={t < 26 ? 'incoming' : 'connected'} press="green" pressAt={20} timer={`0:0${Math.min(9, Math.floor(Math.max(0, t - 26) / 30))}`} />
      <Sfx name="buzz" at={0} volume={0.8} dur={20} />
      <Sfx name="tap" at={20} volume={0.7} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot sat={1} cam={() => ({zoom: 1.5, fx: 860, fy: 700, x: 860 - 960, y: 700 - 540})} overlay={<Line text="Hi, Mom." from={8} to={80} />}>
      <Layer depth={0.8} blur={3}>
        <OfficeNight clock="12:10" />
        <rect x={-500} y={-500} width={3000} height={2200} fill="#ffe6b0" opacity={0.45} />
      </Layer>
      <Layer depth={1}>
        {SAM({x: 860, y: 1010, frame: g, scale: 1.6, pose: 'sitDesk', expr: 'happy', talk: t > 8 && t < 30 ? 0.6 : 0, rig: {armF: [75, 15]}})}
        <g transform="translate(800 712) rotate(-10)">
          <rect x={-16} y={-46} width={30} height={80} rx={8} fill="#3a3c44" />
          <ellipse cx={-4} cy={30} rx={24} ry={28} fill="#0E0E0E" />
          <path d="M -4 40 Q 10 110 60 150" stroke="#0E0E0E" strokeWidth={14} fill="none" strokeLinecap="round" />
        </g>
        <rect x={660} y={850} width={460} height={18} fill="#3a3c42" />
      </Layer>
    </Shot>
  );
};
export const S35 = [A, B];
