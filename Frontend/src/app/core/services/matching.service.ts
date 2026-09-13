import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defer } from 'rxjs';
import { SeekerProfileService } from './seeker-profile.service';
export type SeekerMatch = { matchScore: number; matchedSkills: string[]; missingSkills: string[] };
@Injectable({ providedIn: 'root' })
export class MatchingService {
  constructor(private http: HttpClient, private profile: SeekerProfileService) {}
  getMatch(vacancyId: number) {
    return defer(() => this.http.get<SeekerMatch>(
      `https://localhost:7182/api/matching/${this.profile.getUserId()}/${vacancyId}`));
  }
}
