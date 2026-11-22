/**
 * Time remapping for slow motion: before `start` time runs normally,
 * after it runs at `rate` (0.5 = 50%).
 */
export const slowTime = (f: number, start: number, rate: number, end = Infinity) => {
  if (f <= start) return f;
  if (f <= end) return start + (f - start) * rate;
  return start + (end - start) * rate + (f - end);
};
