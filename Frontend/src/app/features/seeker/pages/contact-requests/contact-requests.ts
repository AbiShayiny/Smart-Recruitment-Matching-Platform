import { ContactRequestService, SeekerContactRequest } from '../../../../core/services/contact-request.service';
import { firstValueFrom } from 'rxjs';
import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-contact-requests',
  standalone: true,
  imports: [
    Navbar
  ],
  templateUrl: './contact-requests.html',
  styleUrl: './contact-requests.css'
})
export class ContactRequests {
  private api = inject(ContactRequestService);
  private cdr = inject(ChangeDetectorRef);
  contactRequests: SeekerContactRequest[] = [];
  loading = false;
  error = '';
  pending = new Set<number>();
  async ngOnInit() {
    this.loading = true;
    try { this.contactRequests = ((await firstValueFrom(this.api.getReceived())) ?? []).filter(item => item.status === 'Pending'); }
    catch { this.error = 'Unable to load contact requests. Check your connection and profile.'; }
    finally { this.loading = false; this.cdr.markForCheck(); }
  }
  acceptRequest(id: number) { return this.respond(id, true); }
  declineRequest(id: number) { return this.respond(id, false); }
  private async respond(id: number, accept: boolean) {
    if (this.pending.has(id)) return;
    this.pending.add(id); this.error = '';
    try {
      await firstValueFrom(accept ? this.api.accept(id) : this.api.decline(id));
      this.contactRequests = this.contactRequests.filter(item => item.id !== id);
    } catch { this.error = 'Unable to update this request. It may have already been answered. Reload to check its status.'; }
    finally { this.pending.delete(id); this.cdr.markForCheck(); }
  }
}
