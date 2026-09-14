import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { EmployerSidebar } from '../../../../shared/components/employer-sidebar/employer-sidebar';
import { VacancyService } from '../../../../core/services/vacancy.service';
import { CompanyService } from '../../../../core/services/company.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, EmployerSidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  // Backend connect செய்த பிறகு இந்த values populate செய்யலாம்.
  totalVacancies = 0;
  activeVacancies = 0;
  totalApplicants = 0;
  pendingContactRequests = 0;

  recentApplications: any[] = [];
  activeVacancyList: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private vacancyService: VacancyService,
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const companyId = this.companyService.getCurrentCompanyId();
    if (companyId === null) return;

    this.vacancyService.getMyVacancies(companyId).pipe(
      finalize(() => this.cdr.markForCheck())
    ).subscribe({
      next: vacancies => {
        const employerVacancies = vacancies ?? [];
        this.totalVacancies = employerVacancies.length;
        this.activeVacancyList = employerVacancies.filter(
          vacancy => (vacancy.status ?? '').toLowerCase() === 'open'
        );
        this.activeVacancies = this.activeVacancyList.length;
      },
      error: () => {
        this.totalVacancies = 0;
        this.activeVacancies = 0;
        this.activeVacancyList = [];
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  get hasRecentApplications(): boolean {
    return this.recentApplications.length > 0;
  }

  get hasActiveVacancies(): boolean {
    return this.activeVacancyList.length > 0;
  }

  goToVacancies(): void {
    this.router.navigate(['/employer/vacancy-list']);
  }

  goToApplicants(): void {
    this.router.navigate(['/applications/applicants-list']);
  }

  goToContactRequests(): void {
    this.router.navigate(['/contact/contact-requests']);
  }

  createVacancy(): void {
    this.router.navigate(['/employer/vacancy-create']);
  }

  goToCompanyProfile(): void {
    this.router.navigate(['/employer/company-profile']);
  }
}
