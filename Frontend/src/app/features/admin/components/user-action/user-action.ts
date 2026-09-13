import { Component, ElementRef, ViewChild, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-action',
  imports: [FormsModule],
  templateUrl: './user-action.html',
  styleUrl: './user-action.css',
})
export class UserAction {
  @ViewChild('dialog', { static: true }) dialog!: ElementRef<HTMLDialogElement>;
  busy = input(false);
  error = input('');
  save = output<UserModel>();
  remove = output<UserModel>();
  opened = output<void>();
  user: UserModel | null = null;
  mode: 'edit' | 'delete' = 'edit';
  name = '';
  email = '';
  role = '';
  roles = ['JobSeeker', 'Employer', 'Administrator'];

  open(user: UserModel, mode: 'edit' | 'delete'): void {
    if (this.busy()) return;
    this.user = user;
    this.mode = mode;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.opened.emit();
    this.dialog.nativeElement.showModal();
  }

  close(): void {
    this.dialog.nativeElement.close();
    this.user = null;
  }

  cancel(event?: Event): void {
    event?.preventDefault();
    if (!this.busy()) this.close();
  }

  submit(): void {
    if (this.busy() || !this.user) return;
    if (this.mode === 'delete') {
      this.remove.emit(this.user);
    } else if (this.name.trim() && this.email.trim() && this.roles.includes(this.role)) {
      this.save.emit({ id: this.user.id, name: this.name.trim(), email: this.email.trim(), role: this.role });
    }
  }
}
