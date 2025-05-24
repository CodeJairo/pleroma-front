import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pleroma-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  ActualDate = signal(new Date().getFullYear());
}
