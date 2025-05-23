import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Subscription } from 'rxjs';

interface NavbarUser {
  name: string;
  email: string;
  avatar: string;
}

@Component({
  selector: 'pleroma-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  #authService = inject(AuthService);
  #router = inject(Router);

  user: NavbarUser = {
    name: '',
    email: '',
    avatar: '',
  };

  #subscription?: Subscription;

  ngOnInit(): void {
    this.#subscription = this.#authService.user$.subscribe(authUser => {
      if (authUser) {
        this.user = {
          name: authUser.username,
          email: authUser.email,
          avatar: authUser.avatar || this.#generateAvatar(authUser.username),
        };
      } else {
        this.#resetUser();
      }
    });
  }

  ngOnDestroy(): void {
    this.#subscription?.unsubscribe();
  }

  logout(): void {
    this.#authService.logout().subscribe({
      next: () => {},
      error: err => console.error('Error durante logout:', err),
    });
  }

  #resetUser(): void {
    this.user = {
      name: '',
      email: '',
      avatar: '',
    };
  }

  #generateAvatar(name: string): string {
    return `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(name)}`;
  }
}
