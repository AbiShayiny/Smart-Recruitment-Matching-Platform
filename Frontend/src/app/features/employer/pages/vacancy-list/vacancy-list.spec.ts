import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { VacancyList } from './vacancy-list';

describe('VacancyList company dependency', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VacancyList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
  });

  it('handles the missing company association without requesting an invented ID', () => {
    const fixture = TestBed.createComponent(VacancyList);
    fixture.detectChanges();

    expect(fixture.componentInstance.errorMessage).toContain('company');


    expect(fixture.componentInstance.vacancies).toEqual([]);
    const http = TestBed.inject(HttpTestingController);
    http.expectNone(() => true);
    http.verify();
  });

});
