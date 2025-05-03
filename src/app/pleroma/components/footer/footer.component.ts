import { Component, signal } from '@angular/core';

@Component({
  selector: 'pleroma-footer',
  imports: [],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  ActualDate = signal(new Date().getFullYear());
}
