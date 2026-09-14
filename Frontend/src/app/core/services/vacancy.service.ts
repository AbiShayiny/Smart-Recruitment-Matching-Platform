import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateVacancyDto, UpdateVacancyDto, VacancyModel } from '../models/vacancy.model';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {

  private apiUrl =
    'https://localhost:7182/api/employer/vacancy';

  private readonly seekerApiUrl = 'https://localhost:7182/api/employer/vacancy';

  constructor(
    private http: HttpClient
  ) {}

  getMyVacancies(
    companyId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/company/${companyId}`
    );
  }

  getVacancy(
    vacancyId: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${vacancyId}`
    );
  }
  // Separate Job Seeker method preserves the existing Employer methods and URL.
  getSeekerVacancy(vacancyId: number) {
    return this.http.get<{
      vacancyId: number; companyId: number; jobTitle: string; jobDescription: string;
      requiredSkills: string; requiredExperience: string | null; education: string | null;
      location: string | null; employmentType: string | null; closingDate: string | null;
      status: string; createdAt: string;
    }>(`${this.seekerApiUrl}/${vacancyId}`);
  }
  getOpenVacancies() {
    return this.http.get<{
      vacancyId: number; companyId: number; jobTitle: string; jobDescription: string;
      requiredSkills: string; requiredExperience: string | null; education: string | null;
      location: string | null; employmentType: string | null; closingDate: string | null;
      status: string; createdAt: string;
    }[]>(this.seekerApiUrl);
  }
  createVacancy(dto: CreateVacancyDto): Observable<VacancyModel | null> {
    return this.http.post<VacancyModel | null>(this.apiUrl, dto);
  }

  updateVacancy(vacancyId: number, dto: UpdateVacancyDto): Observable<{ message: string } | null> {
    return this.http.put<{ message: string } | null>(`${this.apiUrl}/${vacancyId}`, dto);
  }

  closeVacancy(vacancyId: number): Observable<{ message: string } | null> {
    return this.http.put<{ message: string } | null>(`${this.apiUrl}/${vacancyId}/close`, {});
  }
}
