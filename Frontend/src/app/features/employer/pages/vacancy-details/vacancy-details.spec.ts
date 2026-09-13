import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { VacancyDetails } from './vacancy-details';

describe('VacancyDetails API states', () => {
  let http: HttpTestingController;
  const params = new BehaviorSubject(convertToParamMap({}));
  beforeEach(() => {
    params.next(convertToParamMap({}));
    TestBed.configureTestingModule({
      imports: [VacancyDetails],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { paramMap: params.asObservable() } }]
    });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('rejects missing, nonnumeric and out-of-range IDs without HTTP requests', () => {
    const fixture = TestBed.createComponent(VacancyDetails);
    fixture.detectChanges();
    for (const id of ['', '0', '-1', 'abc', '1.5', '2147483648']) {
      params.next(convertToParamMap({ id }));
      expect(fixture.componentInstance.errorMessage).toContain('invalid');
      expect(fixture.componentInstance.isLoading).toBe(false);
    }
    http.expectNone(() => true);
  });

  it('handles a null GET response without fabricating vacancy data', () => {
    const fixture = TestBed.createComponent(VacancyDetails);
    fixture.detectChanges();
    params.next(convertToParamMap({ id: '2147483647' }));
    expect(fixture.componentInstance.isLoading).toBe(true);
    const request = http.expectOne('https://localhost:7182/api/employer/vacancy/2147483647');
    expect(request.request.method).toBe('GET');
    request.flush(null);
    expect(fixture.componentInstance.isLoading).toBe(false);
    expect(fixture.componentInstance.errorMessage).toContain('No vacancy');
    expect(fixture.componentInstance.vacancy).toBeNull();
  });

  it('shows GET failures and releases the loading state', () => {
    const fixture = TestBed.createComponent(VacancyDetails);
    fixture.detectChanges();
    params.next(convertToParamMap({ id: '2147483647' }));
    http.expectOne('https://localhost:7182/api/employer/vacancy/2147483647')
      .flush(null, { status: 404, statusText: 'Not Found' });
    expect(fixture.componentInstance.isLoading).toBe(false);
    expect(fixture.componentInstance.errorMessage).toContain('Unable to load');
  });

  it('cancels the previous GET when the route ID changes', () => {
    const fixture = TestBed.createComponent(VacancyDetails);
    fixture.detectChanges();
    params.next(convertToParamMap({ id: '2147483647' }));
    const request = http.expectOne('https://localhost:7182/api/employer/vacancy/2147483647');
    params.next(convertToParamMap({ id: 'invalid' }));
    expect(request.cancelled).toBe(true);
    expect(fixture.componentInstance.isLoading).toBe(false);
    http.expectNone(() => true);
  });

});
