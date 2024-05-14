import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PageComponentAbstract } from '../../shared/components/page-component-abstract';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  M1EmissionsForm,
  M1EmissionsYearForm,
} from '../../interface/m1-emissions-form';
import { MatIcon } from '@angular/material/icon';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { GetListItemValuePipe } from '../../shared/pipes/get-list-item-value.pipe';
import { Subject } from 'rxjs';
import { RoundTonsPipe } from '../../shared/pipes/round-tons.pipe';
import { DetailsForm } from '../../interface/details-form';
import { EntryComponent } from '../../shared/components/entry/entry.component';
import { ListValueItem } from '../../interface/list-value-item';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatFormField } from '@angular/material/form-field';
import { M1YearlyInfo } from '../../interface/m1-emissions';
import {
  OrganizationEmissions,
  OrganizationEmissionsYearlyInfo,
} from '../../interface/organization-emissions';
import { EmissionsDetails } from '../../interface/emissions-details';

@Component({
  selector: 'app-m1-page',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatIcon,
    DropdownComponent,
    GetListItemValuePipe,
    RoundTonsPipe,
    EntryComponent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatFormField,
    MatExpansionPanelHeader,
  ],
  templateUrl: './m1-page.component.html',
  styleUrl: './m1-page.component.css',
})
export class M1PageComponent extends PageComponentAbstract implements OnInit {
  M1Form = new FormGroup<M1EmissionsForm>({
    yearlyInfo: new FormArray<M1EmissionsYearForm>([]),
  });
  private energyFormGroupSubjects: Map<number, Subject<void>> = new Map();
  private vehicleFuels1FormSubjects: Map<number, Subject<void>> = new Map();
  private vehicleFuels2FormSubjects: Map<number, Subject<void>> = new Map();
  private vehicleFuels3FormSubjects: Map<number, Subject<void>> = new Map();
  private dispersedEmissionsFormSubjects: Map<number, Subject<void>> =
    new Map();

  private formSubjects: Map<string, Map<number, Subject<void>>> = new Map([
    ['energy', this.energyFormGroupSubjects],
    ['vehicleFuels1', this.vehicleFuels1FormSubjects],
    ['vehicleFuels2', this.vehicleFuels2FormSubjects],
    ['vehicleFuels3', this.vehicleFuels3FormSubjects],
    ['dispersedEmissions', this.dispersedEmissionsFormSubjects],
  ]);

  ngOnInit() {
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
            M1_emissions: this.getYearlyInfoValues(yearInfo),
          };
          info.totalOrganizationEmissions =
            (info.M1_emissions.totalEmissions ?? 0) +
            (yearInfo.M2_emissions?.totalEmissions ?? 0) +
            (yearInfo.M3TotalEmissions ?? 0);
          return info;
        }),
    };
  }

  private getYearlyInfoValues(
    yearlyInfoForm: OrganizationEmissionsYearlyInfo,
  ): M1YearlyInfo {
    const yearForm = this.M1Form.controls.yearlyInfo.controls.find(
      (form) => form.controls.year.value === yearlyInfoForm.year,
    );
    if (yearForm) {
      const info: M1YearlyInfo = {
        energy: this.getDetailsFormValues(yearForm?.controls.energy),
        vehicleFuels1: this.getDetailsFormValues(
          yearForm.controls.vehicleFuels1,
        ),
        vehicleFuels2: this.getDetailsFormValues(
          yearForm.controls.vehicleFuels2,
        ),
        vehicleFuels3: this.getDetailsFormValues(
          yearForm.controls.vehicleFuels3,
        ),
        dispersedEmissions: this.getDetailsFormValues(
          yearForm.controls.dispersedEmissions,
        ),
      };
      info.totalEnergyEmissions = this.sumEmissions(info.energy);
      info.totalVehicleEmissions =
        this.sumEmissions(info.vehicleFuels1) +
        this.sumEmissions(info.vehicleFuels2) +
        this.sumEmissions(info.vehicleFuels3);
      info.totalDispersedEmissions = this.sumEmissions(info.dispersedEmissions);
      info.totalEmissions =
        info.totalEnergyEmissions +
        info.totalVehicleEmissions +
        info.totalDispersedEmissions;
      return info;
    }
    return {} as M1YearlyInfo;
  }

  private sumEmissions = (details: EmissionsDetails[] | undefined): number => {
    return (
      details?.reduce((acc, detail) => acc + detail.kgCO2Footprint, 0) ?? 0
    );
  };

  initYearlyInfoForm(): void {
    this.organizationData.yearlyInfo?.forEach((yearlyInfo) => {
      this.M1Form.controls.yearlyInfo.push(
        this.newYearlyInfoForm(yearlyInfo.year),
      );
    });
  }

  private newYearlyInfoForm(year?: string): M1EmissionsYearForm {
    return this.fb.group({
      year: this.fb.control(year ?? ''),
      energy: this.fb.array<DetailsForm>([]),
      vehicleFuels1: this.fb.array<DetailsForm>([]),
      vehicleFuels2: this.fb.array<DetailsForm>([]),
      vehicleFuels3: this.fb.array<DetailsForm>([]),
      dispersedEmissions: this.fb.array<DetailsForm>([]),
    });
  }

  private addValuesToForms(): void {
    this.emissionsData.organizationEmissionsYearlyInfo.forEach((yearlyInfo) => {
      const M1EmissionsYearForm = this.M1Form.controls.yearlyInfo.controls.find(
        (yearForm) => yearForm.controls.year.value === yearlyInfo.year,
      );
      yearlyInfo.M1_emissions?.energy?.forEach((energyData) =>
        M1EmissionsYearForm?.controls.energy.push(
          this.addDataDetailsToForm(this.emissionsLists.energy, energyData),
        ),
      );
      yearlyInfo.M1_emissions?.vehicleFuels1?.forEach((vehicleData1) => {
        M1EmissionsYearForm?.controls.vehicleFuels1.push(
          this.addDataDetailsToForm(
            this.emissionsLists.vehicleFuels1,
            vehicleData1,
          ),
        );
      });
      yearlyInfo.M1_emissions?.vehicleFuels2?.forEach((vehicleData2) => {
        M1EmissionsYearForm?.controls.vehicleFuels2.push(
          this.addDataDetailsToForm(
            this.emissionsLists.vehicleFuels2,
            vehicleData2,
          ),
        );
      });
      yearlyInfo.M1_emissions?.vehicleFuels3?.forEach((vehicleData3) => {
        M1EmissionsYearForm?.controls.vehicleFuels3.push(
          this.addDataDetailsToForm(
            this.emissionsLists.vehicleFuels3,
            vehicleData3,
          ),
        );
      });
      yearlyInfo.M1_emissions?.dispersedEmissions?.forEach(
        (dispersedEmissionsData) => {
          M1EmissionsYearForm?.controls.dispersedEmissions.push(
            this.addDataDetailsToForm(
              this.emissionsLists.dispersedEmissions,
              dispersedEmissionsData,
            ),
          );
        },
      );
    });
  }

  showNextYear(): void {
    if (this.currentYearIndex < this.M1Form.controls.yearlyInfo.length - 1)
      this.currentYearIndex++;
  }

  showPrevYear(): void {
    if (this.currentYearIndex > 0) this.currentYearIndex--;
  }

  addField(
    form: M1EmissionsYearForm,
    controlName: string,
    list: ListValueItem[],
  ): void {
    const data = this.addNewDetailsFormGroup();
    const formControl = form.get(controlName) as FormArray<DetailsForm>;
    formControl.push(data);
    const index = formControl.length - 1;
    const destroy$ = new Subject<void>();
    this.formSubjects.get(controlName)?.set(index, destroy$);
    const controlAtIndex = formControl.at(index);
    this.subscribeToFormGroupFields(controlAtIndex, list, destroy$);
  }

  removeField(form: M1EmissionsYearForm, i: number, controlName: string): void {
    const formControl = form.get(controlName) as FormArray<DetailsForm>;
    formControl.removeAt(i);
    const destroySubject = this.formSubjects.get(controlName)?.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.formSubjects.get(controlName)?.delete(i);
    }
  }

  addDispersedEmissionsField(form: M1EmissionsYearForm) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(''),
      type: this.fb.control<string>(''),
      amountOrDistance: this.fb.control<string | undefined>(undefined),
      isUsingModelEmissionFactor: this.fb.control<boolean>(true),
      emissionFactor: this.fb.control<number>(0),
      otherEmissionFactor: this.fb.control<string | undefined>(undefined),
      kgCO2Footprint: this.fb.control<number>(0),
    });
    form.controls.dispersedEmissions.push(data);

    const index = form.controls.dispersedEmissions.length - 1;
    const destroySubject = new Subject<void>();
    this.dispersedEmissionsFormSubjects.set(index, destroySubject);
    this.subscribeToFormGroupFields(
      form.controls.dispersedEmissions.at(index),
      this.emissionsLists.dispersedEmissions,
      destroySubject,
    );
  }
}
