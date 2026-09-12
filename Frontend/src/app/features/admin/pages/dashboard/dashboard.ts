import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
})
export class Dashboard {

  totalUsers: number = 0;
  totalVacancies: number = 0;
  totalApplications: number = 0;

}