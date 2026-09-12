import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  login(): void {

    this.loginError = false;

    if (this.email === '' || this.password === '') {
      this.loginError = true;
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.isLoading = true;

    this.authService.login(loginData).subscribe({
      next: (response: any) => {

        this.authService.saveToken(response.token);

        this.isLoading = false;

        alert('Login successful');

        if (response.role === 'Administrator') {
          this.router.navigate(['/admin/dashboard']);
        }
        else if (response.role === 'Employer') {
          this.router.navigate(['/employer']);
        }
        else {
          this.router.navigate(['/seeker']);
        }
      },

      error: (error: any) => {

        this.isLoading = false;
        this.loginError = true;

        if (error.status === 401) {
          console.log('Invalid email or password');
        }
        else if (error.status === 400) {
          console.log('Invalid login details');
        }
        else {
          console.log('Something went wrong');
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