import { VacancyService } from '../../../../core/services/vacancy.service';
import { ApplicationService } from '../../../../core/services/application.service';
import { MatchingService } from '../../../../core/services/matching.service';
import { firstValueFrom } from 'rxjs';
import { Component, ChangeDetectorRef, inject, OnInit, isDevMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [
    Navbar,
    FormsModule,
    RouterLink
  ],
  templateUrl: './job-search.html',
  styleUrl: './job-search.css'
})
export class JobSearch implements OnInit {
  private vacancies = inject(VacancyService);
  private applications = inject(ApplicationService);
  private matching = inject(MatchingService);
  private cdr = inject(ChangeDetectorRef);
  applying = new Set<number>();
  error = '';
  availabilityMessage = '';
  loading = false;


  searchKeyword = '';

  selectedLocation = '';
  selectedExperience = '';
  selectedJobType = '';

  currentPage = 1;
  itemsPerPage = 4;


  jobs: {
    id: number;
    title: string;
    company: string;
    location: string;
    jobType: string;
    experience: string;
    posted: string;
    description: string;
    skills: string[];
    missingSkills: string[] | null;
    matchScore: number | null;
    matchLabel: string;
    alreadyApplied: boolean | null;
  }[] = [];


  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.availabilityMessage = 'Loading jobs...';
    this.error = '';
    this.jobs = [];
    try {
      const vacancies = await firstValueFrom(this.vacancies.getOpenVacancies());
      this.jobs = (vacancies ?? []).map(vacancy => ({
        id: vacancy.vacancyId,
        title: vacancy.jobTitle ?? '',
        company: '', // The vacancy response does not include a company name.
        location: vacancy.location ?? '',
        jobType: vacancy.employmentType ?? '',
        experience: vacancy.requiredExperience ?? '',
        posted: vacancy.createdAt ?? '',
        description: vacancy.jobDescription ?? '',
        skills: [...new Set((vacancy.requiredSkills ?? '').split(/[,;]/).map(skill => skill.trim()).filter(Boolean))],
        missingSkills: null,
        matchScore: null,
        matchLabel: '',
        alreadyApplied: null
      }));
      const matchResults = await Promise.allSettled(
        this.jobs.map(job => firstValueFrom(this.matching.getMatch(job.id)))
      );
      matchResults.forEach((matchResult, index) => {
        if (matchResult.status === 'fulfilled') {
          this.jobs[index].matchScore = matchResult.value.matchScore;
          this.jobs[index].missingSkills = matchResult.value.missingSkills ?? [];
        }
      });
      this.currentPage = 1;
      this.availabilityMessage = '';
    } catch (error) {
      this.jobs = [];
      this.availabilityMessage = 'Job listings are currently unavailable.';
      if (isDevMode()) console.error('GET open vacancies failed', error);
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
    if (!this.jobs.length) return;
    try {
      const applications = await firstValueFrom(this.applications.getMyApplications());
      const appliedIds = new Set((applications ?? []).map(application => application.vacancyId));
      this.jobs = this.jobs.map(job => ({ ...job, alreadyApplied: appliedIds.has(job.id) }));
    } catch (error) {
      this.error = 'Jobs loaded, but application status could not be verified. Please check your session and profile.';
      if (isDevMode()) console.error('GET my applications failed', error);
    } finally { this.cdr.markForCheck(); }
  }

  get filteredJobs() {

    const keyword =
      this.searchKeyword
        .trim()
        .toLowerCase();

    return this.jobs.filter(job => {

      const keywordMatch =
        !keyword ||
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword) ||
        job.skills.some(skill =>
          skill.toLowerCase().includes(keyword)
        );

      const locationMatch =
        !this.selectedLocation ||
        job.location === this.selectedLocation;

      const experienceMatch =
        !this.selectedExperience ||
        job.experience === this.selectedExperience;

      const jobTypeMatch =
        !this.selectedJobType ||
        job.jobType === this.selectedJobType;

      return (
        keywordMatch &&
        locationMatch &&
        experienceMatch &&
        jobTypeMatch
      );
    });
  }


  get paginatedJobs() {

    const startIndex =
      (this.currentPage - 1) *
      this.itemsPerPage;

    const endIndex =
      startIndex +
      this.itemsPerPage;

    return this.filteredJobs.slice(
      startIndex,
      endIndex
    );
  }


  get totalPages(): number {

    return Math.max(
      1,
      Math.ceil(
        this.filteredJobs.length /
        this.itemsPerPage
      )
    );
  }


  searchJobs(): void {

    this.currentPage = 1;
  }


  clearFilters(): void {

    this.searchKeyword = '';

    this.selectedLocation = '';

    this.selectedExperience = '';

    this.selectedJobType = '';

    this.currentPage = 1;
  }


  async applyToJob(jobId: number) {
    const job = this.jobs.find(item => item.id === jobId);
    if (!job || job.alreadyApplied !== false || this.applying.has(jobId)) return;
    this.applying.add(jobId); this.error = '';
    try { await firstValueFrom(this.applications.apply(jobId)); job.alreadyApplied = true; }
    catch { this.error = 'Application failed. Please check your profile and try again.'; }
    finally { this.applying.delete(jobId); this.cdr.markForCheck(); }
  }

  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;
  }


  previousPage(): void {

    this.goToPage(
      this.currentPage - 1
    );
  }


  nextPage(): void {

    this.goToPage(
      this.currentPage + 1
    );
  }

}
