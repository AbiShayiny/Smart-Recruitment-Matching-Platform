import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyEdit } from './vacancy-edit';

describe('VacancyEdit', () => {
  let component: VacancyEdit;
  let fixture: ComponentFixture<VacancyEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacancyEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(VacancyEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
