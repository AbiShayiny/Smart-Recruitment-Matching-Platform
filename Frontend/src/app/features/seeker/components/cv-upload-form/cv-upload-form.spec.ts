import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvUploadForm } from './cv-upload-form';

describe('CvUploadForm', () => {
  let component: CvUploadForm;
  let fixture: ComponentFixture<CvUploadForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvUploadForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CvUploadForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
