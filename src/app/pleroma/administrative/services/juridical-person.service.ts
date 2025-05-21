import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IJuridicalPersonEntity } from '../interfaces/juridical-person.interface';

const API_BASE_URL = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class JuridicalPersonService {
  constructor() {}

  #http = inject(HttpClient);

  createJuridicalPerson(data: IJuridicalPersonEntity): Observable<void> {
    return this.#http
      .post<void>(`${API_BASE_URL}/contract/create-juridical-person`, data, { withCredentials: true })
      .pipe(tap(() => console.log('Natural person created successfully')));
  }
}
