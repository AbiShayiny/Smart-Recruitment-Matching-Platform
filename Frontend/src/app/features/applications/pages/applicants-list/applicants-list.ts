import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-applicants-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applicants-list.html',
  styleUrl: './applicants-list.css',
})
export class ApplicantsList {

  vacancyId: string | null = null;

  searchText = '';
  selectedStage = '';
  selectedMatch = '';
  selectedExperience = '';

  applicants: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.vacancyId = this.route.snapshot.paramMap.get('id');
  }

  get filteredApplicants(): any[] {
    const search = this.searchText.trim().toLowerCase();

    return this.applicants.filter(applicant => {

      const matchesSearch =
        !search ||
        applicant.name?.toLowerCase().includes(search) ||
        applicant.email?.toLowerCase().includes(search) ||
        applicant.role?.toLowerCase().includes(search);

      const matchesStage =
        !this.selectedStage ||
        applicant.stage === this.selectedStage;

      const matchesMatch =
        !this.selectedMatch ||
        applicant.matchLevel === this.selectedMatch;

      const matchesExperience =
        !this.selectedExperience ||
        applicant.experience === this.selectedExperience;

      return (
        matchesSearch &&
        matchesStage &&
        matchesMatch &&
        matchesExperience
      );
    });
  }

  get totalApplicants(): number {
    return this.applicants.length;
  }

  get shortlistedApplicants(): number {
    return this.applicants.filter(
      applicant => applicant.stage === 'Shortlisted'
    ).length;
  }

  get interviewApplicants(): number {
    return this.applicants.filter(
      applicant => applicant.stage === 'Interview'
    ).length;
  }

  get highMatchApplicants(): number {
    return this.applicants.filter(
      applicant => applicant.matchLevel === 'High Match'
    ).length;
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStage = '';
    this.selectedMatch = '';
    this.selectedExperience = '';
  }

  goBack(): void {
    this.router.navigate(['/employer/vacancy-list']);
  }

  viewApplicant(applicant: any): void {
    if (!applicant?.id) {
      return;
    }

    this.router.navigate([
      '/applications/applicant-details',
      applicant.id
    ]);
  }

  contactApplicant(applicant: any): void {
    if (!applicant?.id) {
      return;
    }

    this.router.navigate([
      '/applications/contact',
      applicant.id
    ]);
  }
}