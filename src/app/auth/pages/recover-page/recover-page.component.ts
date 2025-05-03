import { Component, HostListener, signal } from '@angular/core';
import { FooterComponent } from '../../../pleroma/components/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recover-page',
  imports: [FooterComponent, RouterLink],
  templateUrl: './recover-page.component.html',
})
export class RecoverPageComponent {
  isScrolled = signal(false);

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 0);
  }
}
