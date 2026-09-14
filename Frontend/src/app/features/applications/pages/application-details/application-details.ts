import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService, EmployerApplicant } from '../../../../core/services/application.service';
import { ContactRequestService } from '../../../../core/services/contact-request.service';

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './application-details.html',
  styleUrl: './application-details.css',
})
export class ApplicationDetails {

  applicationId = '';
  applicant: EmployerApplicant | null = null;
  loading = true;
  loadError = '';
  actionMessage = '';
  cvLoading = false;
  cvError = '';

  pipelineStatus = '';
  statusUpdating = false;

  contactModalOpen = false;
  cvModalOpen = false;

  contactMessage = '';
  contactSending = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private contactRequestService: ContactRequestService
  ) {}

  ngOnInit(): void {
    this.applicationId =
      this.route.snapshot.paramMap.get('id') ||
      this.route.snapshot.paramMap.get('applicationId') ||
      '';

    const applicationId = Number(this.applicationId);
    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      this.loading = false;
      this.loadError = 'Invalid application ID.';
      return;
    }

    this.applicationService.getApplicationById(applicationId).subscribe({
      next: applicant => {
        this.applicant = applicant;
        this.pipelineStatus = applicant.status;
        this.loading = false;
      },
      error: error => {
        this.loadError = error.status === 404
          ? 'Application not found or you do not have access to it.'
          : 'Unable to load application details.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/applications/applicants-list'], {
      queryParams: this.applicant ? { vacancyId: this.applicant.vacancyId } : undefined
    });
  }

  updateStatus(): void {
    if (!this.pipelineStatus) {
      return;
    }

    const applicationId = Number(this.applicationId);

    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      return;
    }

    this.statusUpdating = true;

    this.applicationService
      .updateStatus(applicationId, this.pipelineStatus)
      .subscribe({
        next: updatedApplication => {
          this.pipelineStatus = updatedApplication.status;
          if (this.applicant) this.applicant.status = updatedApplication.status;
          this.actionMessage = `Application status updated to ${updatedApplication.status}.`;
          this.statusUpdating = false;
        },
        error: () => {
          this.actionMessage = 'Application status could not be updated.';
          this.statusUpdating = false;
        }
      });
  }

  openContactModal(): void {
    this.contactModalOpen = true;
  }

  closeContactModal(): void {
    this.contactModalOpen = false;
  }

  sendContactRequest(): void {
    const applicationId = Number(this.applicationId);
    const message = this.contactMessage.trim();

    if (!Number.isInteger(applicationId) || applicationId <= 0 || !message) {
      return;
    }

    this.contactSending = true;

    this.contactRequestService
      .sendContactRequest({
        applicationId,
        message
      })
      .subscribe({
        next: () => {
          this.contactSending = false;
          this.contactMessage = '';
          this.contactModalOpen = false;
          this.actionMessage = 'Contact request sent.';
        },
        error: () => {
          this.actionMessage = 'Contact request could not be sent.';
          this.contactSending = false;
        }
      });
  }

  openCvModal(): void {
    const applicationId = Number(this.applicationId);
    if (!Number.isInteger(applicationId) || applicationId <= 0 || this.cvLoading) return;

    this.cvLoading = true;
    this.cvError = '';
    this.cvModalOpen = true;
    this.applicationService.getApplicantCv(applicationId).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        this.cvLoading = false;
        this.cvModalOpen = false;
      },
      error: error => {
        this.cvError = error.status === 403
          ? 'You are not authorized to view this CV.'
          : error.status === 404
            ? 'No CV is available for this applicant.'
            : 'Unable to load the candidate CV.';
        this.cvLoading = false;
      }
    });
  }

  closeCvModal(): void {
    if (!this.cvLoading) this.cvModalOpen = false;
  }

  get candidateName(): string {
    return `${this.applicant?.firstName ?? ''} ${this.applicant?.lastName ?? ''}`.trim();
  }

  get skills(): string[] {
    return (this.applicant?.skills ?? '').split(/[,;]/).map(skill => skill.trim()).filter(Boolean);
  }
}
