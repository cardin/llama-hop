import {
  FIRST_TRANSFORMATION_SCORE,
  FINAL_TRANSFORMATION_SCORE,
  TRANSFORMATION_INTERVAL,
  TRANSFORMATION_RESTART_SCORE
} from './config.js';

// Only the appearance loops. The actual score, extra lives and best score do not.
export function getAppearanceScore(score) {
  if (score < TRANSFORMATION_RESTART_SCORE) return score;

  const namedForms = (FINAL_TRANSFORMATION_SCORE - FIRST_TRANSFORMATION_SCORE) / TRANSFORMATION_INTERVAL + 1;
  const cycleLength = (namedForms + 1) * TRANSFORMATION_INTERVAL;
  const offset = (score - TRANSFORMATION_RESTART_SCORE) % cycleLength;

  // Every later cycle starts with ten points in the original basic form.
  return offset < TRANSFORMATION_INTERVAL ? 0 : FIRST_TRANSFORMATION_SCORE + offset - TRANSFORMATION_INTERVAL;
}
