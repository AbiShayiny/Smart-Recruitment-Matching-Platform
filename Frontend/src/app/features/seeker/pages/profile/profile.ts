import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    Navbar,
    FormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  isEditing = false;

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    professionalTitle: '',
    summary: '',
    experienceYears: '',
    education: '',
    skills: [] as string[]
  };

  editProfile(): void {
    this.isEditing = true;
  }

  saveProfile(): void {
    this.isEditing = false;

    // Backend connect பண்ணிய பிறகு
    // profile update API call இங்கே வரும்.
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

}