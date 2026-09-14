import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGapPanel } from './skill-gap-panel';

describe('SkillGapPanel', () => {
  let component: SkillGapPanel;
  let fixture: ComponentFixture<SkillGapPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillGapPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillGapPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
