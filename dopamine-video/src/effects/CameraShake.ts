import {noise} from '../lib';

/** Camera shake offsets: amp in px, freq ~ noise speed per frame. */
export const cameraShake = (f: number, amp: number, seed = 'shake', freq = 1.4) => ({
  x: noise(seed + 'x', f * freq) * amp,
  y: noise(seed + 'y', f * freq) * amp,
  rot: noise(seed + 'r', f * freq * 0.7) * amp * 0.04,
});

/** amplitude envelope: rises at `at`, decays over `len` frames */
export const hitEnvelope = (f: number, at: number, peak: number, len = 14) =>
  f < at ? 0 : Math.max(0, peak * (1 - (f - at) / len));
