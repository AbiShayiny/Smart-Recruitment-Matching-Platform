import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillRow } from './skill-row';

describe('SkillRow', () => {
  let component: SkillRow;
  let fixture: ComponentFixture<SkillRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillRow],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
