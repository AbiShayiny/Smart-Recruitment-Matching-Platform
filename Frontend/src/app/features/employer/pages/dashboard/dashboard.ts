import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  // Backend connect செய்த பிறகு இந்த values populate செய்யலாம்.
  totalVacancies = 0;
  activeVacancies = 0;
  totalApplicants = 0;
  pendingContactRequests = 0;

  recentApplications: any[] = [];
  activeVacancyList: any[] = [];

  constructor(private router: Router) {}

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