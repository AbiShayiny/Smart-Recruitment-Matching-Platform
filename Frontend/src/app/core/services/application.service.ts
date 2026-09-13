import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, switchMap, throwError } from 'rxjs';

export type SeekerApplication = {
  id: number; vacancyId: number; jobTitle: string; status: string;
  appliedAt: string; updatedAt: string;
};
export type EmployerApplicant = {
  applicationId: number;
  jobSeekerProfileId: number;
  skills: string;
  experience: string;
  education: string;
  location: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
  matchScore: number | null;
};
@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly apiUrl = 'https://localhost:7182/api/application';
  constructor(private http: HttpClient) {}
  getMyApplications() { return this.http.get<SeekerApplication[]>(`${this.apiUrl}/my`); }
  getApplicants(vacancyId: number) {
    return this.http.get<EmployerApplicant[]>(`${this.apiUrl}/vacancy/${vacancyId}/applicants`);
  }
  updateStatus(applicationId: number, status: string) {
    return this.http.put<SeekerApplication>(
      `${this.apiUrl}/${applicationId}/status`,
      { status }
    );
  }
  apply(vacancyId: number) {
    return this.http.post<SeekerApplication>(`${this.apiUrl}/vacancy/${vacancyId}/apply`, {}).pipe(
      catchError(error => {
        if (error.status !== 409) return throwError(() => error);
        // A conflict is only treated as Applied after confirming the stored application.
        return this.getMyApplications().pipe(switchMap(items => {
          const existing = items.find(item => item.vacancyId === vacancyId);
          return existing ? of(existing) : throwError(() => error);
        }));
      })
    );
  }
}
