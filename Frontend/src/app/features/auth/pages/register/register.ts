import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerForm: FormGroup;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {

    this.registerForm = this.fb.group(
      {
        name: [
          '',
          Validators.required
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        role: [
          'JobSeeker',
          Validators.required
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ],

        confirmPassword: [
          '',
          Validators.required
        ],

        terms: [
          false,
          Validators.requiredTrue
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  passwordMatchValidator(
    form: AbstractControl
  ): ValidationErrors | null {

    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return {
        passwordMismatch: true
      };
    }

    return null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register(): void {

    if (this.isLoading) return;
    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }

    const role = this.registerForm.value.role;
    if (role !== 'JobSeeker' && role !== 'Employer') {
      alert('Please select Job Seeker or Employer.');
      return;
    }

    const registerData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role
    };

    this.isLoading = true;
    this.authService.register(registerData).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({

      next: () => {

        alert('Registration successful');

        this.registerForm.reset({
          role: 'JobSeeker',
          terms: false
        });

      },

      error: (error: HttpErrorResponse) => {

        if (error.status === 409) {

          alert('Email already exists');

        }
        else if (error.status === 400) {

          alert('Please enter valid registration details');

        }
        else if (error.status === 0) {
          alert('Unable to connect. Please check your connection and try again.');
        }
        else {

          alert('Unable to register right now. Please try again later.');

        }

      }

    });
  }
}
