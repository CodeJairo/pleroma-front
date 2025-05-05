import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  fb = inject(FormBuilder);
  hasFormError = signal(false);
  hasFetchError = signal(false);
  isPosting = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
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

    this.authService.login(email!, password!).subscribe((response) => {
      if (response) {
        this.router.navigateByUrl('/');
        return;
      }
      this.errorMessage.set(this.authService.errorMessage());
      this.hasFetchError.set(true);
      setTimeout(() => {
        this.hasFetchError.set(false);
      }, 5000);
    });
  }

  print(value: any) {
    console.log(value);
  }
}
