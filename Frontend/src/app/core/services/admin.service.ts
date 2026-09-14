import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../models/api-response.model';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<ApiResponseModel> {
    return this.http.get<ApiResponseModel>('https://localhost:7182/api/Admin/dashboard');
  }

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>('https://localhost:7182/api/Admin/users');
  }

  updateUser(id: number, user: Pick<UserModel, 'name' | 'email' | 'role'>): Observable<string> {
    return this.http.put(`https://localhost:7182/api/Admin/users/${id}`, user, { responseType: 'text' });
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete(`https://localhost:7182/api/Admin/users/${id}`, { responseType: 'text' });
  }
}
