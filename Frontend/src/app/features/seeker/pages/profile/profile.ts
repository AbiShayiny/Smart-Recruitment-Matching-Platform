import { SeekerProfileService, SeekerProfileResponse } from '../../../../core/services/seeker-profile.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    Navbar,
    FormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  private api = inject(SeekerProfileService);
  private cdr = inject(ChangeDetectorRef);
  isEditing = false;
  loading = false;
  error = '';
  message = '';
  private exists = false;
  ready = false;
  profile = { firstName: '', lastName: '', email: '', phone: '', location: '',
    professionalTitle: '', summary: '', experienceYears: '', education: '', skills: [] as string[] };
  private saved = { ...this.profile, skills: [...this.profile.skills] };
  async ngOnInit() {
    this.loading = true;
    try {
      this.setProfile(await firstValueFrom(this.api.getProfile()));
      this.exists = true; this.ready = true;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) this.ready = true;
      else this.error = 'Unable to load your profile. Please check your session and reload.';
    } finally { this.loading = false; this.cdr.markForCheck(); }
  }
  private setProfile(data: SeekerProfileResponse) {
    this.profile = { ...this.profile, location: data.location ?? '', experienceYears: data.experience ?? '',
      education: data.education ?? '', skills: (data.skills ?? '').split(/[,;]/).map(s => s.trim()).filter(Boolean) };
    this.saved = { ...this.profile, skills: [...this.profile.skills] };
  }
  editProfile() { if (this.ready && !this.loading) { this.isEditing = true; this.message = ''; } }
  async saveProfile() {
    if (!this.ready || this.loading) return;
    this.loading = true; this.error = ''; this.message = '';
    try {
      const data = await firstValueFrom(this.api.saveProfile({ location: this.profile.location,
        experience: this.profile.experienceYears, education: this.profile.education,
        skills: this.profile.skills.join(', ') }, this.exists));
      this.setProfile(data); this.exists = true; this.isEditing = false;
      this.message = 'Profile saved.';
    } catch { this.error = 'Profile could not be saved. Your changes are still available for retry.'; }
    finally { this.loading = false; this.cdr.markForCheck(); }
  }
  cancelEdit() {
    if (this.loading) return;
    this.profile = { ...this.saved, skills: [...this.saved.skills] };
    this.isEditing = false; this.error = '';
  }
}
