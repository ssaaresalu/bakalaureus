import { inject, Injectable } from '@angular/core';
import { GHGFootprintApiService } from './ghgfootprint-api.service';
import { BehaviorSubject } from 'rxjs';
import { EmissionLists } from '../../interface/emission-lists';
import { emptyEmissionLists } from '../../util/data-util';
import { OrganizationData } from '../../interface/organization-data';
import { ListValueItem } from '../../interface/list-value-item';
import { OrganizationEmissions } from '../../interface/organization-emissions';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  ghgFootPrintApiService = inject(GHGFootprintApiService);
  emissionLists$ = new BehaviorSubject<EmissionLists>(emptyEmissionLists);
  currentLang$ = new BehaviorSubject<string>('');
  lang$ = this.currentLang$.asObservable();
  organizationData$ = new BehaviorSubject<OrganizationData | null>(null);

  allOrganizationsData$ = new BehaviorSubject<OrganizationData[]>(
    [] as OrganizationData[],
  );

  capacityList$: BehaviorSubject<ListValueItem[]> = new BehaviorSubject<
    ListValueItem[]
  >([]);

  organizationEmissions$ = new BehaviorSubject<OrganizationEmissions>(
    {} as OrganizationEmissions,
  );

  get organizationData(): OrganizationData {
    return this.organizationData$.value ?? {};
  }

  get emissionsLists(): EmissionLists {
    return this.emissionLists$.value;
  }

  initLists(): void {
    this.ghgFootPrintApiService.getEmissionFactors().subscribe((lists) => {
      this.emissionLists$.next(lists);
    });
  }

  saveFields(savedFootprintData: OrganizationEmissions) {
    this.organizationEmissions$.next(savedFootprintData);
    console.log(this.organizationEmissions$.value);
  }
}
