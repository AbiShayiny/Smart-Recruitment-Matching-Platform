import { Component } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    Navbar
  ],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.css'
})
export class NotificationList {

  // Backend connect ஆன பிறகு
  // database/API-ல இருந்து notifications வரும்.
  notifications: any[] = [];


  markAsRead(notificationId: number): void {

    const notification = this.notifications.find(
      item => item.id === notificationId
    );

    if (notification) {
      notification.isRead = true;
    }

  }


  markAllAsRead(): void {

    this.notifications.forEach(
      notification => {
        notification.isRead = true;
      }
    );

  }

}