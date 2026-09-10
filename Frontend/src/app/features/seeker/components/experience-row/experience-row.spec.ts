import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceRow } from './experience-row';

describe('ExperienceRow', () => {
  let component: ExperienceRow;
  let fixture: ComponentFixture<ExperienceRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceRow],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
