import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '@auth/interfaces';
import { catchError, EMPTY, finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  #authService = inject(AuthService);
  // #router = inject(Router);

  fb = inject(FormBuilder);
  hasFormError = signal(false);
  hasFetchError = signal(false);
  isPosting = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['admin@admin.com', [Validators.required, Validators.email]],
    password: ['kK4Sf1d3$m|3vT>/2Q>W', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.errorMessage.set('Verifique todos los campos');
      this.hasFormError.set(true);
      setTimeout(() => {
        this.hasFormError.set(false);
      }, 3500);
      return;
    }

    const { email, password } = this.loginForm.value;
    this.isPosting.set(true);

    this.#authService
      .login({ email, password } as LoginCredentials)
      .pipe(
        finalize(() => this.isPosting.set(false)),
        catchError(error => this.#handleError(error))
      )
      .subscribe();
  }

  #handleError(error: HttpErrorResponse) {
    console.error(error);
    this.errorMessage.set(error.error.message);
    this.hasFetchError.set(true);
    setTimeout(() => {
      this.hasFetchError.set(false);
    }, 3500);
    return EMPTY;
  }
}
