import React, {useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {ShotCtx} from '../effects/context';
import {Layer} from '../effects/Parallax';
import {Silhouette, SilProps} from '../characters/Silhouette';
import {CoffeeBack, CoffeeFront, COUNTER_Y, Counter} from '../environments/CoffeeShop';

export const useT = () => {
  const t = useCurrentFrame();
  const {d, g0} = useContext(ShotCtx);
  return {t, d, g: g0 + t};
};

/** Leo / Mia etc. presets */
export const LEO = (p: Omit<SilProps, 'seed'>) => <Silhouette seed="leo" {...p} />;
export const MIA = (p: Omit<SilProps, 'seed' | 'acc'>) => <Silhouette seed="mia" acc="mia" {...p} />;
export const DAN = (p: Omit<SilProps, 'seed' | 'acc'>) => <Silhouette seed="dan" acc="dan" {...p} />;

type Who = 'leo' | 'mia';
/**
 * Coffee shop over-the-shoulder: `subject` faces the camera behind the counter,
 * the other one is a blurred head/shoulder in the foreground.
 */
export const CoffeeOTS: React.FC<{subject: Who; expr?: SilProps['expr']; talk?: number; tilt?: number; look?: [number, number]; close?: boolean; leaves?: number; fg?: boolean; rig?: SilProps['rig']; frame?: number}> = ({subject, expr = 'neutral', talk = 0, tilt = 0, look = [0, 0], close = false, leaves = 0, fg = true, rig, frame}) => {
  const {t, g} = useT();
  const fr = frame ?? g;
  const sx = 960;
  const S = 2.4;
  const props = {x: sx, y: 860, frame: fr, scale: S, expr, talk, tilt, look, rig: {armF: [14, 8] as [number, number], armB: [-14, -8] as [number, number], ...rig}};
  void t;
  return (
    <>
      <Layer depth={0.6} blur={close ? 5 : 3}>
        {subject === 'leo' ? <CoffeeFront leaves={leaves} mood={leaves > 0.5 ? 'dusk' : 'grey'} /> : <CoffeeBack />}
      </Layer>
      <Layer depth={1}>
        {subject === 'leo' ? LEO(props) : MIA(props)}
        <Counter y={COUNTER_Y} withCups={subject === 'mia'} />
      </Layer>
      {fg ? (
        <Layer depth={1.3} blur={16}>
          {subject === 'leo' ? MIA({x: 1640, y: 1720, frame: fr, scale: 3.4, back: true}) : LEO({x: 300, y: 1720, frame: fr, scale: 3.4, back: true})}
        </Layer>
      ) : null}
    </>
  );
};
