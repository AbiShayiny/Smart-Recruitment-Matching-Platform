import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactRequestModel, CreateContactRequestDto } from '../models/contact-request.model';

@Injectable({
  providedIn: 'root',
})
export class ContactRequestService {
  private readonly apiUrl = 'https://localhost:7182/api/contact-request';

  constructor(private http: HttpClient) {}

  sendContactRequest(dto: CreateContactRequestDto): Observable<ContactRequestModel | null> {
    return this.http.post<ContactRequestModel | null>(this.apiUrl, dto);
  }
}
