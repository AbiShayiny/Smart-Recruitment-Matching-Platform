import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateVacancyDto, UpdateVacancyDto, VacancyModel } from '../models/vacancy.model';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {

  private readonly apiUrl = 'https://localhost:7182/api/employer/vacancy';

  constructor(private http: HttpClient) {}

  getMyVacancies(companyId: number): Observable<VacancyModel[] | null> {
    return this.http.get<VacancyModel[] | null>(
      `${this.apiUrl}/company/${companyId}`
    );
  }

  getVacancy(vacancyId: number): Observable<VacancyModel | null> {
    return this.http.get<VacancyModel | null>(
      `${this.apiUrl}/${vacancyId}`
    );
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
