import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IContractors } from '../interfaces/contractors.interface';
import { environment } from 'src/environments/environment';

const API_BASE_URL = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class MasterInfoService {
  #http = inject(HttpClient);

  getAllContractors(): Observable<IContractors[]> {
    return this.#http
      .get<IContractors[]>(`${API_BASE_URL}/contract/get-all-contractors`, { withCredentials: true })
      .pipe(tap(() => console.log('Contractors fetched successfully')));
  }
}
