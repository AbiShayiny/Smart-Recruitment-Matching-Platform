import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantRow } from './applicant-row';

describe('ApplicantRow', () => {
  let component: ApplicantRow;
  let fixture: ComponentFixture<ApplicantRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantRow],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
