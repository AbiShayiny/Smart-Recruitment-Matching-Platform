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
  exists = false;
  ready = false;
  skillInput = '';
  profile = { firstName: '', lastName: '', email: '', phone: '', location: '',
    professionalTitle: '', summary: '', experienceYears: '', education: '', skills: [] as string[] };
  private saved = { ...this.profile, skills: [...this.profile.skills] };
  async ngOnInit() {
    this.loading = true;
    try {
      this.setProfile(await firstValueFrom(this.api.getProfile()));
      this.exists = true; this.ready = true;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) { this.ready = true; this.isEditing = true; }
      else this.error = 'Unable to load your profile. Please check your session and reload.';
    } finally { this.loading = false; this.cdr.markForCheck(); }
  }
  private setProfile(data: SeekerProfileResponse) {
    this.profile = { ...this.profile, firstName: data.firstName ?? '', lastName: data.lastName ?? '',
      email: data.email ?? '', phone: data.phoneNumber ?? '', location: data.location ?? '',
      professionalTitle: data.professionalTitle ?? '', summary: data.professionalSummary ?? '',
      experienceYears: data.experience ?? '', education: data.education ?? '',
      skills: (data.skills ?? '').split(/[,;]/).map(s => s.trim()).filter(Boolean) };
    this.saved = { ...this.profile, skills: [...this.profile.skills] };
    this.skillInput = '';
  }
  addSkill(): void {
    const skill = this.skillInput.trim();
    if (!skill || this.profile.skills.some(existing => existing.toLowerCase() === skill.toLowerCase())) return;
    this.profile.skills.push(skill);
    this.skillInput = '';
  }
  addSkillOnEnter(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    this.addSkill();
  }
  removeSkill(index: number): void {
    this.profile.skills.splice(index, 1);
  }
  editProfile() { if (this.ready && !this.loading) { this.isEditing = true; this.message = ''; } }
  async saveProfile() {
    if (!this.ready || this.loading) return;
    this.loading = true; this.error = ''; this.message = '';
    try {
      const data = await firstValueFrom(this.api.saveProfile({ firstName: this.profile.firstName,
        lastName: this.profile.lastName, email: this.profile.email, phoneNumber: this.profile.phone,
        professionalTitle: this.profile.professionalTitle, professionalSummary: this.profile.summary,
        location: this.profile.location,
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
    this.skillInput = '';
    this.isEditing = false; this.error = '';
  }
}
