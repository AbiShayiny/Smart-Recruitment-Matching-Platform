import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyCreate } from './vacancy-create';

describe('VacancyCreate', () => {
  let component: VacancyCreate;
  let fixture: ComponentFixture<VacancyCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacancyCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(VacancyCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
