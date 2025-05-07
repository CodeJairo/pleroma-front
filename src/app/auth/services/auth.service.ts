import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../interfaces/login-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';
const apiBaseUrl = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor() {}

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkAuthStatus(),
  });

  #authStatus = signal<AuthStatus>('checking');
  #user = signal<any>(null);
  #errorMessage = signal<string | null>(null);

  authStatus = computed(() => {
    if (this.#authStatus() === 'checking') return 'checking';
    if (this.#user()) return 'authenticated';
    return 'unauthenticated';
  });

  user = computed(() => this.#user());
  errorMessage = computed(() => this.#errorMessage());

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(
        `${apiBaseUrl}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // Include credentials in the request
        }
      )
      .pipe(
        tap((response) => {
          this.#authStatus.set('authenticated');
          this.#user.set(response.username);
        }),
        map(() => true),
        catchError((error) => {
          this.#user.set(null);
          this.#authStatus.set('unauthenticated');
          this.#errorMessage.set(error.error.message);
          console.log(error.error.message);
          return of(false);
        })
      );
  }

  logout(): any {
    return this.http.post(
      `${apiBaseUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http
      .get<LoginResponse>(`${apiBaseUrl}/auth/check-session`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.#authStatus.set('authenticated');
          this.#user.set(response.username);
        }),
        map(() => true),
        catchError((error) => {
          this.#user.set(null);
          this.#authStatus.set('unauthenticated');
          return of(false);
        })
      );
  }
}
