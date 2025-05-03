import { Component, HostListener, signal } from '@angular/core';
import { SwapComponent } from '../../../shared/components/swap/swap.component';
import { FooterComponent } from '../../../pleroma/components/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  imports: [SwapComponent, FooterComponent, RouterOutlet],
  templateUrl: './auth-layout-page.component.html',
})
export class AuthLayoutPageComponent {
  isScrolled = signal(false);

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 0);
  }
}
