import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingResults } from './matching-results';

describe('MatchingResults', () => {
  let component: MatchingResults;
  let fixture: ComponentFixture<MatchingResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchingResults],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchingResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
