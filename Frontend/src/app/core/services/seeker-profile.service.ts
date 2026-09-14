import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { defer } from 'rxjs';

export type SeekerProfileResponse = {
  firstName: string; lastName: string; email: string; phoneNumber: string;
  professionalTitle: string; professionalSummary: string;
  skills: string; experience: string; education: string; location: string;
  createdAt?: string; updatedAt?: string;
};
@Injectable({ providedIn: 'root' })
export class SeekerProfileService {
  private readonly apiUrl = 'https://localhost:7182/api/JobSeeker';
  constructor(private http: HttpClient, private auth: AuthService) {}
  getUserId(): number {
    if (this.auth.getRole() !== 'JobSeeker') throw new Error('Please sign in as a Job Seeker.');
    const part = this.auth.getToken()!.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(atob(part.padEnd(Math.ceil(part.length / 4) * 4, '=')));
    const id = Number(claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Your session has no valid user ID. Please sign in again.');
    // Uses the existing session claim; server-side authorization is still required.
    return id;
  }
  getProfile() { return defer(() => this.http.get<SeekerProfileResponse>(`${this.apiUrl}/${this.getUserId()}`)); }
  saveProfile(profile: SeekerProfileResponse, exists: boolean) {
    return defer(() => exists
      ? this.http.put<SeekerProfileResponse>(`${this.apiUrl}/${this.getUserId()}`, profile)
      : this.http.post<SeekerProfileResponse>(`${this.apiUrl}/${this.getUserId()}`, profile));
  }
}
