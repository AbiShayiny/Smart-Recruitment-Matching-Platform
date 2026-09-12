import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Vacancy {
  id: number | string;
  title: string;
  code: string;
  location: string;
  workplaceModel: string;
  experience: string;
  applicants: number;
  status: string;
  postedDate: string;
}

@Component({
  selector: 'app-vacancy-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vacancy-list.html',
  styleUrl: './vacancy-list.css'
})
export class VacancyList {

  searchText = '';
  selectedStatus = '';
  selectedLocation = '';
  selectedDepartment = '';

  // Backend / DB integration can be connected later.
  vacancies: Vacancy[] = [];

  constructor(private router: Router) {}

  get filteredVacancies(): Vacancy[] {
    const search = this.searchText.trim().toLowerCase();

    return this.vacancies.filter(vacancy => {
      const matchesSearch =
        !search ||
        vacancy.title.toLowerCase().includes(search) ||
        vacancy.code.toLowerCase().includes(search);

      const matchesStatus =
        !this.selectedStatus ||
        vacancy.status === this.selectedStatus;

      const matchesLocation =
        !this.selectedLocation ||
        vacancy.location === this.selectedLocation;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }

  get totalVacancies(): number {
    return this.vacancies.length;
  }

  get activePipelines(): number {
    return this.vacancies.filter(
      vacancy => vacancy.status === 'Active'
    ).length;
  }

  get archivedVacancies(): number {
    return this.vacancies.filter(
      vacancy =>
        vacancy.status === 'Archived' ||
        vacancy.status === 'Closed'
    ).length;
  }

  get totalCandidates(): number {
    return this.vacancies.reduce(
      (total, vacancy) => total + vacancy.applicants,
      0
    );
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedLocation = '';
    this.selectedDepartment = '';
  }

  createVacancy(): void {
    this.router.navigate(['/employer/vacancy-create']);
  }

  viewVacancy(vacancy: Vacancy): void {
    this.router.navigate([
      '/employer/vacancy-details',
      vacancy.id
    ]);
  }

  editVacancy(vacancy: Vacancy): void {
    this.router.navigate([
      '/employer/vacancy-edit',
      vacancy.id
    ]);
  }
}