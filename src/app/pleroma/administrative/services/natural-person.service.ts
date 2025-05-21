import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { INaturalPersonEntity } from '../interfaces';

const API_BASE_URL = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class NaturalPersonService {
  #http = inject(HttpClient);

  createNaturalPerson(data: INaturalPersonEntity): Observable<void> {
    return this.#http
      .post<void>(`${API_BASE_URL}/contract/create-natural-person`, data, { withCredentials: true })
      .pipe(tap(() => console.log('Natural person created successfully')));
  }
}
