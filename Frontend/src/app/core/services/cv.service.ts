import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defer } from 'rxjs';
import { SeekerProfileService } from './seeker-profile.service';
@Injectable({ providedIn: 'root' })
export class CvService {
  constructor(private http: HttpClient, private profile: SeekerProfileService) {}
  upload(file: File) {
    return defer(() => {
      const data = new FormData();
      data.append('CvFile', file, file.name);
      return this.http.post<{ originalFileName: string; contentType: string; fileSize: number; uploadedAt: string }>(
        `https://localhost:7182/api/JobSeeker/${this.profile.getUserId()}/cv`, data);
    });
  }
}
