import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../../core/services/application.service';
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
  }

  goBack(): void {
    this.router.navigate(['/applications/applicants-list']);
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
          this.statusUpdating = false;
        },
        error: () => {
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
        },
        error: () => {
          this.contactSending = false;
        }
      });
  }

  openCvModal(): void {
    this.cvModalOpen = true;
  }

  closeCvModal(): void {
    this.cvModalOpen = false;
  }
}
