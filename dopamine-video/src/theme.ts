import {loadFont as loadPatrick} from '@remotion/google-fonts/PatrickHand';
import {loadFont as loadComic} from '@remotion/google-fonts/ComicNeue';

const patrick = loadPatrick('normal', {weights: ['400'], subsets: ['latin']});
const comic = loadComic('normal', {weights: ['700'], subsets: ['latin']});

export const FONT_HAND = patrick.fontFamily; // narrator
export const FONT_BOLD = comic.fontFamily; // villain lines, titles

export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const FLOOR_Y = 756;
export const HERO_SCALE = 1.3;

export const C = {
  bg: '#111111',
  floor: '#3a3a3a',
  dark: '#1a1a1a',
  grey: '#2a2a2a',
  grey2: '#33333b',
  furn: '#4a4a55',
  furnLight: '#5a5a66',
  ink: '#151515',
  hero: '#EDE6D6',
  heroShade: '#cfc6b3',
  red: '#E53935',
  redDeep: '#8e1c1a',
  white: '#ffffff',
  screen: '#6FA8FF', // screen light only
  screenSoft: '#b9d4ff',
  gold: '#FFC94D', // dopamine sparks only
  sun: '#FFD54A', // from scene 22 / dawn only
  orange: '#FF9A3C',
  moon: '#f3ecd8',
};

// [from, to) in frames @30 fps
export const SCENES: [number, number][] = [
  [0, 120], [120, 240], [240, 390], [390, 450],
  [450, 690], [690, 930], [930, 1170], [1170, 1380], [1380, 1620], [1620, 1860], [1860, 2250],
  [2250, 2490], [2490, 2730], [2730, 2970], [2970, 3240], [3240, 3540], [3540, 3900], [3900, 4200],
  [4200, 4410], [4410, 4710], [4710, 4950], [4950, 5190], [5190, 5430], [5430, 5670], [5670, 6000], [6000, 6300],
  [6300, 6660], [6660, 6960], [6960, 7320], [7320, 7560], [7560, 7860], [7860, 8100],
];
export const TOTAL = 8100;

// music sync points (frames)
export const SYNC = {
  silenceBar: 1170, // 0:39, one bar of silence
  blackout: 3540, // 2:00 music cut
  piano: 3900,
  dissonance: 5190, // 3:09
  drop: 5622, // 187.4 s
  snap: 6774, // 225.8 s, chains break on a downbeat
  finalChord: 7800,
};
