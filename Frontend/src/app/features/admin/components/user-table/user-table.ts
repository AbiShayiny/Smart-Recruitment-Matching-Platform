import { Component, input, output } from '@angular/core';
import { UserModel } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-table',
  imports: [],
  templateUrl: './user-table.html',
  styleUrl: './user-table.css',
})
export class UserTable {
  users = input<UserModel[]>([]);
  loading = input(false);
  disabled = input(false);
  error = input('');
  edit = output<UserModel>();
  delete = output<UserModel>();
}
