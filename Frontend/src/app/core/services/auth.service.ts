import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7182/api/Authentication';

  constructor(private http: HttpClient) {
  }

  register(user: { name: string; email: string; password: string; role: 'JobSeeker' | 'Employer' }): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/register`,
      user,
      { responseType: 'text' }
    );
  }

  login(user: { email: string; password: string }): Observable<{ token: string; name: string; email: string; role: string; companyId: number | null }> {
    return this.http.post<{ token: string; name: string; email: string; role: string; companyId: number | null }>(
      `${this.apiUrl}/login`,
      user
    );
  }

  saveToken(token: string): void {
    localStorage.removeItem('employerCompanyContext');
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('employerCompanyContext');
  }

  // Cached API response metadata for routing only; the backend checks ownership on every request.
  setCompanyId(companyId: number | null, requestToken: string | null = this.getToken()): void {
    if (!requestToken || requestToken !== this.getToken() || this.getRole(requestToken) !== 'Employer') return;
    const validId = Number.isInteger(companyId) && companyId! > 0 && companyId! <= 2147483647 ? companyId : null;
    localStorage.setItem('employerCompanyContext', JSON.stringify({ token: requestToken, companyId: validId }));
  }

  getCurrentCompanyId(): number | null {
    const token = this.getToken();
    if (this.getRole(token) !== 'Employer') return null;
    try {
      const context = JSON.parse(localStorage.getItem('employerCompanyContext') ?? 'null');
      const id = context?.companyId;
      return context?.token === token && Number.isInteger(id) && id > 0 && id <= 2147483647 ? id : null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getRole() !== null;
  }

  getRole(token: string | null = this.getToken()): string | null {
    if (typeof token !== 'string') return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3 || parts.some(part => !/^[A-Za-z0-9_-]+$/.test(part))) return null;

      const decode = (part: string) => {
        const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
        const bytes = Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')), c => c.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
      };
      const header = decode(parts[0]);
      const payload = decode(parts[1]);
      if (header?.alg !== 'HS256' || typeof payload?.exp !== 'number' ||
          !Number.isFinite(payload.exp) || payload.exp <= Date.now() / 1000) return null;

      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      // This reads session claims for navigation. The backend verifies the JWT signature.
      return ['Administrator', 'Employer', 'JobSeeker'].includes(role) ? role : null;
    } catch {
      return null;
    }
  }

  isProtectedApiRequest(url: string): boolean {
    try {
      const api = new URL(this.apiUrl);
      const target = new URL(url, api.origin);
      return target.origin === api.origin && target.pathname.startsWith('/api/') &&
        target.pathname !== `${api.pathname}/login` &&
        target.pathname !== `${api.pathname}/register`;
    } catch {
      return false;
    }
  }
}
