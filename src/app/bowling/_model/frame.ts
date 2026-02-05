export type RollScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export const MAX_PINS = 10;
export const MAX_FRAME_COUNT = 10;
export type RollKind = 'SPARE' | 'STRIKE' | 'REGULAR';
export type FrameState = 'FIRST_ROLL' | 'SECOND_ROLL' | 'THIRD_ROLL' | 'DONE';

export const isRollScore = (value: number): value is RollScore => {
  return value >= 0 && value <= MAX_PINS;
};

export interface Frame {
  firstRoll?: RollScore;
  secondRoll?: RollScore;
  thirdRoll?: RollScore;
}

export interface RollResult {
  score: RollScore;
  kind: RollKind;
}

export interface FrameDataset {
  firstRoll?: RollResult;
  secondRoll?: RollResult;
  thirdRoll?: RollResult;
  totalScore?: number;
}

export const DEMO_FRAMES: Frame[] = [
  {
    firstRoll: 1,
    secondRoll: 4,
  },
  {
    firstRoll: 4,
    secondRoll: 5,
  },
  {
    firstRoll: 6,
    secondRoll: 4,
  },
  {
    firstRoll: 5,
    secondRoll: 5,
  },
  {
    firstRoll: 10,
  },
  {
    firstRoll: 0,
    secondRoll: 1,
  },
  {
    firstRoll: 7,
    secondRoll: 3,
  },
  {
    firstRoll: 6,
    secondRoll: 4,
  },
  {
    firstRoll: 10,
  },
  {
    firstRoll: 2,
    secondRoll: 8,
    thirdRoll: 6,
  },
];

export const isStrike = (score: RollScore | undefined) => score === MAX_PINS;
export const isSpare = (frame: Frame) =>
  (frame.firstRoll ?? 0) + (frame.secondRoll ?? 0) === MAX_PINS;

export const isSpareOnSecondThrow = (frame: Frame) => {
  return (frame.firstRoll ?? 0) + (frame.secondRoll ?? 0) === MAX_PINS;
};

export const toFrameDataSet = (frame: Frame, totalScore: number | undefined): FrameDataset => {
  const isMissingFirstRoll = frame.firstRoll == null;
  const firstRollResult: RollResult | undefined = isMissingFirstRoll
    ? undefined
    : isStrike(frame.firstRoll)
      ? { score: MAX_PINS, kind: 'STRIKE' }
      : { score: frame.firstRoll ?? 0, kind: 'REGULAR' };

  const isMissingSecondRoll = frame.secondRoll == null;
  const secondRollResult: RollResult | undefined = isMissingSecondRoll
    ? undefined
    : isStrike(frame.secondRoll)
      ? { score: MAX_PINS, kind: 'STRIKE' }
      : isSpareOnSecondThrow(frame)
        ? { score: frame.secondRoll ?? 0, kind: 'SPARE' }
        : { score: frame.secondRoll ?? 0, kind: 'REGULAR' };

  const isMissingThirdRoll = frame.thirdRoll == null;
  const thirdRollResult: RollResult | undefined = isMissingThirdRoll
    ? undefined
    : isStrike(frame.thirdRoll)
      ? { score: MAX_PINS, kind: 'STRIKE' }
      : { score: frame.thirdRoll ?? 0, kind: 'REGULAR' };

  return {
    firstRoll: firstRollResult,
    secondRoll: secondRollResult,
    thirdRoll: thirdRollResult,
    totalScore,
  };
};
