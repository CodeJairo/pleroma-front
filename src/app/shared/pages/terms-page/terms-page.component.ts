import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-page',
  imports: [RouterLink],
  templateUrl: './terms-page.component.html',
})
export class TermsPageComponent {
  actualDate = '23 de mayo de 2025';
}
