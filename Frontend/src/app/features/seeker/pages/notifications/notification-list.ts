import { NotificationService, SeekerNotification } from '../../../../core/services/notification.service';
import { firstValueFrom } from 'rxjs';
﻿import { Component, ChangeDetectorRef, inject } from '@angular/core';
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
  private api = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);
  notifications: SeekerNotification[] = [];
  loading = false;
  error = '';
  pending = new Set<number>();
  markingAll = false;
  async ngOnInit() {
    this.loading = true;
    try { this.notifications = (await firstValueFrom(this.api.getMyNotifications())) ?? []; }
    catch { this.error = 'Unable to load notifications. Please try again later.'; }
    finally { this.loading = false; this.cdr.markForCheck(); }
  }
  async markAsRead(id: number) {
    if (this.pending.has(id) || !this.notifications.some(item => item.id === id && !item.isRead)) return;
    this.pending.add(id);
    if (!this.markingAll) this.error = '';
    try {
      const updated = await firstValueFrom(this.api.markAsRead(id));
      this.notifications = this.notifications.map(item => item.id === id ? updated : item);
    } catch { this.error = 'Some notifications could not be marked as read. Please retry.'; }
    finally { this.pending.delete(id); this.cdr.markForCheck(); }
  }
  async markAllAsRead() {
    if (this.markingAll || this.pending.size) return;
    this.markingAll = true; this.error = '';
    try {
      // Only single-item updates are supported; retain partial successes on failure.
      for (const item of this.notifications.filter(item => !item.isRead)) await this.markAsRead(item.id);
    } finally { this.markingAll = false; this.cdr.markForCheck(); }
  }
}
