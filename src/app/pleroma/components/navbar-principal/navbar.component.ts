import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'pleroma-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        window.location.reload(); // Recarga la página para reflejar el cambio de estado
      },
      error: (err: unknown) => {
        console.error('Error during logout:', err);
      },
    });
  }
}
