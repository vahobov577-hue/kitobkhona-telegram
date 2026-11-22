import React from 'react';
import {EASE, keys, ramp} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {AptRoom, FrontDoor} from '../environments/Apartment';
import {Silhouette} from '../characters/Silhouette';
import {Birthday} from './common';
import {BIRTHDAY_CAM} from './S03';
import {LEO, MIA, DAN, useT} from './kit';

const Pie = <g><ellipse cx={0} cy={0} rx={40} ry={12} fill="#c98a4a" /><ellipse cx={0} cy={-6} rx={36} ry={10} fill="#e2b06a" /></g>;

export const Guests: React.FC<{frame: number; x0: number; y: number; scale: number; happy?: boolean}> = ({frame, x0, y, scale, happy = true}) => (
  <>
    {DAN({x: x0, y, frame, scale, expr: happy ? 'happy' : 'neutral', talk: 0.5, rig: {armF: [120, 30]}})}
    {MIA({x: x0 + 150 * scale, y, frame: frame + 10, scale, expr: 'happy'})}
    <Silhouette seed="nb" acc="neighbor" x={x0 - 150 * scale} y={y} frame={frame + 20} scale={scale * 0.92} expr="happy" rig={{armF: [70, 30]}} handItem={Pie} />
    <Silhouette seed="rn0" acc="pony" x={x0 + 290 * scale} y={y} frame={frame + 30} scale={scale * 0.95} expr="happy" />
    <Silhouette seed="rn1" x={x0 - 280 * scale} y={y} frame={frame + 40} scale={scale * 0.95} expr="happy" />
  </>
);

// the S3 frame again — warm, phone face down, the doorbell rings
const A: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot bg="#2a2420" drift={BIRTHDAY_CAM.drift} zoom={BIRTHDAY_CAM.zoom}>
      <Birthday frame={g} mood="warm" phone="down" expr={t > 70 ? 'surprised' : 'neutral'} look={t > 70 ? [-6, 0] : [2, 3]} />
      <Sfx name="doorbell" at={70} volume={0.9} />
    </Shot>
  );
};
// the door opens: everyone is there
const B: React.FC = () => {
  const {t, g} = useT();
  const open = ramp(t, 10, 40, 0, 1, EASE);
  return (
    <Shot zoom={[1.0, 1.04]}>
      <Layer depth={0.8} blur={2}>
        <AptRoom mood="warm" windowMood="dusk" />
      </Layer>
      <Layer depth={1}>
        <clipPath id="doorclip">
          <rect x={1240} y={340} width={240} height={520} />
        </clipPath>
        <g clipPath="url(#doorclip)" opacity={open}>
          <Guests frame={g} x0={1370} y={900} scale={0.9} />
        </g>
        <FrontDoor x={1360} open={open} />
        {LEO({x: 760, y: 1000, frame: g, scale: 1.8, facing: 1, expr: t > 40 ? 'happy' : 'surprised', back: false, rig: {armF: [keys(t, [0, 12], [10, 100], EASE), 20]}})}
      </Layer>
      <Sfx name="door" at={10} volume={0.7} />
      <Sfx name="cheer" at={40} volume={0.7} />
    </Shot>
  );
};
// wide: they come in
const C3: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot drift={[-30, 0]}>
      <Layer depth={0.8} blur={2}>
        <AptRoom mood="warm" windowMood="dusk" />
      </Layer>
      <Layer depth={1}>
        <Guests frame={g} x0={keys(t, [0, 120], [1250, 1050])} y={960} scale={1.4} />
        {LEO({x: 560, y: 960, frame: g, scale: 1.45, expr: 'happy', talk: 0.6})}
      </Layer>
      <Sfx name="chatter" at={0} volume={0.6} dur={120} />
    </Shot>
  );
};
export const S31 = [A, B, C3];
void FrontDoor;
