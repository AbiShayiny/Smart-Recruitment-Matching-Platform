import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {

  private apiUrl = 'https://localhost:5001/api/employer/vacancy';

  constructor(private http: HttpClient) {}

  getMyVacancies(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/company/${companyId}`
    );
  }

  getVacancy(vacancyId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${vacancyId}`
    );
  }
}