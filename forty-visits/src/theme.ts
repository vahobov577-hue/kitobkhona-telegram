import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadPatrick} from '@remotion/google-fonts/PatrickHand';

const corI = loadCormorant('italic', {weights: ['500'], subsets: ['latin']});
const corB = loadCormorant('normal', {weights: ['600'], subsets: ['latin']});
const hand = loadPatrick('normal', {weights: ['400'], subsets: ['latin']});

export const FONT_SERIF = corI.fontFamily; // narrator (italic) + titles (600)
export const FONT_TITLE = corB.fontFamily;
export const FONT_HAND = hand.fontFamily; // dialogue

export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const TOTAL = 9000;

export const C = {
  sil: '#0E0E0E',
  white: '#ffffff',
  eye: '#f4f4f0',
  orange: '#F0A04B', // hesitation lines
  red: '#D9443A',
  green: '#4CAF6A',
  amber: '#FFB347',
  lamp: '#FFC873',
  sky: '#8EC5F0',
  momLamp: '#FFC24A',
  blue: '#6FA8FF',
  grass: '#7DBE5A',
};

/** saturation of the whole frame by global frame: grey city → warmth from mom → golden hour → full colour */
export const gradeAt = (g: number) => {
  if (g < 2400) return 0.1; // acts 0–1
  if (g < 5100) return 0.1 + ((g - 2400) / 2700) * 0.4; // act 2: 0.1 → 0.5
  if (g < 7620) return 0.5 + ((g - 5100) / 2520) * 0.4; // act 3: 0.5 → 0.9
  return 1; // act 4
};
