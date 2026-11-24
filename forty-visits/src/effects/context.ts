import {createContext} from 'react';
import {H, W} from '../theme';

export type Cam = {x?: number; y?: number; zoom?: number; rot?: number; fx?: number; fy?: number};
export const CamCtx = createContext<Required<Cam>>({x: 0, y: 0, zoom: 1, rot: 0, fx: W / 2, fy: H / 2});
/** vertical = render for 1080×1920 Shorts; fx = world x to keep centred */
export const VertCtx = createContext<{vertical: boolean; fx: number}>({vertical: false, fx: W / 2});
/** info about the current shot: global start frame and duration */
export const ShotCtx = createContext<{g0: number; d: number}>({g0: 0, d: 100});
export const AudioOn = createContext(true);
