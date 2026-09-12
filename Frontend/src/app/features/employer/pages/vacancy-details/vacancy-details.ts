import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface VacancyDetailsModel {
  id: string | number;
  title: string;
  code: string;
  department: string;
  employmentType: string;
  workplaceModel: string;
  location: string;
  experience: string;
  seniority: string;
  description: string;
  skills: string[];
  applicants: number;
  status: string;
  postedDate: string;
}

@Component({
  selector: 'app-vacancy-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacancy-details.html',
  styleUrl: './vacancy-details.css'
})
export class VacancyDetails {

  vacancyId: string | null = null;

  vacancy: VacancyDetailsModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.vacancyId = this.route.snapshot.paramMap.get('id');
  }

  goBack(): void {
    this.router.navigate(['/employer/vacancy-list']);
  }

  editVacancy(): void {
    if (!this.vacancyId) {
      return;
    }

    this.router.navigate([
      '/employer/vacancy-edit',
      this.vacancyId
    ]);
  }

  viewApplicants(): void {
    if (!this.vacancyId) {
      return;
    }

    this.router.navigate([
      '/employer/ranked-applicants',
      this.vacancyId
    ]);
  }

  get hasVacancy(): boolean {
    return this.vacancy !== null;
  }
}