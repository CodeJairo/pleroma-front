import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-administrative-layout-page',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './administrative-layout-page.component.html',
})
export class AdministrativeLayoutPageComponent {
  constructor(public router: Router) {}

  get currentRoute(): string {
    return this.router.url.split('/').pop() || '';
  }
}
