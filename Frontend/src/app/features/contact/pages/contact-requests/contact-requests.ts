import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactRequestService } from '../../../../core/services/contact-request.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployerSidebar } from '../../../../shared/components/employer-sidebar/employer-sidebar';

type RequestStatus = 'all' | 'pending' | 'accepted' | 'declined';

@Component({
  selector: 'app-contact-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    EmployerSidebar
  ],
  templateUrl: './contact-requests.html',
  styleUrl: './contact-requests.css',
})
export class ContactRequests {

  searchTerm = '';

  activeStatus: RequestStatus = 'all';

  contactModalOpen = false;

  contactMessage = '';
  isSubmitting = false;
  submitError = '';
  successMessage = '';
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  selectedCandidate = {
    applicationId: null as number | null,
    name: '',
    email: '',
    phone: '',
    location: '',
  };

  constructor(private router: Router, private contactRequestService: ContactRequestService) {}

  setStatus(status: RequestStatus): void {
    this.activeStatus = status;
  }

  onSearch(): void {
    // Backend data filtering will be connected later.
  }

  // A caller must supply a candidate from real application data; text fields cannot establish identity.
  openContactModal(candidate?: typeof this.selectedCandidate): void {
    if (this.isSubmitting) return;
    this.selectedCandidate = candidate
      ? { ...candidate }
      : { applicationId: null, name: '', email: '', phone: '', location: '' };
    this.contactMessage = '';
    this.submitError = '';
    this.successMessage = '';
    this.contactModalOpen = true;
  }

  closeContactModal(): void {
    if (this.isSubmitting) return;
    this.clearContactForm();
  }

  private clearContactForm(): void {
    this.contactModalOpen = false;
    this.contactMessage = '';
    this.submitError = '';
    this.selectedCandidate = { applicationId: null, name: '', email: '', phone: '', location: '' };
  }

  candidateDetailsChanged(): void {
    // Editing a name/email must not leave an ID belonging to a different candidate.
    this.selectedCandidate.applicationId = null;
    this.submitError = '';
  }

  get contactValidationMessage(): string {
    const id = this.selectedCandidate.applicationId;
    if (!Number.isInteger(id) || id! <= 0 || id! > 2147483647 || !this.selectedCandidate.name.trim()) {
      return 'A real candidate/application must be selected. Candidate selection is not available on this page yet; entering a name and email is not enough to send.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.selectedCandidate.email.trim())) {
      return 'Enter a valid candidate email address.';
    }
    const message = this.contactMessage.trim();
    if (!message) return 'Enter a message.';
    if (message.length > 500) return 'The message must be 500 characters or fewer.';
    return '';
  }

  get canSendContactRequest(): boolean {
    return !this.isSubmitting && !this.contactValidationMessage;
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
    if (this.isSubmitting) return;
    this.submitError = this.contactValidationMessage;
    if (this.submitError) return;

    const applicationId = this.selectedCandidate.applicationId!;
    this.successMessage = '';
    this.isSubmitting = true;
    this.contactRequestService.sendContactRequest({
      applicationId,
      message: this.contactMessage.trim()
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.isSubmitting = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: request => {
        if (!request || !Number.isInteger(request.id) || request.id <= 0 || request.applicationId !== applicationId) {
          this.submitError = 'The server returned no valid confirmation. Check your sent requests before retrying.';
          return;
        }
        this.clearContactForm();
        this.successMessage = 'Request sent successfully.';
      },
      error: (error: HttpErrorResponse) => {
        switch (error.status) {
          case 0: this.submitError = 'Unable to connect. Check your connection and try again.'; break;
          case 401: this.submitError = 'Your session has expired. Sign in again before sending.'; break;
          case 403: this.submitError = 'Your account is not allowed to send this contact request.'; break;
          case 404: this.submitError = 'The selected application is no longer available. Select a real application again.'; break;
          case 409: this.submitError = 'A contact request already exists for this candidate/application.'; break;
          case 400: this.submitError = 'Check the selected application and message (maximum 500 characters).'; break;
          default: this.submitError = 'Unable to confirm the request. Check your sent requests before retrying.';
        }
      }
    });
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
