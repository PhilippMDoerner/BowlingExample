import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { BowlingGameManager, ScoreRow } from './bowling';
import { DEMO_FRAMES, isRollScore, MAX_PINS, RollScore } from './bowling/_model/frame';

@Component({
  selector: 'app-root',
  imports: [ScoreRow, MatFormField, MatLabel, MatInput, MatButton, MatIcon],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly gameManager = inject(BowlingGameManager);

  protected readonly MAX_PINS = MAX_PINS;
  protected readonly demoFrames = DEMO_FRAMES;
  protected readonly frames = this.gameManager.frames;
  protected readonly frameState = this.gameManager.frameState;

  performRandomRoll() {
    const randomRollValue = Math.floor(
      Math.random() * this.gameManager.standingPinCount(),
    ) as RollScore;
    this.gameManager.performRoll(randomRollValue);
  }

  performCheatRoll(event: SubmitEvent, rollValue: string) {
    event.preventDefault();
    const rollValueAsNumber = parseInt(rollValue);
    if (isNaN(rollValueAsNumber) || !isRollScore(rollValueAsNumber)) {
      return;
    }
    this.gameManager.performRoll(rollValueAsNumber);
  }

  resetGame() {
    this.gameManager.resetGame();
  }
}
