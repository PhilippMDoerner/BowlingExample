import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreCell } from './score-cell';

describe('ScoreCell', () => {
  let component: ScoreCell;
  let fixture: ComponentFixture<ScoreCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreCell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
