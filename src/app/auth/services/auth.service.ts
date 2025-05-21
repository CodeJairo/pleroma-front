import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCredentials, LoginResponse, User, UserWithToken } from '@auth/interfaces';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, EMPTY, Observable, catchError, debounceTime, fromEvent, ignoreElements, map, merge, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_BASE_URL = environment.apiBaseUrl;
const USER_COOKIE_KEY = environment.userCookieKey;

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Inyección de dependencias
  #http = inject(HttpClient);
  #router = inject(Router);
  #cookieService = inject(CookieService);

  // Estado del usuario y observables
  #user = new BehaviorSubject<UserWithToken | null>(null);
  user$ = this.#user.asObservable();
  isLoggedIn$: Observable<boolean> = this.#user.pipe(map(Boolean));

  // Control de expiración y temporizadores
  #tokenExpirationDate?: Date;
  #refreshTimeoutId?: any;
  #inactivityTimeoutId?: any;

  // Configuraciones de tiempo en ms
  #inactivityPeriodMs = 1000 * 60 * 3; // 3 minutos de inactividad
  #refreshBeforeMs = 1000 * 60 * 2; // 2 minutos antes de la expiración

  // Estado para mostrar advertencia modal de inactividad
  #showInactivityAlert = signal(false);
  #inactivityMessage = signal('Tu sesión expirará pronto por inactividad.');

  get showInactivityAlert() {
    return this.#showInactivityAlert();
  }
  get inactivityMessage() {
    return this.#inactivityMessage();
  }

  constructor() {
    this.#loadUserFromCookies();
    this.#setupUserActivityListener();
  }

  // --------- Métodos Públicos ---------

  login(credentials: LoginCredentials): Observable<never> {
    return this.#http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials, { withCredentials: true }).pipe(
      tap(resp => this.#pushNewUser(resp.clientToken)),
      tap(() => this.#redirectTo('pleroma')),
      ignoreElements()
    );
  }

  logout(): Observable<never> {
    return this.#http.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.#closeSession()),
      catchError(() => {
        this.#closeSession();
        return EMPTY;
      }),
      ignoreElements()
    );
  }

  refreshToken(): Observable<never> {
    return this.#http.post<LoginResponse>(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true }).pipe(
      tap(resp => this.#pushNewUser(resp.clientToken)),
      ignoreElements(),
      catchError(() => {
        this.#closeSession();
        return EMPTY;
      })
    );
  }

  continueSession() {
    this.#showInactivityAlert.set(false);
    this.#resetInactivityTimer();
  }

  // --------- Métodos Privados ---------

  // Escucha eventos de usuario para controlar inactividad
  #setupUserActivityListener() {
    const userActivity$ = merge(
      fromEvent(document, 'click'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'scroll')
    ).pipe(debounceTime(1000));

    userActivity$.subscribe(() => {
      const token = this.#cookieService.get(USER_COOKIE_KEY);
      if (!token) {
        this.#closeSession();
      } else {
        this.#resetInactivityTimer();
      }
    });

    // Inicia temporizador si hay token activo al cargar
    if (this.#cookieService.get(USER_COOKIE_KEY)) {
      this.#resetInactivityTimer();
    }
  }

  // Actualiza estado de usuario y programa refrescos y temporizadores
  #pushNewUser(token: string) {
    this.#user.next(this.#decodeToken(token));
    this.#tokenExpirationDate = this.#getTokenExpirationDate(token);
    this.#scheduleRefreshToken();
  }

  // Decodifica token JWT a UserWithToken
  #decodeToken(token: string): UserWithToken {
    const user = jwtDecode<User>(token);
    return { ...user, token };
  }

  // Extrae fecha de expiración del JWT
  #getTokenExpirationDate(token: string): Date | undefined {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      if (decoded.exp) return new Date(decoded.exp * 1000);
    } catch {
      return undefined;
    }
    return undefined;
  }

  // Programa refresco automático del token
  #scheduleRefreshToken() {
    if (this.#refreshTimeoutId) clearTimeout(this.#refreshTimeoutId);
    if (!this.#tokenExpirationDate) return;

    const now = new Date();
    const msUntilExpiration = this.#tokenExpirationDate.getTime() - now.getTime();

    if (msUntilExpiration > this.#refreshBeforeMs) {
      this.#refreshTimeoutId = setTimeout(() => {
        this.refreshToken().subscribe({
          error: () => this.#closeSession(),
        });
      }, msUntilExpiration - this.#refreshBeforeMs);
    } else {
      this.refreshToken().subscribe({
        error: () => this.#closeSession(),
      });
    }
  }

  // Reinicia temporizador de inactividad y muestra advertencia al expirar
  #resetInactivityTimer() {
    if (this.#inactivityTimeoutId) clearTimeout(this.#inactivityTimeoutId);

    this.#inactivityTimeoutId = setTimeout(() => {
      this.#showInactivityWarning();
    }, this.#inactivityPeriodMs);
  }

  // Carga token desde cookies y actualiza estado o cierra sesión si no hay token
  #loadUserFromCookies() {
    const user = this.#cookieService.get(USER_COOKIE_KEY);
    if (user) return this.#pushNewUser(user);
    this.#closeSession();
  }

  // Cierra sesión limpiando estado y redireccionando
  #closeSession() {
    this.#cookieService.delete(USER_COOKIE_KEY);
    if (this.#refreshTimeoutId) clearTimeout(this.#refreshTimeoutId);
    if (this.#inactivityTimeoutId) clearTimeout(this.#inactivityTimeoutId);
    this.#user.next(null);
    this.#redirectTo('auth/login');
  }

  // Redirecciona a ruta especificada
  #redirectTo(urlPath: string) {
    this.#router.navigateByUrl(`/${urlPath}`);
  }

  // Muestra alerta modal para advertir inactividad y cerrar sesión si no responde
  #showInactivityWarning() {
    this.#inactivityMessage.set('Tu sesión expirará pronto por inactividad.');
    this.#showInactivityAlert.set(true);

    setTimeout(() => {
      if (this.#showInactivityAlert()) {
        this.logout().subscribe();
        this.#showInactivityAlert.set(false);
      }
    }, 1000 * 60 * 2); // 2 minutos de espera
  }
}
