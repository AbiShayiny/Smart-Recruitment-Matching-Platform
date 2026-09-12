import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vacancy-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './vacancy-create.html',
  styleUrl: './vacancy-create.css'
})
export class VacancyCreate {

  jobTitle = '';
  department = '';
  employmentType = 'Full-time';

  jobDescription = '';

  experienceLevel = '';
  seniority = '';

  workplaceModel = 'Hybrid';

  primaryLocation = '';
  allowedJurisdictions = '';

  skillInput = '';
  requiredSkills: string[] = [];

  isSaving = false;

  constructor(
    private router: Router
  ) {}


  addSkill(): void {

    const skill = this.skillInput.trim();

    if (!skill) {
      return;
    }

    const alreadyExists = this.requiredSkills.some(
      existingSkill =>
        existingSkill.toLowerCase() === skill.toLowerCase()
    );

    if (!alreadyExists) {
      this.requiredSkills.push(skill);
    }

    this.skillInput = '';
  }


  removeSkill(index: number): void {

    this.requiredSkills.splice(index, 1);
  }


  addSuggestedSkill(skill: string): void {

    const alreadyExists = this.requiredSkills.some(
      existingSkill =>
        existingSkill.toLowerCase() === skill.toLowerCase()
    );

    if (!alreadyExists) {
      this.requiredSkills.push(skill);
    }
  }


  onSkillKeydown(event: KeyboardEvent): void {

    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSkill();
    }
  }


  get descriptionLength(): number {

    return this.jobDescription.length;
  }


  get isReady(): boolean {

    return !!this.jobTitle.trim() &&
      !!this.jobDescription.trim() &&
      this.requiredSkills.length >= 1 &&
      !!this.experienceLevel &&
      !!this.primaryLocation.trim();
  }


  get readinessPercentage(): number {

    let completed = 0;

    if (this.jobTitle.trim()) {
      completed++;
    }

    if (this.jobDescription.trim()) {
      completed++;
    }

    if (this.requiredSkills.length > 0) {
      completed++;
    }

    if (this.experienceLevel) {
      completed++;
    }

    if (this.primaryLocation.trim()) {
      completed++;
    }

    return Math.round((completed / 5) * 100);
  }


  saveDraft(): void {

    this.isSaving = true;

    /*
     * API integration later.
     * No mock data is used here.
     */

    setTimeout(() => {
      this.isSaving = false;
    }, 500);
  }


  postVacancy(): void {

    if (!this.isReady) {
      return;
    }

    this.isSaving = true;

    /*
     * Backend API integration will be added later.
     * The form currently only handles the UI state.
     */

    setTimeout(() => {
      this.isSaving = false;

      this.router.navigate([
        '/employer/vacancy-list'
      ]);
    }, 500);
  }


  cancel(): void {

    this.router.navigate([
      '/employer/vacancy-list'
    ]);
  }


  preview(): void {

    /*
     * Preview functionality can be connected later.
     */
  }
}