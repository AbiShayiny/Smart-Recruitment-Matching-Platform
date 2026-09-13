import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { CompanyDto, CompanyModel, CompanyService } from '../../../../core/services/company.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.css'
})
export class CompanyProfile implements OnInit {
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  companyId: number | null = null;
  loadedCompany: CompanyModel | null = null;
  canCreateCompany = false;
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.companyId = this.companyService.getCurrentCompanyId();
    if (this.companyId === null) {
      this.canCreateCompany = this.authService.getRole(this.authService.getToken()) === 'Employer';
      this.errorMessage = this.canCreateCompany
        ? 'Your account is not linked to a company yet. Complete this profile and save to create your company.'
        : 'Sign in as an Employer to set up your company.';
      return;
    }
    this.isLoading = true;
    this.companyService.getCompany(this.companyId).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.isLoading = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: company => {
        this.loadedCompany = company;
        if (!company) { this.errorMessage = 'No company information was returned.'; return; }
        this.companyName = company.companyName;
        this.description = company.description ?? '';
        this.industry = company.industry ?? '';
        this.website = company.website ?? '';
        this.contactEmail = company.contactEmail ?? '';
        this.contactPhone = company.contactPhone ?? '';
      },
      error: () => { this.errorMessage = 'Unable to load your company profile. Please try again later.'; }
    });
  }

  companyName = '';
  legalName = '';
  website = '';
  industry = '';
  companySize = '';
  foundedYear = '';
  headquarters = '';
  address = '';
  city = '';
  country = '';
  contactName = '';
  contactEmail = '';
  contactPhone = '';
  description = '';

  saved = false;

  constructor(private router: Router, private companyService: CompanyService) {}

  get profileCompletion(): number {
    const fields = [
      this.companyName,
      this.legalName,
      this.website,
      this.industry,
      this.companySize,
      this.headquarters,
      this.address,
      this.city,
      this.country,
      this.contactName,
      this.contactEmail,
      this.contactPhone,
      this.description
    ];

    const completed = fields.filter(value => value.trim() !== '').length;

    return Math.round((completed / fields.length) * 100);
  }

  saveProfile(): void {
    if (this.isLoading || this.isSaving) return;
    this.saved = false;
    if ((this.companyId === null && !this.canCreateCompany) || (this.companyId !== null && !this.loadedCompany)) {
      this.errorMessage = 'A linked company profile must be loaded before saving. Nothing has been saved.';
      return;
    }
    const dto: CompanyDto = {
      companyName: this.companyName.trim(),
      description: this.description.trim() || null,
      industry: this.industry || null,
      location: this.loadedCompany?.location ?? null,
      website: this.website.trim() || null,
      contactEmail: this.contactEmail.trim() || null,
      contactPhone: this.contactPhone.trim() || null
    };
    if (!dto.companyName) { this.errorMessage = 'Enter your company name.'; return; }
    const limits: [string | null, number][] = [
      [dto.companyName, 150], [dto.description, 1000], [dto.industry, 100],
      [dto.website, 250], [dto.contactEmail, 150], [dto.contactPhone, 30]
    ];
    if (limits.some(([value, limit]) => (value?.length ?? 0) > limit)) {
      this.errorMessage = 'One or more fields exceeds the supported length. Check the company name (150), description (1000), industry (100), website (250), email (150) and phone (30).';
      return;
    }
    if (dto.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.contactEmail)) {
      this.errorMessage = 'Enter a valid contact email address.';
      return;
    }
    this.errorMessage = '';
    this.isSaving = true;
    const creating = this.companyId === null;
    const request: Observable<CompanyModel | { message: string } | null> = this.companyId === null
      ? this.companyService.createCompany(dto)
      : this.companyService.updateCompany(this.companyId, dto);
    request.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.isSaving = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: response => {
        if (!response) { this.errorMessage = 'No save confirmation was returned. Reload the profile before retrying.'; return; }
        if (creating) {
          const company = response as CompanyModel;
          if (!Number.isInteger(company.companyId) || company.companyId <= 0) {
            this.errorMessage = 'No valid company confirmation was returned. Sign in again before retrying.';
            return;
          }
          this.companyId = company.companyId;
          this.loadedCompany = company;
          this.canCreateCompany = false;
        } else {
          this.loadedCompany = { ...this.loadedCompany!, ...dto };
        }
        this.saved = true;
      },
      error: error => {
        this.errorMessage = error.status === 409
          ? 'Your account already has a company. Sign in again to refresh your company information.'
          : 'Unable to save the company profile. Please check your entries and try again.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/employer/dashboard']);
  }

  goToDashboard(): void {
    this.router.navigate(['/employer/dashboard']);
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
}