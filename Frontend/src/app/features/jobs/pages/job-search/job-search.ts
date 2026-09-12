import { Component } from '@angular/core';
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
export class JobSearch {

  searchKeyword = '';

  selectedLocation = '';
  selectedExperience = '';
  selectedJobType = '';

  currentPage = 1;
  itemsPerPage = 4;


  jobs = [
    {
      id: 1,

      title: 'Lead Cloud Application Engineer',
      company: 'CloudScale Systems',

      location: 'Colombo',
      jobType: 'Full Time',
      experience: '3 - 5 Years',

      posted: 'Posted 2 days ago',

      description:
        'Build and maintain scalable enterprise applications using Angular and .NET technologies.',

      skills: [
        'Angular',
        'C#',
        '.NET Core',
        'SQL Server',
        'AWS'
      ],

      missingSkills: [] as string[],

      matchScore: 94,
      matchLabel: 'Exceptional Match',

      // My Applications-ல் இருப்பதால் true
      alreadyApplied: true
    },

    {
      id: 2,

      title: 'Senior Full Stack .NET & Angular Developer',
      company: 'FinStream Global',

      location: 'Colombo',
      jobType: 'Full Time',
      experience: '3 - 5 Years',

      posted: 'Posted 3 days ago',

      description:
        'Develop secure and high-performance web applications using Angular, C# and SQL Server.',

      skills: [
        'Angular',
        'C#',
        'SQL Server',
        'REST API',
        'Docker'
      ],

      missingSkills: [
        'Docker'
      ],

      matchScore: 85,
      matchLabel: 'Strong Match',

      alreadyApplied: true
    },

    {
      id: 3,

      title: 'Frontend Engineer - Angular',
      company: 'Apex Data Works',

      location: 'Jaffna',
      jobType: 'Full Time',
      experience: '1 - 3 Years',

      posted: 'Posted 1 day ago',

      description:
        'Create modern responsive web applications and reusable Angular components.',

      skills: [
        'Angular',
        'TypeScript',
        'HTML',
        'CSS'
      ],

      missingSkills: [
        'TypeScript'
      ],

      matchScore: 88,
      matchLabel: 'Strong Match',

      // My Applications-ல் இருப்பதால் true
      alreadyApplied: true
    },

    {
      id: 4,

      title: 'Software Engineer - Web Applications',
      company: 'HealthPulse Technologies',

      location: 'Kandy',
      jobType: 'Contract',
      experience: '1 - 3 Years',

      posted: 'Posted 5 days ago',

      description:
        'Work with a software engineering team to build reliable web-based business applications.',

      skills: [
        'Angular',
        'C#',
        'SQL Server',
        'Azure'
      ],

      missingSkills: [
        'Azure'
      ],

      matchScore: 78,
      matchLabel: 'Good Match',

      // இன்னும் apply பண்ணவில்லை
      alreadyApplied: false
    }
  ];


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


  applyToJob(jobId: number): void {

    const job =
      this.jobs.find(
        item => item.id === jobId
      );

    if (
      !job ||
      job.alreadyApplied
    ) {
      return;
    }

    job.alreadyApplied = true;
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