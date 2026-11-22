import React from 'react';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {Hill} from '../environments/Hill';
import {Silhouette} from '../characters/Silhouette';
import {RUNNERS} from './S21';
import {DAN, LEO, useT} from './kit';

// far, from above: the club runs up the path
const A: React.FC = () => {
  const {t, g} = useT();
  const path = (u: number): [number, number] => {
    const y = 1100 - u * 460;
    const x = 960 + Math.sin(u * 5) * 50;
    return [x, y];
  };
  return (
    <Shot zoom={[1.0, 1.04]}>
      <Layer depth={1}>
        <Hill view="top" />
        {RUNNERS.map((r, i) => {
          const u = 0.2 + (t / 150) * 0.3 + i * 0.065;
          const [x, y] = path(u);
          return <Silhouette key={i} seed={'rn' + i} acc={r.acc} x={x + (i % 2 ? 40 : -40)} y={y} frame={g + i * 7} scale={0.45 * (1 - u * 0.5)} pose="run" speed={0.8} expr="happy" />;
        })}
        {(() => {
          const [x, y] = path(0.08 + (t / 150) * 0.3);
          return (
            <>
              {LEO({x: x - 30, y, frame: g, scale: 0.47, pose: 'run', speed: 0.8, expr: 'happy'})}
              {DAN({x: x + 30, y: y + 4, frame: g + 5, scale: 0.47, pose: 'run', speed: 0.8, expr: 'happy'})}
            </>
          );
        })()}
      </Layer>
      <Sfx name="birds" at={0} volume={0.5} dur={150} />
    </Shot>
  );
};
// from behind: Leo and Dan side by side up the hill
const B: React.FC = () => {
  const {g} = useT();
  return (
    <Shot zoom={[1.0, 1.06]} drift={[0, -20]}>
      <Layer depth={0.8}>
        <Hill view="back" />
      </Layer>
      <Layer depth={1}>
        {LEO({x: 860, y: 1040, frame: g, scale: 1.7, pose: 'run', speed: 0.6, back: true})}
        {DAN({x: 1080, y: 1040, frame: g + 9, scale: 1.7, pose: 'run', speed: 0.6, back: true})}
      </Layer>
      <Sfx name="run" at={0} volume={0.5} dur={150} />
    </Shot>
  );
};
export const S33 = [A, B];
