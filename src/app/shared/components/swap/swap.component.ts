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
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (storedTheme) return this.Theme.set(storedTheme);

    if (prefersDark) {
      this.Theme.set('dark');
      localStorage.setItem('theme', 'dark');
      return;
    }

    this.Theme.set('corporate');
    localStorage.setItem('theme', 'corporate');
  }

  toggleTheme() {
    const newTheme = this.Theme() === 'corporate' ? 'dark' : 'corporate';
    this.Theme.set(newTheme);
    localStorage.setItem('theme', newTheme);
  }
}
