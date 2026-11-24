import React from 'react';
import {Layer} from '../effects/Parallax';
import {CityKitchen} from '../environments/CityApartment';
import {MomKitchen, MomLampGlow} from '../environments/ParentsKitchen';
import {Glow} from '../environments/common';
import {Phone} from '../inserts/PhoneUI';
import {Expr} from '../characters/Silhouette';
import {DAD, MOM, SAM} from './kit';

const earPhone = <Phone x={0} y={-20} scale={0.1} mode={{kind: 'off'}} hand={false} glow={0} />;

/** split-screen phone call: Sam's grey flat (left) | Mom's warm kitchen (right) */
export const SplitCall: React.FC<{g: number; samExpr?: Expr; momExpr?: Expr; samTalk?: number; momTalk?: number; cooking?: boolean}> = ({g, samExpr = 'neutral', momExpr = 'neutral', samTalk = 0, momTalk = 0, cooking = false}) => {
  const half = (side: 0 | 1) => (
    <g>
      <clipPath id={`sc${side}`}>
        <rect x={side ? 966 : 0} y={0} width={954} height={1080} />
      </clipPath>
      <g clipPath={`url(#sc${side})`}>
        <g transform={`translate(${side ? 966 - 480 : -480} 0)`}>
          {side === 0 ? (
            <>
              <CityKitchen mood="night" />
              {SAM({x: 960, y: 1060, frame: g, scale: 2.0, expr: samExpr, talk: samTalk, rig: cooking ? {armF: [80, 20], armB: [-168, -150]} : {armB: [-168, -150], armF: [10, 6], head: 6}, handItemBack: earPhone})}
              {cooking ? <rect x={1100} y={690} width={200} height={20} rx={10} fill="#2a2a2a" /> : null}
            </>
          ) : (
            <>
              <MomKitchen noLampGlow table={false} />
              {MOM({x: 960, y: 1040, frame: g + 20, scale: 2.1, expr: momExpr, talk: momTalk, facing: -1, rig: {armB: [-168, -150], armF: [10, 6], head: 6}, handItemBack: earPhone})}
            </>
          )}
        </g>
      </g>
    </g>
  );
  return (
    <Layer depth={1}>
      <rect x={-500} y={-500} width={3000} height={2200} fill="#000" />
      {half(0)}
      {half(1)}
    </Layer>
  );
};
/** the warm lamp of mom's half, drawn outside the colour grade */
export const MomHalfLamp: React.FC<{k?: number}> = ({k = 1}) => (
  <Layer depth={1}>
    <clipPath id="momhalf">
      <rect x={966} y={0} width={954} height={1080} />
    </clipPath>
    <g clipPath="url(#momhalf)">
      <MomLampGlow x={966 + 480} y={420} k={k} />
    </g>
  </Layer>
);

/** what the laptop shows during a video call: mom in front, dad behind (in 760×470 screen coords) */
export const VideoCallScreen: React.FC<{g: number; dadWave?: number; tomatoes?: boolean; zoom?: number; momExpr?: Expr; focus?: [number, number]}> = ({g, dadWave = 0, tomatoes = false, zoom = 1.9, momExpr = 'happy', focus = [1020, 720]}) => {
  const s = 0.396 * zoom;
  return (
    <g>
      <clipPath id="vcs">
        <rect x={0} y={0} width={760} height={470} />
      </clipPath>
      <g clipPath="url(#vcs)">
        <g transform={`translate(${380 - focus[0] * s} ${235 - focus[1] * s}) scale(${s})`}>
          <MomKitchen table={false} />
          {DAD({x: 1250, y: 1000, frame: g, scale: 1.5, expr: 'happy', rig: dadWave ? {armF: [140 + Math.sin(g * 0.15) * 10 * dadWave, -30]} : tomatoes ? {armF: [100, 30]} : undefined, handItem: tomatoes ? <g>{[0, 1, 2].map((i) => <circle key={i} cx={-10 + i * 18} cy={-10 + (i % 2) * 8} r={13} fill="#d9443a" />)}</g> : undefined})}
          {MOM({x: 800, y: 1120, frame: g + 10, scale: 2.1, expr: momExpr, talk: 0.5})}
          <Glow cx={960} cy={400} r={800} color="#FFC24A" opacity={0.3} />
        </g>
      </g>
      <rect x={600} y={340} width={140} height={110} rx={8} fill="#3a3d44" stroke="#fff" strokeWidth={2} />
      <circle cx={670} cy={385} r={22} fill="#111" />
      <rect x={650} y={405} width={40} height={30} rx={10} fill="#111" />
    </g>
  );
};
