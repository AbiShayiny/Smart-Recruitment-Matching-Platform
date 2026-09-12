import { Component } from '@angular/core';
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

  // Backend connect ஆன பிறகு
  // database/API-ல இருந்து requests வரும்.
  contactRequests: any[] = [];


  acceptRequest(requestId: number): void {

    console.log(
      'Accept Contact Request:',
      requestId
    );

  }


  declineRequest(requestId: number): void {

    console.log(
      'Decline Contact Request:',
      requestId
    );

  }

}