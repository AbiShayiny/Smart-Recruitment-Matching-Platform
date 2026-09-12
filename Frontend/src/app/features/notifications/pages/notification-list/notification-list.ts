import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

type NotificationFilter = 'all' | 'unread' | 'read';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.css',
})
export class NotificationList {

  searchTerm = '';

  activeFilter: NotificationFilter = 'all';

  unreadCount = 0;

  notifications: unknown[] = [];

  constructor(private router: Router) {}

  setFilter(filter: NotificationFilter): void {
    this.activeFilter = filter;
  }

  onSearch(): void {
    // Search will be connected with backend later
  }

  markAsRead(notificationId?: string): void {
    if (!notificationId) {
      return;
    }
  }

  markAllAsRead(): void {
    // Backend integration will be added later
  }

  deleteNotification(notificationId?: string): void {
    if (!notificationId) {
      return;
    }
  }

  openNotification(notificationId?: string): void {
    if (!notificationId) {
      return;
    }
  }

  goBack(): void {
    this.router.navigate(['/employer/dashboard']);
  }

  getFilterLabel(filter: NotificationFilter): string {
    switch (filter) {
      case 'unread':
        return 'Unread';

      case 'read':
        return 'Read';

      default:
        return 'All Notifications';
    }
  }
}