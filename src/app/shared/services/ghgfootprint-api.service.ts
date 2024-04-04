import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmissionLists } from '../../interface/emission-lists';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GHGFootprintApiService {
  private apiServerUrl = environment.apiBaseUrl;
  private http = inject(HttpClient);
  constructor() {}

  getEmissionFactors(): Observable<EmissionLists> {
    return this.http.get<EmissionLists>(
      `${this.apiServerUrl}/emissionfactors/all`,
      {
        headers: { Accept: 'application/json;charset=utf-8' },
      },
    );
  }
}
