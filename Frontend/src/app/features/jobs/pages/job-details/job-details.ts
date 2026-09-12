import { Component } from '@angular/core';
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

  jobId = 0;

  jobs = [
    {
      id: 1,

      title: 'Lead Cloud Application Engineer',
      company: 'CloudScale Systems',

      location: 'Colombo',
      workMode: 'On-site',
      jobType: 'Full-Time Permanent',
      experience: '3 - 5 Years',

      salary: 'Competitive Salary',
      posted: 'Posted 2 days ago',

      matchScore: 94,
      matchLabel: 'Exceptional Match',

      overview:
        'Build and maintain scalable enterprise applications using Angular and .NET technologies.',

      responsibilities: [
        'Develop scalable enterprise web applications.',
        'Build Angular frontend applications.',
        'Develop secure .NET Core APIs.',
        'Work with SQL Server databases.',
        'Collaborate with cloud engineering teams.'
      ],

      requiredSkills: [
        {
          name: 'Angular',
          matched: true
        },
        {
          name: 'C#',
          matched: true
        },
        {
          name: '.NET Core',
          matched: true
        },
        {
          name: 'SQL Server',
          matched: true
        },
        {
          name: 'AWS',
          matched: true
        }
      ],

      missingSkills: [] as string[],

      minimumExperience: '3 - 5 Years',

      education:
        'B.S. in Computer Science or Equivalent',

      profileExperience: '5.8 Years',

      profileEducation:
        'B.S. in Computer Science',

      preferredQualifications: [
        'Experience developing enterprise applications.',
        'Knowledge of cloud platforms.',
        'Experience working with Agile development teams.'
      ],

      // My Applications-ல் இந்த job இருக்கு
      alreadyApplied: true
    },

    {
      id: 2,

      title: 'Senior Full Stack .NET & Angular Developer',
      company: 'FinStream Global',

      location: 'Colombo',
      workMode: 'Hybrid',
      jobType: 'Full-Time Permanent',
      experience: '3 - 5 Years',

      salary: 'Competitive Salary',
      posted: 'Posted 3 days ago',

      matchScore: 85,
      matchLabel: 'Strong Match',

      overview:
        'Develop secure and high-performance web applications using Angular, C# and SQL Server.',

      responsibilities: [
        'Design and develop ASP.NET Core Web APIs.',
        'Build responsive Angular frontend applications.',
        'Optimize SQL Server queries and procedures.',
        'Implement automated testing and quality standards.',
        'Collaborate with the team on deployment workflows.'
      ],

      requiredSkills: [
        {
          name: 'Angular',
          matched: true
        },
        {
          name: 'C#',
          matched: true
        },
        {
          name: 'SQL Server',
          matched: true
        },
        {
          name: 'REST API',
          matched: true
        },
        {
          name: 'Docker',
          matched: false
        }
      ],

      missingSkills: [
        'Docker'
      ],

      minimumExperience: '3 - 5 Years',

      education:
        'B.S. in Computer Science or Equivalent',

      profileExperience: '5.8 Years',

      profileEducation:
        'B.S. in Computer Science',

      preferredQualifications: [
        'Experience in fintech applications.',
        'Knowledge of containerized deployment.',
        'Experience mentoring junior developers.'
      ],

      // My Applications-ல் இந்த job இருக்கு
      alreadyApplied: true
    },

    {
      id: 3,

      title: 'Frontend Engineer - Angular',
      company: 'Apex Data Works',

      location: 'Jaffna',
      workMode: 'On-site',
      jobType: 'Full-Time Permanent',
      experience: '1 - 3 Years',

      salary: 'Competitive Salary',
      posted: 'Posted 1 day ago',

      matchScore: 88,
      matchLabel: 'Strong Match',

      overview:
        'Create modern responsive web applications and reusable Angular components.',

      responsibilities: [
        'Develop responsive Angular applications.',
        'Create reusable frontend components.',
        'Work with TypeScript and modern Angular.',
        'Implement responsive HTML and CSS.',
        'Collaborate with backend developers.'
      ],

      requiredSkills: [
        {
          name: 'Angular',
          matched: true
        },
        {
          name: 'TypeScript',
          matched: false
        },
        {
          name: 'HTML',
          matched: true
        },
        {
          name: 'CSS',
          matched: true
        }
      ],

      missingSkills: [
        'TypeScript'
      ],

      minimumExperience: '1 - 3 Years',

      education:
        'B.S. in Computer Science or Equivalent',

      profileExperience: '5.8 Years',

      profileEducation:
        'B.S. in Computer Science',

      preferredQualifications: [
        'Strong Angular knowledge.',
        'Experience building responsive interfaces.',
        'Understanding of reusable component design.'
      ],

      // My Applications-ல் இந்த job இருக்கு
      alreadyApplied: true
    },

    {
      id: 4,

      title: 'Software Engineer - Web Applications',
      company: 'HealthPulse Technologies',

      location: 'Kandy',
      workMode: 'Hybrid',
      jobType: 'Contract',
      experience: '1 - 3 Years',

      salary: 'Competitive Salary',
      posted: 'Posted 5 days ago',

      matchScore: 78,
      matchLabel: 'Good Match',

      overview:
        'Work with a software engineering team to build reliable web-based business applications.',

      responsibilities: [
        'Develop reliable web applications.',
        'Build Angular frontend features.',
        'Develop C# backend services.',
        'Work with SQL Server databases.',
        'Support cloud deployment activities.'
      ],

      requiredSkills: [
        {
          name: 'Angular',
          matched: true
        },
        {
          name: 'C#',
          matched: true
        },
        {
          name: 'SQL Server',
          matched: true
        },
        {
          name: 'Azure',
          matched: false
        }
      ],

      missingSkills: [
        'Azure'
      ],

      minimumExperience: '1 - 3 Years',

      education:
        'B.S. in Computer Science or Equivalent',

      profileExperience: '5.8 Years',

      profileEducation:
        'B.S. in Computer Science',

      preferredQualifications: [
        'Experience developing web applications.',
        'Knowledge of Microsoft Azure.',
        'Ability to work in collaborative software teams.'
      ],

      // இந்த job இன்னும் apply பண்ணல
      alreadyApplied: false
    }
  ];


  job = this.jobs[0];


  constructor(
    private route: ActivatedRoute
  ) {

    this.jobId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    const selectedJob = this.jobs.find(
      job => job.id === this.jobId
    );

    if (selectedJob) {
      this.job = selectedJob;
    }

  }

}