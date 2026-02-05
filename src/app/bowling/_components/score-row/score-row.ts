import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  Frame,
  FrameDataset,
  isStrike,
  MAX_FRAME_COUNT,
  MAX_PINS,
  RollScore,
  toFrameDataSet,
} from '../../_model/frame';
import { ScoreCell } from '../score-cell/score-cell';

@Component({
  selector: 'app-score-row',
  imports: [ScoreCell],
  templateUrl: './score-row.html',
  styleUrl: './score-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreRow {
  readonly frames = input.required<Frame[]>();
  protected readonly MAX_FRAME_COUNT = MAX_FRAME_COUNT;
  private readonly frameScores = computed(() => {
    return this.frames().map((currentFrame, frameIndex) => {
      const isLastFrame = frameIndex === MAX_FRAME_COUNT;
      if (isLastFrame) {
        return this.getLastFrameScore(currentFrame);
      } else {
        const nextFrame: Frame | undefined = this.frames()[frameIndex + 1];
        const nextNextFrame: Frame | undefined = this.frames()[frameIndex + 2];
        const nextRoll: RollScore = nextFrame?.firstRoll ?? 0;
        const nextNextRoll: RollScore = nextFrame?.secondRoll ?? nextNextFrame?.firstRoll ?? 0;
        return this.getRegularFrameScore(currentFrame, [nextRoll, nextNextRoll]);
      }
    });
  });

  protected readonly totalScores = computed(() => {
    return this.frameScores().map((score, index) => {
      const priorFrameScores = this.frameScores().slice(0, index);
      return priorFrameScores.reduce((acc, score) => {
        const isScoreForUnfinishedFrame = score === undefined || acc === undefined;
        if (isScoreForUnfinishedFrame) return undefined;

        return acc + score;
      }, score);
    });
  });

  protected readonly frameDatasets = computed<FrameDataset[]>(() =>
    this.frames().map((frame, index) => toFrameDataSet(frame, this.totalScores()[index])),
  );

  private getRegularFrameScore(
    currentFrame: Frame,
    nextRolls: [RollScore, RollScore],
  ): number | undefined {
    const isCompleteFrame = isStrike(currentFrame.firstRoll)
      ? true
      : currentFrame.firstRoll != null && currentFrame.secondRoll != null;

    if (!isCompleteFrame) {
      return undefined;
    }

    const currentFrameScore =
      (currentFrame.firstRoll ?? 0) +
      (currentFrame.secondRoll ?? 0) +
      (currentFrame.thirdRoll ?? 0);

    if (isStrike(currentFrame.firstRoll)) {
      const strikeBonus = nextRolls[0] + nextRolls[1];
      return currentFrameScore + strikeBonus;
    } else if (this.isSpare(currentFrame)) {
      const spareBonus = nextRolls[0];
      return currentFrameScore + spareBonus;
    } else {
      return currentFrameScore;
    }
  }

  private getLastFrameScore(frame: Frame): number {
    const firstRollScore = isStrike(frame.firstRoll)
      ? MAX_PINS + (frame.secondRoll ?? 0) + (frame.thirdRoll ?? 0)
      : (frame.firstRoll ?? 0);

    const secondRollScore =
      isStrike(frame.secondRoll) || this.isSpare(frame)
        ? (frame.secondRoll ?? 0) + (frame.thirdRoll ?? 0)
        : (frame.secondRoll ?? 0);

    return firstRollScore + secondRollScore + (frame.thirdRoll ?? 0);
  }

  private isSpare(frame: Frame) {
    return (frame.firstRoll ?? 0) + (frame.secondRoll ?? 0) === MAX_PINS;
  }
}
