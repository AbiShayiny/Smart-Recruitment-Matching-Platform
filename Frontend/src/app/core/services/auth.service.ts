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

  register(user: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register`,
      user
    );
  }

  login(user: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      user
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}