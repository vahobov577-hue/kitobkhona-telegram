import React from 'react';
import {keys} from '../lib';
import {C} from '../theme';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {CoffeeBack, FlyerBoard} from '../environments/CoffeeShop';
import {CoffeeOTS, useT} from './kit';

const Board: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <>
    <Layer depth={0.6} blur={7}>
      <CoffeeBack />
    </Layer>
    <Layer depth={1}>
      <rect x={-500} y={-500} width={3000} height={2200} fill="#d4d0c8" opacity={0.7} />
      <FlyerBoard x={960} y={540} s={1.5} />
      {children}
    </Layer>
  </>
);
const A: React.FC = () => (
  <Shot zoom={[1.0, 1.06]} drift={[30, 10]}>
    <Board />
  </Shot>
);
const B: React.FC = () => {
  const {t} = useT();
  const tap = Math.max(0, Math.sin((t - 20) * 0.5)) * (t > 20 && t < 70 ? 1 : 0);
  const y = keys(t, [0, 18], [1200, 760]) - tap * 22;
  return (
    <Shot cam={() => ({zoom: 1.5, fx: 960, fy: 560})}>
      <Board>
        <g transform={`translate(1000 ${y})`} fill={C.sil}>
          <rect x={-18} y={-40} width={36} height={130} rx={18} />
          <ellipse cx={20} cy={140} rx={80} ry={100} />
          <rect x={-30} y={200} width={160} height={600} rx={60} />
        </g>
      </Board>
      <Sfx name="tap" at={22} volume={0.5} />
      <Sfx name="tap" at={34} volume={0.5} />
      <Sfx name="tap" at={47} volume={0.5} />
    </Shot>
  );
};
const C3: React.FC = () => {
  const {t} = useT();
  return (
    <Shot cam={() => ({zoom: 1.6, fx: 960, fy: 380})} overlay={<Line text="We run Saturdays." from={12} to={96} />}>
      <CoffeeOTS subject="mia" expr={t > 30 ? 'happy' : 'neutral'} talk={t > 12 && t < 60 ? 1 : 0} close fg={false} tilt={-6} />
    </Shot>
  );
};
export const S20 = [A, B, C3];
