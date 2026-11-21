import {loadFont as loadPatrick} from '@remotion/google-fonts/PatrickHand';
import {loadFont as loadComic} from '@remotion/google-fonts/ComicNeue';

const patrick = loadPatrick('normal', {weights: ['400'], subsets: ['latin']});
const comic = loadComic('normal', {weights: ['700'], subsets: ['latin']});

export const FONT_HAND = patrick.fontFamily; // narrator
export const FONT_BOLD = comic.fontFamily; // red lines, titles

export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const FLOOR_Y = 756; // ~70% of frame
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
  screen: '#8fd8ff',
  screenDeep: '#2b6c9a',
  moon: '#f3ecd8',
};

// Scene table (frames @30fps)
export const SCENES: [number, number][] = [
  [0, 150],
  [150, 450],
  [450, 690],
  [690, 930],
  [930, 1170],
  [1170, 1350],
  [1350, 1710],
  [1710, 2010],
  [2010, 2190],
  [2190, 2310],
  [2310, 2550],
  [2550, 2850],
  [2850, 3150],
  [3150, 3390],
  [3390, 3750],
  [3750, 4050],
  [4050, 4260],
  [4260, 4500],
];
export const TOTAL = 4500;
