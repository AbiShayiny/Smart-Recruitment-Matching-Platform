import { Component, DestroyRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminService } from '../../../../core/services/admin.service';
import { UserModel } from '../../../../core/models/user.model';
import { UserTable } from '../../components/user-table/user-table';
import { UserAction } from '../../components/user-action/user-action';

@Component({
  selector: 'app-user-management',
  imports: [RouterLink, UserTable, UserAction],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  @ViewChild(UserAction) actions!: UserAction;
  private adminService = inject(AdminService);
  private destroyRef = inject(DestroyRef);
  users = signal<UserModel[]>([]);
  loading = signal(false);
  busy = signal(false);
  loadError = signal('');
  actionError = signal('');
  success = signal('');

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.loadError.set('');
    this.adminService.getUsers().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: users => this.users.set(
        users.filter(user => user.role !== 'Administrator')
      ),
      error: error => this.loadError.set(this.errorMessage(error, 'load'))
    });
  }

  saveUser(user: UserModel): void {
    this.changeUser(user, 'edit');
  }

  deleteUser(user: UserModel): void {
    this.changeUser(user, 'delete');
  }

  private changeUser(user: UserModel, action: 'edit' | 'delete'): void {
    if (this.busy() || this.loading()) return;
    this.busy.set(true);
    this.actionError.set('');
    this.success.set('');
    const request = action === 'edit'
      ? this.adminService.updateUser(user.id, { name: user.name, email: user.email, role: user.role })
      : this.adminService.deleteUser(user.id);
    request.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.busy.set(false))
    ).subscribe({
      next: () => {
        this.actions.close();
        this.success.set(`${user.name} was ${action === 'edit' ? 'updated' : 'deleted'} successfully.`);
        this.loadUsers();
      },
      error: error => this.actionError.set(this.errorMessage(error, action))
    });
  }

  private errorMessage(error: HttpErrorResponse, action: 'load' | 'edit' | 'delete'): string {
    switch (error.status) {
      case 401: return 'Your session has expired. Please sign in again to continue.';
      case 403: return 'You do not have permission to manage users. Please contact your administrator.';
      case 404: return action === 'load' ? 'The user service is unavailable. Please try again later.' : 'This user could not be found. Close this dialog and refresh the list.';
      case 400: return action === 'delete' ? 'This account cannot be deleted. Administrators cannot delete their own account.' : 'Please check the name, email address, and selected role and try again.';
      case 409: return action === 'edit' ? 'These details conflict with an existing account. Please use a different email address.' : 'This account cannot be deleted because it conflicts with existing records.';
      case 0: return 'Unable to connect to the user service. Check your connection and try again.';
      default: return 'The user service could not complete your request. Please try again later.';
    }
  }
}
