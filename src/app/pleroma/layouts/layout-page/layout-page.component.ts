import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar-principal/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SwapComponent } from '../../../shared/components/swap/swap.component';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-layout-page',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, SwapComponent],
  templateUrl: './layout-page.component.html',
})
export class LayoutPageComponent {
  authService = inject(AuthService);
}
