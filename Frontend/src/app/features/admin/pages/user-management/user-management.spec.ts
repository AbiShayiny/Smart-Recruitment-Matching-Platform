import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserManagement } from './user-management';
import { AuthService } from '../../../../core/services/auth.service';
import { authInterceptor } from '../../../../core/interceptors/auth.interceptor';
import { adminGuard } from '../../../../core/guards/admin.guard';
import { ADMIN_ROUTES } from '../../admin.routes';

// HTTP fixtures are used only by these tests, never by the application.
const user = { id: 7, name: 'Test User', email: 'user@example.test', role: 'JobSeeker' };
const url = 'https://localhost:7182/api/Admin/users';

describe('Admin User Management', () => {
  let http: HttpTestingController;
  let auth: { getRole: ReturnType<typeof vi.fn>; isLoggedIn: ReturnType<typeof vi.fn>; getToken: ReturnType<typeof vi.fn>; logout: ReturnType<typeof vi.fn>; isProtectedApiRequest: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    auth = {
      getRole: vi.fn(() => 'Administrator'), isLoggedIn: vi.fn(() => true),
      getToken: vi.fn(() => 'test-session'), logout: vi.fn(),
      isProtectedApiRequest: vi.fn(() => true)
    };
    TestBed.configureTestingModule({
      imports: [UserManagement],
      providers: [provideRouter([{ path: 'admin', canActivate: [adminGuard], children: ADMIN_ROUTES }]),
        provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(),
        { provide: AuthService, useValue: auth }]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  async function page(users = [user]) {
    const fixture = TestBed.createComponent(UserManagement);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Loading users...');
    const request = http.expectOne(url);
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-session');
    request.flush(users);
    await fixture.whenStable();
    // jsdom does not implement the browser's native modal methods.
    const dialog = fixture.componentInstance.actions.dialog.nativeElement;
    if (!dialog.showModal) {
      dialog.showModal = () => dialog.setAttribute('open', '');
      dialog.close = () => dialog.removeAttribute('open');
    }
    return fixture;
  }

  it('renders API fields and an empty state', async () => {
    const fixture = await page();
    expect(fixture.nativeElement.textContent).toContain(user.email);
    expect(fixture.nativeElement.textContent).toContain(user.role);
    fixture.componentInstance.loadUsers();
    http.expectOne(url).flush([]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('No users found.');
  });

  it('edits via PUT, prevents duplicate requests, accepts text, and refreshes', async () => {
    const fixture = await page();
    const component = fixture.componentInstance;
    component.actions.open(user, 'edit');
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#user-name');
    input.value = 'Updated User';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    component.saveUser(user);
    const request = http.expectOne(`${url}/7`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.responseType).toBe('text');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-session');
    expect(request.request.body).toEqual({ name: 'Updated User', email: user.email, role: user.role });
    request.flush('User updated successfully');
    http.expectOne(url).flush([{ ...user, name: 'Updated User' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Updated User was updated successfully.');
    expect(component.actions.dialog.nativeElement.open).toBe(false);
    expect(component.busy()).toBe(false);
  });

  it('identifies the deletion target, cancels safely, and deletes only on submission', async () => {
    const fixture = await page();
    const component = fixture.componentInstance;
    component.actions.open(user, 'delete');
    await fixture.whenStable();
    const dialog = component.actions.dialog.nativeElement;
    expect(dialog.open).toBe(true);
    expect(dialog.textContent).toContain(user.email);
    component.actions.cancel();
    expect(dialog.open).toBe(false);
    http.expectNone(`${url}/7`);
    component.actions.open(user, 'delete');
    component.actions.submit();
    component.actions.submit();
    const request = http.expectOne(`${url}/7`);
    expect(request.request.method).toBe('DELETE');
    expect(request.request.responseType).toBe('text');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-session');
    await fixture.whenStable();
    component.actions.cancel();
    expect(dialog.open).toBe(true);
    request.flush('User deleted successfully');
    http.expectOne(url).flush([]);
    await fixture.whenStable();
    expect(dialog.open).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Test User was deleted successfully.');
    expect(fixture.nativeElement.textContent).toContain('No users found.');
  });

  it.each([0, 400, 401, 403, 404, 409, 500])('handles HTTP %s without exposing exceptions', async status => {
    const fixture = await page();
    const component = fixture.componentInstance;
    component.actions.open(user, 'delete');
    component.deleteUser(user);
    const request = http.expectOne(`${url}/7`);
    if (status === 0) request.error(new ProgressEvent('error'));
    else request.flush('Sensitive backend exception', { status, statusText: 'Error' });
    await fixture.whenStable();
    expect(component.actionError()).toBeTruthy();
    expect(component.actionError()).not.toContain('Sensitive backend exception');
    expect(component.busy()).toBe(false);
    expect(component.actions.dialog.nativeElement.open).toBe(true);
    http.expectNone(url);
  });

  it('handles failed loading and permits retry', async () => {
    const fixture = TestBed.createComponent(UserManagement);
    await fixture.whenStable();
    http.expectOne(url).flush('Internal exception', { status: 500, statusText: 'Error' });
    await fixture.whenStable();
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Please try again later.');
    fixture.componentInstance.loadUsers();
    http.expectOne(url).flush([user]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain(user.email);
  });

  it.each(['Employer', 'JobSeeker', null])('blocks %s from the Admin users route', role => {
    auth.getRole.mockReturnValue(role);
    auth.isLoggedIn.mockReturnValue(role !== null);
    const result = TestBed.runInInjectionContext(() => adminGuard({} as ActivatedRouteSnapshot, { url: '/admin/users' } as RouterStateSnapshot));
    expect(TestBed.inject(Router).serializeUrl(result as ReturnType<Router['createUrlTree']>)).toBe('/auth/login');
    expect(ADMIN_ROUTES.find(route => route.path === 'users')?.component).toBe(UserManagement);
    http.expectNone(url);
  });

  it('allows an Administrator through the unchanged guard', () => {
    expect(TestBed.runInInjectionContext(() => adminGuard({} as ActivatedRouteSnapshot, { url: '/admin/users' } as RouterStateSnapshot))).toBe(true);
  });
});
