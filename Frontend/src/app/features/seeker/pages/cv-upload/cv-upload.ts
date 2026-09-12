import { Component } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-cv-upload',
  standalone: true,
  imports: [
    Navbar
  ],
  templateUrl: './cv-upload.html',
  styleUrl: './cv-upload.css'
})
export class CvUpload {

  selectedFile: File | null = null;

  cv = {
    fileName: '',
    uploadedDate: '',
    fileSize: '',
    status: ''
  };


  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {
      this.selectedFile = input.files[0];
    }

  }


  uploadCv(): void {

    if (!this.selectedFile) {
      return;
    }

    // Backend connect பண்ணிய பிறகு
    // CV upload API call இங்கே வரும்.

    console.log(
      'Selected CV:',
      this.selectedFile
    );

  }

}