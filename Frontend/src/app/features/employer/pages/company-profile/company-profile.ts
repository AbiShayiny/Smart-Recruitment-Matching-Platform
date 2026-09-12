import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.css'
})
export class CompanyProfile {

  companyName = '';
  legalName = '';
  website = '';
  industry = '';
  companySize = '';
  foundedYear = '';
  headquarters = '';
  address = '';
  city = '';
  country = '';
  contactName = '';
  contactEmail = '';
  contactPhone = '';
  description = '';

  saved = false;

  constructor(private router: Router) {}

  get profileCompletion(): number {
    const fields = [
      this.companyName,
      this.legalName,
      this.website,
      this.industry,
      this.companySize,
      this.headquarters,
      this.address,
      this.city,
      this.country,
      this.contactName,
      this.contactEmail,
      this.contactPhone,
      this.description
    ];

    const completed = fields.filter(value => value.trim() !== '').length;

    return Math.round((completed / fields.length) * 100);
  }

  saveProfile(): void {
    this.saved = true;

    setTimeout(() => {
      this.saved = false;
    }, 2500);
  }

  cancel(): void {
    this.router.navigate(['/employer/dashboard']);
  }

  goToDashboard(): void {
    this.router.navigate(['/employer/dashboard']);
  }

  goToVacancies(): void {
    this.router.navigate(['/employer/vacancy-list']);
  }

  goToApplicants(): void {
    this.router.navigate(['/applications/applicants-list']);
  }

  goToContactRequests(): void {
    this.router.navigate(['/contact/contact-requests']);
  }
}