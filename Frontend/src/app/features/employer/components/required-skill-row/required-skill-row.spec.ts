import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredSkillRow } from './required-skill-row';

describe('RequiredSkillRow', () => {
  let component: RequiredSkillRow;
  let fixture: ComponentFixture<RequiredSkillRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredSkillRow],
    }).compileComponents();

    fixture = TestBed.createComponent(RequiredSkillRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
