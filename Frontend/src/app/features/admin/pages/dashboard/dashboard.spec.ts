import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {

  totalUsers: number = 0;
  totalVacancies: number = 0;
  totalApplications: number = 0;

}