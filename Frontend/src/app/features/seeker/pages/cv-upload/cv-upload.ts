import { CvService } from '../../../../core/services/cv.service';
import { firstValueFrom } from 'rxjs';
import { Component, ChangeDetectorRef, inject } from '@angular/core';
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
  private api = inject(CvService);
  private cdr = inject(ChangeDetectorRef);
  selectedFile: File | null = null;
  loading = false;
  error = '';
  message = '';
  cv = { fileName: '', uploadedDate: '', fileSize: '', status: '' };
  onFileSelected(event: Event): void {
    if (this.loading) return;
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.error = ''; this.message = '';
    if (this.selectedFile && (!/\.(pdf|doc|docx)$/i.test(this.selectedFile.name) || !this.selectedFile.size)) {
      this.error = 'Choose a non-empty PDF, DOC or DOCX file.';
      this.selectedFile = null; input.value = '';
    }
  }
  async uploadCv() {
    if (!this.selectedFile || this.loading) return;
    this.loading = true; this.error = ''; this.message = '';
    try {
      const result = await firstValueFrom(this.api.upload(this.selectedFile));
      this.cv = { fileName: result.originalFileName, uploadedDate: result.uploadedAt,
        fileSize: `${result.fileSize} bytes`, status: '' };
      this.message = 'CV uploaded successfully.';
    } catch { this.error = 'CV upload failed. Check your session and try again.'; }
    finally { this.loading = false; this.cdr.markForCheck(); }
  }
}
