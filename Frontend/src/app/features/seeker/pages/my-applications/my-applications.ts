import { ApplicationService, SeekerApplication } from '../../../../core/services/application.service';
import { firstValueFrom } from 'rxjs';
import { Component, ChangeDetectorRef, inject } from '@angular/core';
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
  private api = inject(ApplicationService);
  private cdr = inject(ChangeDetectorRef);
  applications: SeekerApplication[] = [];
  loading = false;
  error = '';
  async ngOnInit() {
    this.loading = true;
    try { this.applications = (await firstValueFrom(this.api.getMyApplications())) ?? []; }
    catch { this.error = 'Unable to load applications. Check your connection and make sure your profile exists.'; }
    finally { this.loading = false; this.cdr.markForCheck(); }
  }
}
