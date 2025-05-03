import { Component } from '@angular/core';
import { BankDetailsFormComponent } from '../bank-details-form/bank-details-form.component';
import { ContactDetailsFormComponent } from '../contact-details-form/contact-details-form.component';
import { PersonalDataFormComponent } from '../personal-data-form/personal-data-form.component';

@Component({
  selector: 'natural-person',
  imports: [
    PersonalDataFormComponent,
    ContactDetailsFormComponent,
    BankDetailsFormComponent,
  ],
  templateUrl: './natural-person.component.html',
})
export class NaturalPersonComponent {}
