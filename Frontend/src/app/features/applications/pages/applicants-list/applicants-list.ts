import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicationService, EmployerApplicant } from '../../../../core/services/application.service';

@Component({
  selector: 'app-applicants-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './applicants-list.html',
  styleUrl: './applicants-list.css',
})
export class ApplicantsList implements OnInit {

  vacancyId: string | null = null;

  searchText = '';
  selectedStage = '';
  selectedMatch = '';
  selectedExperience = '';

  applicants: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private applicationService: ApplicationService
  ) {
    this.vacancyId = this.route.snapshot.queryParamMap.get('vacancyId');
  }

  ngOnInit(): void {
    const vacancyId = Number(this.vacancyId);

    if (!Number.isInteger(vacancyId) || vacancyId <= 0) {
      this.applicants = [];
      return;
    }

    this.applicationService.getApplicants(vacancyId).subscribe({
      next: applicants => {
        this.applicants = applicants.map((applicant: EmployerApplicant) => ({
          id: applicant.applicationId,
          name: '',
          email: '',
          role: '',
          matchScore: applicant.matchScore,
          matchLevel: '',
          experience: applicant.experience,
          stage: applicant.status,
          appliedDate: applicant.appliedAt,
          jobSeekerProfileId: applicant.jobSeekerProfileId,
          skills: applicant.skills,
          education: applicant.education,
          location: applicant.location,
          updatedAt: applicant.updatedAt
        }));
      },
      error: () => {
        this.applicants = [];
      }
    });
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
      '/applications/application-details',
      applicant.id
    ]);
  }

  contactApplicant(applicant: any): void {
    if (!applicant?.id) {
      return;
    }

    this.router.navigate(['/contact/contact-requests'], { queryParams: { applicationId: applicant.id } });
  }
}
