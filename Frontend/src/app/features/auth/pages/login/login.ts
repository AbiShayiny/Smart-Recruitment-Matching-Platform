import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email: string = '';
  password: string = '';

  showPassword: boolean = false;
  isLoading: boolean = false;
  loginError: boolean = false;
  loginErrorMessage = 'Invalid credentials. Please verify your business email address and security token.';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  login(form: NgForm): void {

    if (this.isLoading) return;
    this.loginError = false;

    if (form.invalid || this.email.trim() === '' || this.password === '') {
      form.control.markAllAsTouched();
      this.loginErrorMessage = 'Please enter a valid email address and password.';
      this.loginError = true;
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.isLoading = true;

    this.authService.login(loginData).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {

        if (typeof response?.token !== 'string' || !this.authService.getRole(response.token) ||
            this.authService.getRole(response.token) !== response.role) {
          this.authService.logout();
          this.loginError = true;
          this.loginErrorMessage = 'Unable to verify your session. Please sign in again.';
          return;
        }

        this.authService.saveToken(response.token);

        this.isLoading = false;

        alert('Login successful');

        if (response.role === 'Administrator') {
          this.router.navigate(['/admin/dashboard']);
        }
        else if (response.role === 'Employer') {
          this.router.navigate(['/employer']);
        }
        else if (response.role === 'JobSeeker') {
          this.router.navigate(['/seeker']);
        }
      },

      error: (error: HttpErrorResponse) => {

        this.isLoading = false;
        this.loginError = true;

        if (error.status === 401) {
          this.loginErrorMessage = 'Invalid credentials. Please verify your business email address and security token.';
        }
        else if (error.status === 400) {
          this.loginErrorMessage = 'Please enter a valid email address and password.';
        }
        else if (error.status === 0) {
          this.loginErrorMessage = 'Unable to connect. Please check your connection and try again.';
        }
        else {
          this.loginErrorMessage = 'Unable to sign in right now. Please try again later.';
        }
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  closeError(): void {
    this.loginError = false;
  }
}
