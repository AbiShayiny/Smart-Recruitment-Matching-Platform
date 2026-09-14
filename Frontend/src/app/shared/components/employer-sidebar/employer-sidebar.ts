import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employer-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './employer-sidebar.html'
})
export class EmployerSidebar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
