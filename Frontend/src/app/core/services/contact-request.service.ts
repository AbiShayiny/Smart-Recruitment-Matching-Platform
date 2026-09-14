import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactRequestModel, CreateContactRequestDto } from '../models/contact-request.model';

export type SeekerContactRequest = {
  id: number;
  applicationId: number;
  jobTitle: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

@Injectable({
  providedIn: 'root'
})
export class ContactRequestService {
  private readonly apiUrl = 'https://localhost:7182/api/contact-request';

  constructor(private http: HttpClient) {}

  getReceived(): Observable<SeekerContactRequest[]> {
    return this.http.get<SeekerContactRequest[]>(`${this.apiUrl}/received`);
  }

  accept(id: number): Observable<SeekerContactRequest> {
    return this.http.put<SeekerContactRequest>(`${this.apiUrl}/${id}/accept`, {});
  }

  decline(id: number): Observable<SeekerContactRequest> {
    return this.http.put<SeekerContactRequest>(`${this.apiUrl}/${id}/decline`, {});
  }

  sendContactRequest(dto: CreateContactRequestDto): Observable<ContactRequestModel | null> {
    return this.http.post<ContactRequestModel | null>(this.apiUrl, dto);
  }
}
