import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

type RequestStatus = 'all' | 'pending' | 'accepted' | 'declined';

@Component({
  selector: 'app-contact-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './contact-requests.html',
  styleUrl: './contact-requests.css',
})
export class ContactRequests {

  searchTerm = '';

  activeStatus: RequestStatus = 'all';

  contactModalOpen = false;

  contactMessage = '';

  selectedCandidate = {
    name: '',
    email: '',
    phone: '',
    location: '',
  };

  constructor(private router: Router) {}

  setStatus(status: RequestStatus): void {
    this.activeStatus = status;
  }

  onSearch(): void {
    // Backend data filtering will be connected later.
  }

  openContactModal(): void {
    this.contactModalOpen = true;
  }

  closeContactModal(): void {
    this.contactModalOpen = false;
    this.contactMessage = '';
  }

  viewApplicant(applicationId?: string): void {
    if (!applicationId) {
      return;
    }

    this.router.navigate([
      '/applications/application-details',
      applicationId
    ]);
  }

  remindCandidate(requestId?: string): void {
    if (!requestId) {
      return;
    }

    // Reminder API will be connected later.
  }

  sendContactRequest(): void {
    if (!this.selectedCandidate.email) {
      return;
    }

    // Contact request API will be connected later.
  }

  copyText(value: string): void {
    if (!value) {
      return;
    }

    navigator.clipboard?.writeText(value);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending';

      case 'accepted':
        return 'Accepted';

      case 'declined':
        return 'Declined';

      default:
        return 'All Requests';
    }
  }
}