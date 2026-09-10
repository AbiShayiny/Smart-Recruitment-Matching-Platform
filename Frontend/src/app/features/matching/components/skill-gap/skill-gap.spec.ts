import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGap } from './skill-gap';

describe('SkillGap', () => {
  let component: SkillGap;
  let fixture: ComponentFixture<SkillGap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillGap],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillGap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
