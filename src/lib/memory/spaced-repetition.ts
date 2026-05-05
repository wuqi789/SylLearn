export interface SM2Result {
  nextInterval: number;
  easeFactor: number;
  repetitions: number;
  nextReviewAt: Date;
}

export function calculateNextReview(
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number
): SM2Result {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  let newRepetitions = repetitions;
  let newEaseFactor = easeFactor;
  let newInterval: number;

  if (q < 3) {
    newRepetitions = 0;
    newInterval = 1;
  } else {
    if (newRepetitions === 0) {
      newInterval = 1;
    } else if (newRepetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }
    newRepetitions += 1;
  }

  newEaseFactor =
    newEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

  return {
    nextInterval: newInterval,
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    repetitions: newRepetitions,
    nextReviewAt,
  };
}
