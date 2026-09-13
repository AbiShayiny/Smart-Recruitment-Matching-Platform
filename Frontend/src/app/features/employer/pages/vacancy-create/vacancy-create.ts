import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { VacancyService } from '../../../../core/services/vacancy.service';
import { CompanyService } from '../../../../core/services/company.service';
import { CreateVacancyDto, vacancyValidation } from '../../../../core/models/vacancy.model';

@Component({
  selector: 'app-vacancy-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './vacancy-create.html',
  styleUrl: './vacancy-create.css'
})
export class VacancyCreate implements OnInit {
  errorMessage = '';
  successMessage = '';
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    if (this.companyService.getCurrentCompanyId() === null) {
      this.errorMessage = 'Your account is not linked to a company yet. Posting is unavailable until that association is available.';
    }
  }

  jobTitle = '';
  department = '';
  employmentType = 'Full-time';

  jobDescription = '';

  experienceLevel = '';
  seniority = '';

  workplaceModel = 'Hybrid';

  primaryLocation = '';
  allowedJurisdictions = '';

  skillInput = '';
  requiredSkills: string[] = [];

  isSaving = false;

  constructor(
    private router: Router,
    private vacancyService: VacancyService,
    private companyService: CompanyService
  ) {}


  addSkill(): void {

    const skill = this.skillInput.trim();

    if (!skill) {
      return;
    }

    const alreadyExists = this.requiredSkills.some(
      existingSkill =>
        existingSkill.toLowerCase() === skill.toLowerCase()
    );

    if (!alreadyExists) {
      this.requiredSkills.push(skill);
    }

    this.skillInput = '';
  }


  removeSkill(index: number): void {

    this.requiredSkills.splice(index, 1);
  }


  addSuggestedSkill(skill: string): void {

    const alreadyExists = this.requiredSkills.some(
      existingSkill =>
        existingSkill.toLowerCase() === skill.toLowerCase()
    );

    if (!alreadyExists) {
      this.requiredSkills.push(skill);
    }
  }


  onSkillKeydown(event: KeyboardEvent): void {

    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSkill();
    }
  }


  get descriptionLength(): number {

    return this.jobDescription.length;
  }


  get isReady(): boolean {

    return !!this.jobTitle.trim() &&
      !!this.jobDescription.trim() &&
      this.requiredSkills.length >= 1 &&
      !!this.experienceLevel &&
      !!this.primaryLocation.trim();
  }


  get readinessPercentage(): number {

    let completed = 0;

    if (this.jobTitle.trim()) {
      completed++;
    }

    if (this.jobDescription.trim()) {
      completed++;
    }

    if (this.requiredSkills.length > 0) {
      completed++;
    }

    if (this.experienceLevel) {
      completed++;
    }

    if (this.primaryLocation.trim()) {
      completed++;
    }

    return Math.round((completed / 5) * 100);
  }


  saveDraft(): void {
    if (this.isSaving) return;
    this.successMessage = '';
    this.errorMessage = 'Draft saving is not supported by the current API. Your changes remain in this form only.';
  }

  postVacancy(): void {
    if (this.isSaving) return;
    this.successMessage = '';
    const companyId = this.companyService.getCurrentCompanyId();
    if (companyId === null) {
      this.errorMessage = 'Your account is not linked to a company. This vacancy has not been submitted.';
      return;
    }
    const dto: CreateVacancyDto = {
      companyId,
      jobTitle: this.jobTitle.trim(),
      jobDescription: this.jobDescription.trim(),
      requiredSkills: this.requiredSkills.join(', '),
      requiredExperience: this.experienceLevel || null,
      education: null,
      location: this.primaryLocation.trim() || null,
      employmentType: this.employmentType || null,
      closingDate: null
    };
    this.errorMessage = vacancyValidation(dto);
    if (this.errorMessage) return;
    this.isSaving = true;
    this.vacancyService.createVacancy(dto).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.isSaving = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: vacancy => {
        if (!vacancy?.vacancyId) {
          this.errorMessage = 'The server returned no vacancy. Check your vacancies before retrying.';
          return;
        }
        this.successMessage = 'Vacancy created successfully.';
        this.router.navigate(['/employer/vacancy-details', vacancy.vacancyId], {
          state: { successMessage: this.successMessage }
        });
      },
      error: () => { this.errorMessage = 'Unable to create the vacancy. Please check your entries and try again.'; }
    });
  }

  cancel(): void {

    this.router.navigate([
      '/employer/vacancy-list'
    ]);
  }


  preview(): void {

    /*
     * Preview functionality can be connected later.
     */
  }
}