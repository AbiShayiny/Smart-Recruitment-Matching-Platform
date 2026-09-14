import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

export interface CompanyDto {
  companyName: string;
  description: string | null;
  industry: string | null;
  location: string | null;
  website: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
}

export interface CompanyModel extends CompanyDto {
  companyId: number;
  createdAt: string;
  updatedAt: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly apiUrl = 'https://localhost:7182/api/employer/company';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCurrentCompanyId(): number | null {
    return this.authService.getCurrentCompanyId();
  }

  createCompany(dto: CompanyDto): Observable<CompanyModel | null> {
    const requestToken = this.authService.getToken();
    return this.http.post<CompanyModel | null>(this.apiUrl, dto).pipe(
      tap(company => {
        if (company && Number.isInteger(company.companyId) && company.companyId > 0) {
          this.authService.setCompanyId(company.companyId, requestToken);
        }
      })
    );
  }

  getCompany(companyId: number): Observable<CompanyModel | null> {
    return this.http.get<CompanyModel | null>(`${this.apiUrl}/${companyId}`);
  }

  updateCompany(companyId: number, dto: CompanyDto): Observable<{ message: string } | null> {
    return this.http.put<{ message: string } | null>(`${this.apiUrl}/${companyId}`, dto);
  }
}
