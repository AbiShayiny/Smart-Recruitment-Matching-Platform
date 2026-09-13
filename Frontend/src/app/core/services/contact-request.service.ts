import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export type SeekerContactRequest = {
  id: number; applicationId: number; jobTitle: string; message: string;
  status: string; createdAt: string; updatedAt: string;
};
@Injectable({ providedIn: 'root' })
export class ContactRequestService {
  private readonly apiUrl = 'https://localhost:7182/api/contact-request';
  constructor(private http: HttpClient) {}
  getReceived() { return this.http.get<SeekerContactRequest[]>(`${this.apiUrl}/received`); }
  accept(id: number) { return this.http.put<SeekerContactRequest>(`${this.apiUrl}/${id}/accept`, {}); }
  decline(id: number) { return this.http.put<SeekerContactRequest>(`${this.apiUrl}/${id}/decline`, {}); }
}
