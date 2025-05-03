import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'pleroma-swap',
  imports: [],
  templateUrl: './swap.component.html',
})
export class SwapComponent implements OnInit {
  Theme = signal('corporate');

  ngOnInit(): void {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme !== null) {
      this.Theme.set(storedTheme);
    } else {
      this.Theme.set('corporate');
    }
  }

  toggleTheme() {
    const newTheme = this.Theme() === 'corporate' ? 'dark' : 'corporate';
    this.Theme.set(newTheme);
    localStorage.setItem('theme', newTheme);
  }
}
