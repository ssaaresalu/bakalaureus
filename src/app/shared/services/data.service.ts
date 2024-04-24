import { inject, Injectable } from '@angular/core';
import { GHGFootprintApiService } from './ghgfootprint-api.service';
import { BehaviorSubject } from 'rxjs';
import { EmissionLists } from '../../interface/emission-lists';
import { emptyEmissionLists } from '../../util/data-util';
import { OrganizationData } from '../../interface/organization-data';
import { ListValueItem } from '../../interface/list-value-item';
import { M1Emissions } from '../../interface/m1-emissions';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  ghgFootPrintApiService = inject(GHGFootprintApiService);
  emissionLists$ = new BehaviorSubject<EmissionLists>(emptyEmissionLists);
  currentLang$ = new BehaviorSubject<string>('');
  lang$ = this.currentLang$.asObservable();
  organizationData$ = new BehaviorSubject<OrganizationData>(
    {} as OrganizationData,
  );

  capacityList$: BehaviorSubject<ListValueItem[]> = new BehaviorSubject<
    ListValueItem[]
  >([]);

  M1_emissionsKg = new BehaviorSubject<number>(0);
  M2_emissionsKg = new BehaviorSubject<number>(0);
  M3_emissionsKg = new BehaviorSubject<number>(0);

  M1EmissionsInfo = new BehaviorSubject<M1Emissions>({} as M1Emissions);

  get organizationData(): OrganizationData {
    return this.organizationData$.value;
  }

  get emissionsLists(): EmissionLists {
    return this.emissionLists$.value;
  }

  initLists(): void {
    this.ghgFootPrintApiService.getEmissionFactors().subscribe((lists) => {
      this.emissionLists$.next(lists);
    });
  }

  saveFields(savedFootprintData: M1Emissions) {
    this.M1EmissionsInfo.next(savedFootprintData);
  }
}
