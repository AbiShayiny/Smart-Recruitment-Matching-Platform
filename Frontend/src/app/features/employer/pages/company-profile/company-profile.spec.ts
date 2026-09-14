import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CompanyProfile } from './company-profile';
import { AuthService } from '../../../../core/services/auth.service';

describe('CompanyProfile company dependency', () => {
  beforeEach(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('employerCompanyContext');
    TestBed.configureTestingModule({
      imports: [CompanyProfile],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
  });

  it('handles the missing company association without requesting an invented ID', () => {
    const fixture = TestBed.createComponent(CompanyProfile);
    fixture.detectChanges();
    fixture.componentInstance.saveProfile();
    expect(fixture.componentInstance.errorMessage).toContain('company');
    expect(fixture.componentInstance.saved).toBe(false);


    const http = TestBed.inject(HttpTestingController);
    http.expectNone(() => true);
    http.verify();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.removeItem('token');
    localStorage.removeItem('employerCompanyContext');
    TestBed.inject(HttpTestingController).verify();
  });

  it('allows an authenticated unassociated Employer to start company setup', () => {
    vi.spyOn(TestBed.inject(AuthService), 'getRole').mockReturnValue('Employer');
    const fixture = TestBed.createComponent(CompanyProfile);
    fixture.detectChanges();
    expect(fixture.componentInstance.canCreateCompany).toBe(true);
    expect(fixture.componentInstance.companyId).toBeNull();
    expect(fixture.componentInstance.loadedCompany).toBeNull();
    fixture.componentInstance.saveProfile();
    expect(fixture.componentInstance.errorMessage).toBe('Enter your company name.');
    expect(fixture.componentInstance.saved).toBe(false);
    TestBed.inject(HttpTestingController).expectNone(() => true);
  });

  it('persists a null company association and clears it on logout', () => {
    const auth = TestBed.inject(AuthService);
    vi.spyOn(auth, 'getRole').mockReturnValue('Employer');
    auth.saveToken('session-under-test');
    auth.setCompanyId(null);
    expect(JSON.parse(localStorage.getItem('employerCompanyContext')!).companyId).toBeNull();
    expect(TestBed.inject(AuthService).getCurrentCompanyId()).toBeNull();
    auth.logout();
    expect(localStorage.getItem('employerCompanyContext')).toBeNull();
    expect(auth.getToken()).toBeNull();
  });

  it('does not restore cached metadata from a previous login or a late response', () => {
    const auth = TestBed.inject(AuthService);
    vi.spyOn(auth, 'getRole').mockReturnValue('Employer');
    auth.saveToken('previous-session');
    auth.setCompanyId(null);
    auth.saveToken('current-session');
    expect(localStorage.getItem('employerCompanyContext')).toBeNull();
    auth.setCompanyId(null, 'previous-session');
    expect(localStorage.getItem('employerCompanyContext')).toBeNull();
    expect(auth.getCurrentCompanyId()).toBeNull();
  });
});
