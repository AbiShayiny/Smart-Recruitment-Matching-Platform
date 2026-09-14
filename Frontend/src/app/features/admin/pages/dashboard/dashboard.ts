import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, Subscription } from 'rxjs';
import { UserModel } from '../../../../core/models/user.model';
import { AdminService } from '../../../../core/services/admin.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, OnDestroy {

  totalUsers: number | null = null;
  totalCompanies: number | null = null;
  totalVacancies: number | null = null;
  totalApplications: number | null = null;
  isLoading = true;
  dashboardError = '';
  users: UserModel[] | null = null;
  jobSeekerPercentage: number | null = null;
  employerPercentage: number | null = null;
  readonly pageSize = 6;
  currentPage = 1;

  get visibleUserCount(): number | null {
    return this.users === null ? null : this.users.length;
  }

  get totalPages(): number {
    return Math.ceil((this.visibleUserCount ?? 0) / this.pageSize);
  }

  get displayedUsers(): UserModel[] {
    if (!this.users) return [];
    const start = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  get displayedUserCount(): number | null {
    return this.users === null ? null : this.displayedUsers.length;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  previousPage(): void { this.goToPage(this.currentPage - 1); }

  nextPage(): void { this.goToPage(this.currentPage + 1); }

  userInitials(user: UserModel | null): string {
    return user?.name?.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('') || '—';
  }
  private dashboardRequest?: Subscription;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.isLoading = false;
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      return;
    }

    this.dashboardRequest = forkJoin({
      dashboard: this.adminService.getDashboard(),
      users: this.adminService.getUsers()
    }).pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.markForCheck();
      })
    ).subscribe({
      next: ({ dashboard: response, users }) => {
        this.totalUsers = response.totalUsers;
        this.totalCompanies = response.totalCompanies;
        this.totalVacancies = response.totalVacancies;
        this.totalApplications = response.totalApplications;
        this.users = users.filter(user => user.role !== 'Administrator');
        this.currentPage = 1;
        if (this.users.length > 0) {
          this.jobSeekerPercentage = this.users.filter(user => user.role === 'JobSeeker').length / this.users.length * 100;
          this.employerPercentage = this.users.filter(user => user.role === 'Employer').length / this.users.length * 100;
        } else {
          this.jobSeekerPercentage = 0;
          this.employerPercentage = 0;
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.dashboardError = 'Your session has expired. Please sign in again.';
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        } else if (error.status === 403) {
          this.dashboardError = 'You do not have permission to view dashboard data.';
        } else if (error.status === 0) {
          this.dashboardError = 'Unable to connect. Please check your connection and reload the page.';
        } else {
          this.dashboardError = 'Unable to load dashboard data. Please try again later.';
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.dashboardRequest?.unsubscribe();
  }

}
