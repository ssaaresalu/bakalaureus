import { Component, OnInit } from '@angular/core';
import { PageComponentAbstract } from '../../../shared/components/page-component-abstract';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  M3TransportForm,
  M3TransportYearForm,
  TransportDetailsForm,
} from '../../../interface/m3-transport-form';
import { Subject } from 'rxjs';
import { EntryComponent } from '../../../shared/components/entry/entry.component';
import { DetailsForm } from '../../../interface/details-form';
import { MatIcon } from '@angular/material/icon';
import { ListValueItem } from '../../../interface/list-value-item';
import { GetListByCapacityPipe } from '../../../shared/pipes/get-list-by-capacity.pipe';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {
  M3TransportYearlyInfo,
  TransportEmissions,
} from '../../../interface/m3-transport-emissions';
import {
  OrganizationEmissions,
  OrganizationEmissionsYearlyInfo,
} from '../../../interface/organization-emissions';

@Component({
  selector: 'app-m3-transport-page',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    EntryComponent,
    MatIcon,
    GetListByCapacityPipe,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
  ],
  templateUrl: './m3-transport-page.component.html',
  styleUrl: './m3-transport-page.component.css',
})
export class M3TransportPageComponent
  extends PageComponentAbstract
  implements OnInit
{
  M3TransportForm = new FormGroup<M3TransportForm>({
    yearlyInfo: new FormArray<M3TransportYearForm>([]),
  });

  private vansFormSubjects: Map<number, Subject<void>> = new Map();
  private rigidTrucksFormSubjects: Map<number, Subject<void>> = new Map();

  private formSubjects: Map<string, Map<number, Subject<void>>> = new Map([
    ['vans', this.vansFormSubjects],
    ['rigidTrucks', this.rigidTrucksFormSubjects],
  ]);

  ngOnInit(): void {
    this.initYearlyInfoForm();
    this.addValuesToForms();
  }

  submit() {
    this.dataService.saveFields(this.savedFootprintData);
  }

  protected get savedFootprintData(): OrganizationEmissions {
    return {
      ...this.emissionsData,
      organizationEmissionsYearlyInfo:
        this.emissionsData.organizationEmissionsYearlyInfo.map((yearInfo) => {
          const info = {
            ...yearInfo,
            M3_transportEmissions: this.getYearlyInfoValues(yearInfo),
          };
          info.M3TotalEmissions =
            (info.M3_transportEmissions.totalEmissions ?? 0) +
            (yearInfo.M3_otherEmissions?.totalEmissions ?? 0);
          info.totalOrganizationEmissions =
            (info.M3TotalEmissions ?? 0) +
            (yearInfo.M1_emissions?.totalEmissions ?? 0) +
            (yearInfo.M2_emissions?.totalEmissions ?? 0);
          return info;
        }),
    };
  }

  private getYearlyInfoValues(
    yearlyInfoForm: OrganizationEmissionsYearlyInfo,
  ): M3TransportYearlyInfo {
    const yearForm = this.M3TransportForm.controls.yearlyInfo.controls.find(
      (form) => form.controls.year.value === yearlyInfoForm.year,
    );
    if (yearForm) {
      const info: M3TransportYearlyInfo = {
        vans: this.getTransportDetailsFormValues(yearForm.controls.vans),
        rigidTrucks: this.getTransportDetailsFormValues(
          yearForm.controls.rigidTrucks,
        ),
        articulatedTrucks: this.getTransportDetailsFormValues(
          yearForm.controls.articulatedTrucks,
        ),
        articulatedRigidTrucks: this.getTransportDetailsFormValues(
          yearForm.controls.articulatedRigidTrucks,
        ),
        transportBus: this.getTransportDetailsFormValues(
          yearForm.controls.transportBus,
        ),
        trains: this.getTransportDetailsFormValues(yearForm.controls.trains),
        planes: this.getTransportDetailsFormValues(yearForm.controls.planes),
        ships: this.getTransportDetailsFormValues(yearForm.controls.ships),
      };
      info.totalEmissions = this.getTotalEmissions(info);
      yearlyInfoForm.M3TotalEmissions =
        yearlyInfoForm.M3_otherEmissions?.totalEmissions ?? 0;
      yearlyInfoForm.M3TotalEmissions += info.totalEmissions;
      return info;
    }
    return {} as M3TransportYearlyInfo;
  }

  private getTotalEmissions(info: M3TransportYearlyInfo): number {
    let total = 0;
    const sumEmissions = (
      details: TransportEmissions[] | undefined,
    ): number => {
      return (
        details?.reduce((acc, detail) => acc + detail.kgCO2Footprint, 0) ?? 0
      );
    };
    total += sumEmissions(info.vans);
    total += sumEmissions(info.rigidTrucks);
    total += sumEmissions(info.articulatedTrucks);
    total += sumEmissions(info.articulatedRigidTrucks);
    total += sumEmissions(info.transportBus);
    total += sumEmissions(info.trains);
    total += sumEmissions(info.planes);
    total += sumEmissions(info.ships);
    return total;
  }

  private addValuesToForms(): void {
    this.emissionsData.organizationEmissionsYearlyInfo.forEach((yearlyInfo) => {
      const M3TransportEmissionsYearForm =
        this.M3TransportForm.controls.yearlyInfo.controls.find(
          (yearForm) => yearForm.controls.year.value === yearlyInfo.year,
        );
      yearlyInfo.M3_transportEmissions?.vans?.forEach((vanData) =>
        M3TransportEmissionsYearForm?.controls.vans.push(
          this.addTransportDataDetailsToForm(
            vanData,
            true,
            false,
            this.emissionsLists.vans,
          ),
        ),
      );
      yearlyInfo.M3_transportEmissions?.rigidTrucks?.forEach((rigidTruck) =>
        M3TransportEmissionsYearForm?.controls.rigidTrucks.push(
          this.addTransportDataDetailsToForm(rigidTruck, true, true),
        ),
      );
      yearlyInfo.M3_transportEmissions?.articulatedTrucks?.forEach(
        (articulatedTruck) =>
          M3TransportEmissionsYearForm?.controls.articulatedTrucks.push(
            this.addTransportDataDetailsToForm(articulatedTruck, true, true),
          ),
      );
      yearlyInfo.M3_transportEmissions?.articulatedRigidTrucks?.forEach(
        (articulatedRigidTruck) =>
          M3TransportEmissionsYearForm?.controls.articulatedRigidTrucks.push(
            this.addTransportDataDetailsToForm(
              articulatedRigidTruck,
              true,
              true,
            ),
          ),
      );
      yearlyInfo.M3_transportEmissions?.transportBus?.forEach((transportBus) =>
        M3TransportEmissionsYearForm?.controls.transportBus.push(
          this.addTransportDataDetailsToForm(
            transportBus,
            false,
            false,
            this.emissionsLists.transportBus,
          ),
        ),
      );
      yearlyInfo.M3_transportEmissions?.trains?.forEach((train) =>
        M3TransportEmissionsYearForm?.controls.trains.push(
          this.addTransportDataDetailsToForm(
            train,
            true,
            false,
            this.emissionsLists.trains,
          ),
        ),
      );
      yearlyInfo.M3_transportEmissions?.planes?.forEach((plane) =>
        M3TransportEmissionsYearForm?.controls.planes.push(
          this.addTransportDataDetailsToForm(
            plane,
            true,
            false,
            this.emissionsLists.planes,
          ),
        ),
      );
      yearlyInfo.M3_transportEmissions?.ships?.forEach((ship) =>
        M3TransportEmissionsYearForm?.controls.ships.push(
          this.addTransportDataDetailsToForm(
            ship,
            true,
            false,
            this.emissionsLists.ships,
          ),
        ),
      );
    });
  }

  private initYearlyInfoForm() {
    this.organizationData.yearlyInfo?.forEach((yearlyInfo) => {
      this.M3TransportForm.controls.yearlyInfo.push(
        this.newYearlyInfoForm(yearlyInfo.year),
      );
    });
  }

  private newYearlyInfoForm(year?: string): M3TransportYearForm {
    return new FormGroup({
      year: this.fb.control(year ?? ''),
      vans: new FormArray<TransportDetailsForm>([]),
      rigidTrucks: new FormArray<TransportDetailsForm>([]),
      articulatedTrucks: new FormArray<TransportDetailsForm>([]),
      articulatedRigidTrucks: new FormArray<TransportDetailsForm>([]),
      transportBus: new FormArray<TransportDetailsForm>([]),
      trains: new FormArray<TransportDetailsForm>([]),
      planes: new FormArray<TransportDetailsForm>([]),
      ships: new FormArray<TransportDetailsForm>([]),
    });
  }

  showNextYear(): void {
    if (
      this.currentYearIndex <
      this.M3TransportForm.controls.yearlyInfo.length - 1
    )
      this.currentYearIndex++;
  }

  showPrevYear(): void {
    if (this.currentYearIndex > 0) this.currentYearIndex--;
  }

  addField(
    form: M3TransportYearForm,
    controlName: string,
    hasAmount: boolean,
    hasCapacity: boolean,
    list?: ListValueItem[],
  ): void {
    const data = this.addNewTransportDetailsFormGroup(hasAmount, hasCapacity);
    const formControl = form.get(
      controlName,
    ) as FormArray<TransportDetailsForm>;
    formControl.push(data);
    const index = formControl.length - 1;
    const destroy$ = new Subject<void>();
    this.formSubjects.get(controlName)?.set(index, destroy$);
    const controlAtIndex = formControl.at(index);
    this.subscribeToTransportFormGroupFields(controlAtIndex, destroy$, list);
  }

  removeField(form: M3TransportYearForm, i: number, controlName: string): void {
    const formControl = form.get(controlName) as FormArray<DetailsForm>;
    formControl.removeAt(i);
    const destroySubject = this.formSubjects.get(controlName)?.get(i);
    if (destroySubject) {
      this.dataService.capacityList$.next([]);
      destroySubject.next();
      destroySubject.complete();
      this.formSubjects.get(controlName)?.delete(i);
    }
  }

  addNewTransportDetailsFormGroup(
    hasAmount: boolean,
    hasCapacity: boolean,
  ): TransportDetailsForm {
    const form = new FormGroup({
      unitNumber: this.fb.control<string>(''),
      distance: this.fb.control<string>(''),
      type: this.fb.control<string>(''),
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(
        undefined,
      ),
      emissionFactor: this.fb.control<number>(0),
      otherEmissionFactor: this.fb.control<string>(''),
      kgCO2Footprint: this.fb.control<number>(0),
    }) as TransportDetailsForm;
    if (hasAmount) {
      form.addControl(
        'productAmount',
        new FormControl<string>('', { nonNullable: true }),
      );
      form.addControl(
        'totalDistanceProductAmount',
        new FormControl<number>(0, { nonNullable: true }),
      );
      if (hasCapacity) {
        form.addControl(
          'capacity',
          new FormControl<string>('', { nonNullable: true }),
        );
      }
    }
    return form;
  }
}
