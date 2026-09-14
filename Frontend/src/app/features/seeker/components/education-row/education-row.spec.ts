import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationRow } from './education-row';

describe('EducationRow', () => {
  let component: EducationRow;
  let fixture: ComponentFixture<EducationRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationRow],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
