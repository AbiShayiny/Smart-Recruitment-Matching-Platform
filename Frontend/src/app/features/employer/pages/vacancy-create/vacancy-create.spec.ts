import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { VacancyCreate } from './vacancy-create';

describe('VacancyCreate company dependency', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VacancyCreate],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
  });

  it('handles the missing company association without requesting an invented ID', () => {
    const fixture = TestBed.createComponent(VacancyCreate);
    fixture.detectChanges();
    fixture.componentInstance.postVacancy();
    expect(fixture.componentInstance.errorMessage).toContain('company');

    expect(fixture.componentInstance.successMessage).toBe('');

    const http = TestBed.inject(HttpTestingController);
    http.expectNone(() => true);
    http.verify();
  });

  it('does not claim to persist drafts when no draft endpoint exists', () => {
    const fixture = TestBed.createComponent(VacancyCreate);
    fixture.componentInstance.saveDraft();
    expect(fixture.componentInstance.errorMessage).toContain('not supported');
    expect(fixture.componentInstance.isSaving).toBe(false);
    const http = TestBed.inject(HttpTestingController);
    http.expectNone(() => true);
    http.verify();
  });

});
