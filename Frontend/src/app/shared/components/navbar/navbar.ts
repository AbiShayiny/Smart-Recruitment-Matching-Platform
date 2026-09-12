import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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

  unreadNotifications = 0;
  contactRequestCount = 0;

  userName = 'Dakshana';
  userRole = 'Job Seeker';

  logout(): void {
    console.log('Logout clicked');
  }
}