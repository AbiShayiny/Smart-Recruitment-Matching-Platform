import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { VacancyModel } from '../../../../core/models/vacancy.model';
import { VacancyService } from '../../../../core/services/vacancy.service';
import { CompanyService } from '../../../../core/services/company.service';

@Component({
  selector: 'app-vacancy-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './vacancy-list.html',
  styleUrl: './vacancy-list.css'
})
export class VacancyList implements OnInit {
  searchText = '';
  selectedStatus = '';
  selectedLocation = '';
  selectedDepartment = '';
  vacancies: VacancyModel[] = [];
  isLoading = false;
  errorMessage = '';
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(private router: Router, private vacancyService: VacancyService, private companyService: CompanyService) {}

  ngOnInit(): void {
    const companyId = this.companyService.getCurrentCompanyId();
    if (companyId === null) {
      this.errorMessage = 'Your account is not linked to a company yet. Vacancies cannot be loaded until that association is available.';
      return;
    }
    this.isLoading = true;
    this.vacancyService.getMyVacancies(companyId).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.isLoading = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: vacancies => { this.vacancies = vacancies ?? []; },
      error: () => {
        this.vacancies = [];
        this.errorMessage = 'Unable to load vacancies. Please try again later.';
      }
    });
  }

  get locations(): string[] {
    return [...new Set(this.vacancies.map(vacancy => vacancy.location).filter((location): location is string => !!location))];
  }

  get filteredVacancies(): VacancyModel[] {
    const search = this.searchText.trim().toLowerCase();
    return this.vacancies.filter(vacancy =>
      (!search || vacancy.jobTitle.toLowerCase().includes(search) || String(vacancy.vacancyId).includes(search)) &&
      (!this.selectedStatus || vacancy.status === this.selectedStatus) &&
      (!this.selectedLocation || vacancy.location === this.selectedLocation)
    );
  }

  get totalVacancies(): number { return this.vacancies.length; }
  get activePipelines(): number { return this.vacancies.filter(vacancy => vacancy.status === 'Open').length; }
  get archivedVacancies(): number {
    return this.vacancies.filter(vacancy => vacancy.status === 'Archived' || vacancy.status === 'Closed').length;
  }
  get totalCandidates(): string { return 'Not available'; }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedLocation = '';
    this.selectedDepartment = '';
  }
  createVacancy(): void { this.router.navigate(['/employer/vacancy-create']); }
  viewVacancy(vacancy: VacancyModel): void {
    this.router.navigate(['/employer/vacancy-details', vacancy.vacancyId]);
  }
  editVacancy(vacancy: VacancyModel): void {
    this.router.navigate(['/employer/vacancy-edit', vacancy.vacancyId]);
  }
}
