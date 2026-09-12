import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './application-details.html',
  styleUrl: './application-details.css',
})
export class ApplicationDetails {

  applicationId = '';

  pipelineStatus = '';

  contactModalOpen = false;
  cvModalOpen = false;

  contactMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
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

    /*
     * Backend status update will be connected later.
     */
  }

  openContactModal(): void {
    this.contactModalOpen = true;
  }

  closeContactModal(): void {
    this.contactModalOpen = false;
  }

  sendContactRequest(): void {
    /*
     * Contact request API will be connected later.
     */

    this.contactModalOpen = false;
  }

  openCvModal(): void {
    this.cvModalOpen = true;
  }

  closeCvModal(): void {
    this.cvModalOpen = false;
  }
}