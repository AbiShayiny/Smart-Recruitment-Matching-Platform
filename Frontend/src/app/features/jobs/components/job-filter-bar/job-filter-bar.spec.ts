import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobFilterBar } from './job-filter-bar';

describe('JobFilterBar', () => {
  let component: JobFilterBar;
  let fixture: ComponentFixture<JobFilterBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobFilterBar],
    }).compileComponents();

    fixture = TestBed.createComponent(JobFilterBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
