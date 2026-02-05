import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreRow } from './score-row';

describe('ScoreRow', () => {
  let component: ScoreRow;
  let fixture: ComponentFixture<ScoreRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
