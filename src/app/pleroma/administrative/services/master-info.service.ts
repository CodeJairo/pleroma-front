import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IContractor } from '../interfaces/contractors.interface';

const API_BASE_URL = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class MasterInfoService {
  #http = inject(HttpClient);

  getAllContractors(): Observable<IContractor[]> {
    return this.#http
      .get<IContractor[]>(`${API_BASE_URL}/contract/get-all-contractors`, { withCredentials: true })
      .pipe(tap(() => console.log('Contractors fetched successfully')));
  }
}
