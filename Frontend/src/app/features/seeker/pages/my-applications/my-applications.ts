import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [
    Navbar,
    RouterLink
  ],
  templateUrl: './my-applications.html',
  styleUrl: './my-applications.css'
})
export class MyApplications {

  applications = [
    {
      id: 1,
      jobId: 2,
      title: 'Senior Full Stack .NET & Angular Developer',
      company: 'FinStream Global',
      location: 'Colombo',
      appliedDate: 'Sep 08, 2026',
      matchScore: 85,
      status: 'Under Review'
    },
    {
      id: 2,
      jobId: 1,
      title: 'Lead Cloud Application Engineer',
      company: 'CloudScale Systems',
      location: 'Colombo',
      appliedDate: 'Sep 05, 2026',
      matchScore: 94,
      status: 'Shortlisted'
    },
    {
      id: 3,
      jobId: 3,
      title: 'Frontend Engineer - Angular',
      company: 'Apex Data Works',
      location: 'Jaffna',
      appliedDate: 'Sep 01, 2026',
      matchScore: 88,
      status: 'Submitted'
    }
  ];

}