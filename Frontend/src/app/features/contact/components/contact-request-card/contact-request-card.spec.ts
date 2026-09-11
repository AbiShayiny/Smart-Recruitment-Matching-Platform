import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRequestCard } from './contact-request-card';

describe('ContactRequestCard', () => {
  let component: ContactRequestCard;
  let fixture: ComponentFixture<ContactRequestCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactRequestCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactRequestCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
