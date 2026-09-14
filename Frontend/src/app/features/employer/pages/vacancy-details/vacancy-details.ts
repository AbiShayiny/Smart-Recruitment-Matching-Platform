import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { VacancyService } from '../../../../core/services/vacancy.service';
import { parseVacancyId, VacancyModel } from '../../../../core/models/vacancy.model';
import { EmployerSidebar } from '../../../../shared/components/employer-sidebar/employer-sidebar';

@Component({
  selector: 'app-vacancy-details',
  standalone: true,
  imports: [CommonModule, RouterLink, EmployerSidebar],
  templateUrl: './vacancy-details.html',
  styleUrl: './vacancy-details.css'
})
export class VacancyDetails implements OnInit {
  vacancyId: number | null = null;
  vacancy: VacancyModel | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(private route: ActivatedRoute, private router: Router, private vacancyService: VacancyService) {
    this.successMessage = this.router.getCurrentNavigation()?.extras.state?.['successMessage'] ?? '';
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.vacancyId = parseVacancyId(params.get('id'));
        this.vacancy = null;
        this.errorMessage = '';
        if (this.vacancyId === null) {
          this.errorMessage = 'The vacancy ID is missing or invalid.';
          return of(null);
        }
        this.isLoading = true;
        return this.vacancyService.getVacancy(this.vacancyId).pipe(
          catchError(() => {
            this.errorMessage = 'Unable to load this vacancy. It may no longer exist. Please try again later.';
            return of(null);
          }),
          finalize(() => { this.isLoading = false; this.cdr.markForCheck(); })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(vacancy => {
      this.vacancy = vacancy;
      if (!vacancy && !this.errorMessage) this.errorMessage = 'No vacancy information was returned.';
      this.cdr.markForCheck();
    });
  }

  get skills(): string[] {
    return (this.vacancy?.requiredSkills ?? '').split(',').map(skill => skill.trim()).filter(Boolean);
  }

  goBack(): void { this.router.navigate(['/employer/vacancy-list']); }

  editVacancy(): void {
    if (this.vacancyId !== null && this.vacancy) this.router.navigate(['/employer/vacancy-edit', this.vacancyId]);
  }

  viewApplicants(): void {
    if (this.vacancyId !== null && this.vacancy) {
      this.router.navigate(['/applications/applicants-list'], { queryParams: { vacancyId: this.vacancyId } });
    }
  }

  get hasVacancy(): boolean { return this.vacancy !== null; }
}
