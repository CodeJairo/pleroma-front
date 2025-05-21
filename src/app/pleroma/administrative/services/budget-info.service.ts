import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IBudgetInfoEntity } from '../interfaces/budget-info.interface';
import { Observable, tap } from 'rxjs';

const API_BASE_URL = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class BudgetInfoService {
  #http = inject(HttpClient);

  createBudgetInfo(data: IBudgetInfoEntity): Observable<void> {
    return this.#http
      .post<void>(`${API_BASE_URL}/budget/create-budget-info`, data, { withCredentials: true })
      .pipe(tap(() => console.log('Budget information created successfully')));
  }
}
