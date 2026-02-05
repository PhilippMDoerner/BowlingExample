import { computed, Injectable, signal } from '@angular/core';
import {
  Frame,
  FrameState,
  isRollScore,
  isSpare,
  isStrike,
  MAX_FRAME_COUNT,
  MAX_PINS,
  RollScore,
} from '../_model/frame';

const EMPTY_FRAMES: Frame[] = Array(10)
  .fill(0)
  .map(() => ({}));

@Injectable({
  providedIn: 'root',
})
export class BowlingGameManager {
  private readonly _frames = signal<Frame[]>(EMPTY_FRAMES);
  private readonly _frameState = signal<FrameState>('FIRST_ROLL');
  private readonly currentFrameIndex = signal(0);

  public readonly currentFrame = computed(() => this._frames()[this.currentFrameIndex()]);
  public readonly standingPinCount = computed(() => {
    const frame = this.currentFrame();
    const removedPins = (frame.firstRoll ?? 0) + (frame.secondRoll ?? 0) + (frame.thirdRoll ?? 0);
    return MAX_PINS - (removedPins % MAX_PINS);
  });
  public frames = this._frames.asReadonly();
  public frameState = this._frameState.asReadonly();

  resetGame() {
    this._frames.set(EMPTY_FRAMES);
    this.currentFrameIndex.set(0);
    this._frameState.set('FIRST_ROLL');
  }

  performRoll(rollValue: RollScore) {
    if (!isRollScore(rollValue)) {
      return;
    }

    this.updateCurrentFrame(rollValue);
    const nextFrameState = this.toNextFrameState(rollValue);
    if (nextFrameState) {
      this._frameState.set(nextFrameState);
    }

    const isStartingNewFrame = nextFrameState === 'FIRST_ROLL';
    if (isStartingNewFrame) {
      this.currentFrameIndex.update((index) => index + 1);
    }
  }

  private updateCurrentFrame(rollValue: RollScore) {
    const updatedFrame = { ...this.currentFrame() };
    switch (this._frameState()) {
      case 'FIRST_ROLL':
        updatedFrame.firstRoll = rollValue;
        break;
      case 'SECOND_ROLL':
        updatedFrame.secondRoll = rollValue;
        break;
      case 'THIRD_ROLL':
        updatedFrame.thirdRoll = rollValue;
        break;
    }
    const updatedFrameList = [...this._frames()];
    updatedFrameList[this.currentFrameIndex()] = updatedFrame;
    this._frames.set(updatedFrameList);
  }

  private toNextFrameState(rollValue: RollScore): FrameState | undefined {
    const isLastRound = this.currentFrameIndex() === MAX_FRAME_COUNT - 1;
    if (!isLastRound) {
      switch (this._frameState()) {
        case 'FIRST_ROLL':
          return isStrike(rollValue) ? 'FIRST_ROLL' : 'SECOND_ROLL';
        case 'SECOND_ROLL': {
          return 'FIRST_ROLL';
        }
      }
    } else {
      switch (this._frameState()) {
        case 'FIRST_ROLL': {
          return 'SECOND_ROLL';
        }
        case 'SECOND_ROLL': {
          const firstRollScore = this.currentFrame().firstRoll ?? 0;
          const canHaveThirdRoll = isStrike(firstRollScore) || isSpare(this.currentFrame());

          return canHaveThirdRoll ? 'THIRD_ROLL' : 'DONE';
        }
        case 'THIRD_ROLL': {
          return 'DONE';
        }
      }
    }
    return undefined;
  }
}
