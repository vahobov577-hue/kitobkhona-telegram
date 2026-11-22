import React from 'react';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {AptRoom, TableCake, TABLE_Y} from '../environments/Apartment';
import {Phone} from '../inserts/PhoneUI';
import {Silhouette} from '../characters/Silhouette';
import {Guests} from './S31';
import {LEO, useT} from './kit';

const Party: React.FC<{blur?: number}> = ({blur = 0}) => {
  const {g} = useT();
  return (
    <>
      <Layer depth={0.8} blur={2 + blur}>
        <AptRoom mood="warm" windowMood="dusk" />
      </Layer>
      <Layer depth={1} blur={blur}>
        <TableCake x={960} candle={1} />
        <Guests frame={g} x0={1180} y={960} scale={1.35} />
        <Silhouette seed="rn3" x={300} y={960} frame={g + 50} scale={1.3} expr="happy" talk={0.6} />
        {LEO({x: 640, y: 960, frame: g, scale: 1.4, expr: 'happy', talk: 0.8, rig: {armF: [60, 60]}})}
      </Layer>
    </>
  );
};

const A: React.FC = () => (
  <Shot drift={[30, 0]}>
    <Party />
    <Sfx name="laughs" at={0} volume={0.7} dur={100} />
  </Shot>
);
// insert: the phone buzzes on the table — nobody looks
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 1.0})} zoom={[1.0, 1.04]}>
      <Party blur={10} />
      <Layer depth={1.1}>
        <rect x={-500} y={TABLE_Y + 120} width={3000} height={800} fill="#4a3d33" />
        <Phone x={960} y={TABLE_Y + 430} scale={0.75} rot={-80} mode={{kind: 'lock', t, n: 120}} buzz={t % 40 < 20 ? 1 : 0} hand={false} />
      </Layer>
      <Sfx name="buzz" at={4} volume={0.5} />
      <Sfx name="buzz" at={44} volume={0.5} />
      <Sfx name="laughs" at={0} volume={0.6} dur={100} />
    </Shot>
  );
};
const C3: React.FC = () => (
  <Shot cam={() => ({zoom: 2.8, fx: 670, fy: 560})}>
    <Party />
    <Sfx name="laughs" at={0} volume={0.6} dur={100} />
  </Shot>
);
export const S32 = [A, B, C3];
