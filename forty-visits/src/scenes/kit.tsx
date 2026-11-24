import {useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {ShotCtx} from '../effects/context';
import {Silhouette, SilProps} from '../characters/Silhouette';
import {noise} from '../lib';

export const useT = () => {
  const t = useCurrentFrame();
  const {d, g0} = useContext(ShotCtx);
  return {t, d, g: g0 + t};
};

type P = Omit<SilProps, 'seed'>;
export const SAM = (p: P) => <Silhouette seed="sam" {...p} />;
export const MOM = (p: Omit<P, 'acc'>) => <Silhouette seed="mom" acc="mom" scale={(p.scale ?? 1.3) * 0.92} {...p} />;
/** Dad: bald, a little stooped, slower, the hand trembles (±1 px) */
export const DAD = (p: Omit<P, 'acc'>) => {
  const tr = noise('dadtr', p.frame * 1.7) * 3;
  const rig = {body: 8, head: 8, armF: [12 + tr, 6] as [number, number], ...p.rig};
  return <Silhouette seed="dad" speed={0.7} {...p} rig={{...rig, armF: [rig.armF![0] + tr * 0.6, rig.armF![1]] as [number, number]}} />;
};
/** Arthur: very stooped, hat with brim, cane */
export const ARTHUR = (p: Omit<P, 'acc'>) => <Silhouette seed="arthur" acc="arthur" {...p} rig={{body: 20, head: 6, ...p.rig}} />;
