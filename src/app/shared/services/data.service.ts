import { inject, Injectable } from '@angular/core';
import { GHGFootprintApiService } from './ghgfootprint-api.service';
import { BehaviorSubject } from 'rxjs';
import { EmissionLists } from '../../interface/emission-lists';
import { emptyEmissionLists } from '../../util/data-util';
import { OrganizationData } from '../../interface/organization-data';
import { ListValueItem } from '../../interface/list-value-item';
import { M1Emissions } from '../../interface/m1-emissions';
import { M2Emissions } from '../../interface/m2-emissions';
import { M3TransportEmissions } from '../../interface/m3-transport-emissions';
import { M3OtherItems } from '../../interface/m3-other-items';
import { OrganisationEmissions } from '../../interface/organisation-emissions';

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

  M1EmissionsInfo$ = new BehaviorSubject<M1Emissions>({} as M1Emissions);
  M2EmissionsInfo$ = new BehaviorSubject<M2Emissions>({} as M2Emissions);
  M3TransportEmissionsInfo$ = new BehaviorSubject<M3TransportEmissions>(
    {} as M3TransportEmissions,
  );
  M3OtherEmissionsInfo$ = new BehaviorSubject<M3OtherItems>({} as M3OtherItems);

  organizationEmissions$ = new BehaviorSubject<OrganisationEmissions>(
    {} as OrganisationEmissions,
  );

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

  saveFields(savedFootprintData: OrganisationEmissions) {
    this.organizationEmissions$.next(savedFootprintData);
    console.log(this.organizationEmissions$.value);
  }
}
