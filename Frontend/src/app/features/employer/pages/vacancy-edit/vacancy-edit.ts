import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vacancy-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vacancy-edit.html',
  styleUrl: './vacancy-edit.css',
})
export class VacancyEdit implements OnInit {

  vacancyId = '';

  vacancy = {
    title: '',
    department: '',
    employmentType: '',
    description: '',
    experience: '',
    seniority: '',
    workplace: '',
    location: ''
  };

  skills: string[] = [];
  skillInput = '';

  showCloseModal = false;
  showSaveMessage = false;
  showValidationMessage = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vacancyId =
      this.route.snapshot.paramMap.get('id') ||
      this.route.snapshot.paramMap.get('vacancyId') ||
      '';
  }

  addSkill(): void {
    const skill = this.skillInput.trim();

    if (!skill) {
      return;
    }

    const alreadyExists = this.skills.some(
      existingSkill => existingSkill.toLowerCase() === skill.toLowerCase()
    );

    if (!alreadyExists) {
      this.skills.push(skill);
    }

    this.skillInput = '';
  }

  addRecommendedSkill(skill: string): void {
    const alreadyExists = this.skills.some(
      existingSkill => existingSkill.toLowerCase() === skill.toLowerCase()
    );

    if (!alreadyExists) {
      this.skills.push(skill);
    }
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  onSkillKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSkill();
    }
  }

  saveChanges(): void {
    this.showValidationMessage = false;

    if (!this.vacancy.title.trim()) {
      this.showValidationMessage = true;
      return;
    }

    /*
     * Backend/API integration will be added later.
     * For now this only provides the UI interaction.
     */

    this.showSaveMessage = true;

    setTimeout(() => {
      this.showSaveMessage = false;
    }, 3500);
  }

  cancelChanges(): void {
    this.router.navigate(['/employer/vacancy-list']);
  }

  openCloseModal(): void {
    this.showCloseModal = true;
  }

  closeCloseModal(): void {
    this.showCloseModal = false;
  }

  confirmCloseVacancy(): void {
    /*
     * Vacancy closing API will be connected later.
     */

    this.showCloseModal = false;
  }

  previewVacancy(): void {
    /*
     * Live preview route can be connected after vacancy routing is completed.
     */
  }
}