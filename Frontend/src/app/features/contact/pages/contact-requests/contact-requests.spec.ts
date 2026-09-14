import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ContactRequests } from './contact-requests';

describe('ContactRequests submission guards', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactRequests],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('keeps Send Request disabled without a real application and explains why', () => {
    const fixture = TestBed.createComponent(ContactRequests);
    const component = fixture.componentInstance;
    component.openContactModal();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.modal-footer .primary-button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(component.selectedCandidate.applicationId).toBeNull();
    expect(component.contactValidationMessage).toContain('real candidate/application');
    component.sendContactRequest();
    expect(component.contactModalOpen).toBe(true);
    expect(component.successMessage).toBe('');
    TestBed.inject(HttpTestingController).expectNone(() => true);
  });

  it('blocks duplicate submission and modal changes while sending', () => {
    const component = TestBed.createComponent(ContactRequests).componentInstance;
    component.openContactModal();
    component.isSubmitting = true;
    component.sendContactRequest();
    component.closeContactModal();
    expect(component.canSendContactRequest).toBe(false);
    expect(component.contactModalOpen).toBe(true);
    expect(component.successMessage).toBe('');
    TestBed.inject(HttpTestingController).expectNone(() => true);
  });

  it('clears the form and errors when closed', () => {
    const component = TestBed.createComponent(ContactRequests).componentInstance;
    component.openContactModal();
    component.sendContactRequest();
    component.closeContactModal();
    expect(component.contactModalOpen).toBe(false);
    expect(component.contactMessage).toBe('');
    expect(component.submitError).toBe('');
    expect(component.selectedCandidate.applicationId).toBeNull();
    expect(component.selectedCandidate.email).toBe('');
  });
});
