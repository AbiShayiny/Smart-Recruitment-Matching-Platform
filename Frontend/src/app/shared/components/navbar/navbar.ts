import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  unreadNotifications = 0;
  contactRequestCount = 0;

  userName = 'Dakshana';
  userRole = 'Job Seeker';

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
