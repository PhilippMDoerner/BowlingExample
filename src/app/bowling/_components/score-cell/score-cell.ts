import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FrameDataset } from '../../_model/frame';

@Component({
  selector: 'app-score-cell',
  imports: [],
  templateUrl: './score-cell.html',
  styleUrl: './score-cell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreCell {
  frameDataset = input.required<FrameDataset>();
  isLastFrame = input.required<boolean>();
}
