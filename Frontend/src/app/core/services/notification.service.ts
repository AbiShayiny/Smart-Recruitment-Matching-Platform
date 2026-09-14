import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export type SeekerNotification = {
  id: number; applicationId: number; message: string; isRead: boolean; createdAt: string;
};
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly apiUrl = 'https://localhost:7182/api/notification';
  constructor(private http: HttpClient) {}
  getMyNotifications() { return this.http.get<SeekerNotification[]>(`${this.apiUrl}/my`); }
  markAsRead(id: number) { return this.http.put<SeekerNotification>(`${this.apiUrl}/${id}/read`, {}); }
}
