import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMessageForm } from './contact-message-form';

describe('ContactMessageForm', () => {
  let component: ContactMessageForm;
  let fixture: ComponentFixture<ContactMessageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactMessageForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactMessageForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
