import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsList } from './applicants-list';

describe('ApplicantsList', () => {
  let component: ApplicantsList;
  let fixture: ComponentFixture<ApplicantsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantsList],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
