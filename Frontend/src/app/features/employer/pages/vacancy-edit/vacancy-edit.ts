import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { VacancyService } from '../../../../core/services/vacancy.service';
import { parseVacancyId, UpdateVacancyDto, vacancyValidation, VacancyModel } from '../../../../core/models/vacancy.model';

@Component({
  selector: 'app-vacancy-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vacancy-edit.html',
  styleUrl: './vacancy-edit.css',
})
export class VacancyEdit implements OnInit {

  vacancyId: number | null = null;
  isLoading = false;
  isSaving = false;
  isClosing = false;
  errorMessage = '';
  successMessage = '';
  loadedVacancy: VacancyModel | null = null;
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  vacancy = {
    title: '',
    department: '',
    employmentType: '',
    description: '',
    experience: '',
    seniority: '',
    workplace: '',
    location: ''
  };

  skills: string[] = [];
  skillInput = '';

  showCloseModal = false;
  showSaveMessage = false;
  showValidationMessage = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vacancyService: VacancyService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.vacancyId = parseVacancyId(params.get('id'));
        this.loadedVacancy = null;
        this.errorMessage = '';
        this.showSaveMessage = false;
        this.showCloseModal = false;
        this.skills = [];
        Object.keys(this.vacancy).forEach(key => this.vacancy[key as keyof typeof this.vacancy] = '');
        if (this.vacancyId === null) {
          this.errorMessage = 'The vacancy ID is missing or invalid.';
          return of(null);
        }
        this.isLoading = true;
        return this.vacancyService.getVacancy(this.vacancyId).pipe(
          catchError(() => { this.errorMessage = 'Unable to load this vacancy. Please try again later.'; return of(null); }),
          finalize(() => { this.isLoading = false; this.cdr.markForCheck(); })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(vacancy => {
      this.loadedVacancy = vacancy;
      if (vacancy) {
        this.vacancy.title = vacancy.jobTitle;
        this.vacancy.description = vacancy.jobDescription;
        this.vacancy.employmentType = vacancy.employmentType ?? '';
        this.vacancy.experience = vacancy.requiredExperience ?? '';
        this.vacancy.location = vacancy.location ?? '';
        this.skills = (vacancy.requiredSkills ?? '').split(',').map(skill => skill.trim()).filter(Boolean);
      } else if (!this.errorMessage) {
        this.errorMessage = 'No vacancy information was returned.';
      }
      this.cdr.markForCheck();
    });
  }

  addSkill(): void {
    const skill = this.skillInput.trim();

    if (!skill) {
      return;
    }

    const alreadyExists = this.skills.some(
      existingSkill => existingSkill.toLowerCase() === skill.toLowerCase()
    );

    if (!alreadyExists) {
      this.skills.push(skill);
    }

    this.skillInput = '';
  }

  addRecommendedSkill(skill: string): void {
    const alreadyExists = this.skills.some(
      existingSkill => existingSkill.toLowerCase() === skill.toLowerCase()
    );

    if (!alreadyExists) {
      this.skills.push(skill);
    }
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  onSkillKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSkill();
    }
  }

  saveChanges(): void {
    if (this.isLoading || this.isSaving || this.isClosing) return;
    this.showSaveMessage = false;
    this.showValidationMessage = false;
    if (this.vacancyId === null || !this.loadedVacancy) {
      this.errorMessage = 'Load a valid vacancy before saving.';
      return;
    }
    const dto: UpdateVacancyDto = {
      jobTitle: this.vacancy.title.trim(),
      jobDescription: this.vacancy.description.trim(),
      requiredSkills: this.skills.join(', '),
      requiredExperience: this.vacancy.experience || null,
      education: this.loadedVacancy.education,
      location: this.vacancy.location.trim() || null,
      employmentType: this.vacancy.employmentType || null,
      closingDate: this.loadedVacancy.closingDate
    };
    this.errorMessage = vacancyValidation(dto);
    if (this.errorMessage) { this.showValidationMessage = true; return; }
    this.isSaving = true;
    const id = this.vacancyId;
    this.vacancyService.updateVacancy(id, dto).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.isSaving = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: response => {
        if (this.vacancyId !== id) return;
        if (!response) { this.errorMessage = 'No save confirmation was returned. Reload the vacancy before retrying.'; return; }
        this.loadedVacancy = { ...this.loadedVacancy!, ...dto };
        this.successMessage = 'Vacancy saved. Department, seniority and workplace settings are not supported by the API and were not saved.';
        this.showSaveMessage = true;
      },
      error: () => { if (this.vacancyId === id) this.errorMessage = 'Unable to save the vacancy. Please try again.'; }
    });
  }

  cancelChanges(): void {
    this.router.navigate(['/employer/vacancy-list']);
  }

  openCloseModal(): void {
    if (!this.loadedVacancy || this.isLoading || this.isSaving || this.isClosing) return;
    this.errorMessage = '';
    this.showCloseModal = true;
  }

  closeCloseModal(): void {
    if (!this.isClosing) this.showCloseModal = false;
  }

  confirmCloseVacancy(): void {
    if (this.vacancyId === null || !this.loadedVacancy || this.isLoading || this.isClosing || this.isSaving) return;
    this.isClosing = true;
    this.errorMessage = '';
    this.showSaveMessage = false;
    const id = this.vacancyId;
    this.vacancyService.closeVacancy(id).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.isClosing = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: response => {
        if (this.vacancyId !== id) return;
        if (!response) { this.errorMessage = 'No close confirmation was returned. Reload the vacancy before retrying.'; return; }
        this.loadedVacancy = { ...this.loadedVacancy!, status: 'Closed' };
        this.successMessage = 'Vacancy closed successfully.';
        this.showSaveMessage = true;
        this.showCloseModal = false;
      },
      error: () => { if (this.vacancyId === id) this.errorMessage = 'Unable to close the vacancy. Please try again.'; }
    });
  }

  previewVacancy(): void {
    if (this.vacancyId !== null && this.loadedVacancy) {
      this.router.navigate(['/employer/vacancy-details', this.vacancyId]);
    }
  }
}
