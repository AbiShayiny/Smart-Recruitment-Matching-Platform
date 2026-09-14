import { VacancyService } from '../../../../core/services/vacancy.service';
import { MatchingService, SeekerMatch } from '../../../../core/services/matching.service';
import { ApplicationService } from '../../../../core/services/application.service';
import { SeekerProfileService } from '../../../../core/services/seeker-profile.service';
import { firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [
    Navbar,
    RouterLink
  ],
  templateUrl: './job-details.html',
  styleUrl: './job-details.css'
})
export class JobDetails {
  private vacancies = inject(VacancyService);
  private matching = inject(MatchingService);
  private applications = inject(ApplicationService);
  private profiles = inject(SeekerProfileService);
  private cdr = inject(ChangeDetectorRef);
  jobId = 0;
  loading = false;
  applying = false;
  applicationStateKnown = false;
  error = '';
  match: SeekerMatch | null = null;
  job: {
    id: number; title: string; company: string; location: string; workMode: string;
    jobType: string; experience: string; salary: string; posted: string;
    matchScore: number | null; matchLabel: string; overview: string;
    responsibilities: string[]; requiredSkills: { name: string; matched: boolean }[];
    missingSkills: string[]; minimumExperience: string; education: string;
    profileExperience: string; profileEducation: string; preferredQualifications: string[];
    alreadyApplied: boolean; status: string;
  } | null = null;
  private loadVersion = 0;
  constructor(private route: ActivatedRoute) {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.jobId = Number(params.get('id'));
      void this.load();
    });
  }
  private async load() {
    const version = ++this.loadVersion;
    const id = this.jobId;
    this.job = null; this.match = null; this.error = ''; this.applicationStateKnown = false;
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.loading = false; this.error = 'Invalid job ID.'; this.cdr.markForCheck(); return;
    }
    this.loading = true;
    try {
      const vacancy = await firstValueFrom(this.vacancies.getSeekerVacancy(id));
      if (version !== this.loadVersion) return;
      if (!vacancy) return;
      this.job = { id: vacancy.vacancyId, title: vacancy.jobTitle, company: '',
        location: vacancy.location ?? '', workMode: '', jobType: vacancy.employmentType ?? '',
        experience: vacancy.requiredExperience ?? '', salary: '', posted: vacancy.createdAt,
        matchScore: null, matchLabel: '', overview: vacancy.jobDescription,
        responsibilities: [], requiredSkills: (vacancy.requiredSkills ?? '').split(/[,;]/).map(s => s.trim()).filter(Boolean).map(name => ({ name, matched: false })),
        missingSkills: [], minimumExperience: vacancy.requiredExperience ?? '', education: vacancy.education ?? '',
        profileExperience: '', profileEducation: '', preferredQualifications: [], alreadyApplied: false, status: vacancy.status };
      const [applications, match, profile] = await Promise.allSettled([
        firstValueFrom(this.applications.getMyApplications()),
        firstValueFrom(this.matching.getMatch(id)),
        firstValueFrom(this.profiles.getProfile())
      ]);
      if (version !== this.loadVersion || !this.job) return;
      if (applications.status === 'fulfilled') {
        this.job.alreadyApplied = (applications.value ?? []).some(item => item.vacancyId === id);
        this.applicationStateKnown = true;
      } else this.error = 'Unable to verify application status. Reload before applying.';
      if (match.status === 'fulfilled' && match.value) {
        this.match = match.value; this.job.matchScore = match.value.matchScore;
        this.job.missingSkills = match.value.missingSkills ?? [];
        this.job.requiredSkills = this.job.requiredSkills.map(skill => ({ ...skill,
          matched: (match.value.matchedSkills ?? []).some(name => name.toLowerCase() === skill.name.toLowerCase()) }));
      } else this.error += ' Matching information is unavailable.';
      if (profile.status === 'fulfilled' && profile.value) {
        this.job.profileExperience = profile.value.experience ?? '';
        this.job.profileEducation = profile.value.education ?? '';
      }
    } catch { if (version === this.loadVersion) this.error = 'Unable to load this vacancy. It may no longer be available.'; }
    finally { if (version === this.loadVersion) { this.loading = false; this.cdr.markForCheck(); } }
  }
  async applyToJob() {
    if (!this.job || this.job.alreadyApplied || this.applying || !this.applicationStateKnown || this.job.status !== 'Open') return;
    const job = this.job;
    this.applying = true; this.error = '';
    try { await firstValueFrom(this.applications.apply(job.id)); job.alreadyApplied = true; }
    catch { this.error = 'Application failed. Please check your profile and try again.'; }
    finally { this.applying = false; this.cdr.markForCheck(); }
  }
}
