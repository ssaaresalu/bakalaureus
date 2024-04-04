import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrganizationData } from '../../interface/organization-data';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrganizationApiService {
  private http = inject(HttpClient);
  private apiServerUrl = environment.apiBaseUrl;

  constructor() {}

  getOrganization(id: number): Observable<OrganizationData[]> {
    return this.http.get<OrganizationData[]>(
      `${this.apiServerUrl}/organization/find/` + id,
    );
  }

  saveOrganization(data: OrganizationData): Observable<OrganizationData> {
    console.log(`${this.apiServerUrl}/organization/add`);
    return this.http.post<OrganizationData>(
      `${this.apiServerUrl}/organization/add`,
      data,
    );
  }
}
