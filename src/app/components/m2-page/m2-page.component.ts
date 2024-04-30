import { Component, OnInit } from '@angular/core';
import { PageComponentAbstract } from '../../shared/components/page-component-abstract';
import {
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  M2EmissionsForm,
  M2EmissionsYearForm,
} from '../../interface/m2-emissions-form';
import { Subject } from 'rxjs';
import { DetailsForm } from '../../interface/details-form';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { RoundTonsPipe } from '../../shared/pipes/round-tons.pipe';
import { MatIcon } from '@angular/material/icon';
import { GetListItemValuePipe } from '../../shared/pipes/get-list-item-value.pipe';
import { EntryComponent } from '../../shared/components/entry/entry.component';
import { ListValueItem } from '../../interface/list-value-item';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {
  OrganizationEmissions,
  OrganizationEmissionsYearlyInfo,
} from '../../interface/organization-emissions';
import { M2YearlyInfo } from '../../interface/m2-emissions';
import { EmissionsDetails } from '../../interface/emissions-details';

@Component({
  selector: 'app-m2-page',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    DropdownComponent,
    RoundTonsPipe,
    MatIcon,
    GetListItemValuePipe,
    EntryComponent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
  ],
  templateUrl: './m2-page.component.html',
  styleUrl: './m2-page.component.css',
})
export class M2PageComponent extends PageComponentAbstract implements OnInit {
  M2Form = new FormGroup<M2EmissionsForm>({
    yearlyInfo: new FormArray<M2EmissionsYearForm>([]),
  });
  private boughtElectricalEnergyFormSubjects: Map<number, Subject<void>> =
    new Map();
  private boughtHeatEnergyFormSubjects: Map<number, Subject<void>> = new Map();

  private formSubjects: Map<string, Map<number, Subject<void>>> = new Map([
    ['boughtElectricalEnergy', this.boughtElectricalEnergyFormSubjects],
    ['boughtHeatEnergy', this.boughtHeatEnergyFormSubjects],
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
            M2_emissions: this.getYearlyInfoValues(yearInfo),
          };
          info.totalOrganizationEmissions =
            (info.M2_emissions.totalEmissions ?? 0) +
            (yearInfo.M1_emissions?.totalEmissions ?? 0) +
            (yearInfo.M3TotalEmissions ?? 0);
          return info;
        }),
    };
  }

  private getYearlyInfoValues(
    yearlyInfoForm: OrganizationEmissionsYearlyInfo,
  ): M2YearlyInfo {
    const yearForm = this.M2Form.controls.yearlyInfo.controls.find(
      (form) => form.controls.year.value === yearlyInfoForm.year,
    );
    if (yearForm) {
      const info: M2YearlyInfo = {
        boughtElectricalEnergy: this.getDetailsFormValues(
          yearForm.controls.boughtElectricalEnergy,
        ),
        boughtHeatEnergy: this.getDetailsFormValues(
          yearForm.controls.boughtHeatEnergy,
        ),
      };
      info.totalBoughtElectricalEnergyEmissions = this.sumEmissions(
        info.boughtElectricalEnergy,
      );
      info.totalBoughtHeatEnergyEmissions = this.sumEmissions(
        info.boughtHeatEnergy,
      );
      info.totalEmissions =
        info.totalBoughtElectricalEnergyEmissions +
        info.totalBoughtHeatEnergyEmissions;
      return info;
    }
    return {} as M2YearlyInfo;
  }

  private sumEmissions = (details: EmissionsDetails[] | undefined): number => {
    return (
      details?.reduce((acc, detail) => acc + detail.kgCO2Footprint, 0) ?? 0
    );
  };

  initYearlyInfoForm(): void {
    this.organizationData.yearlyInfo?.forEach((yearlyInfo) => {
      this.M2Form.controls.yearlyInfo.push(
        this.newYearlyInfoForm(yearlyInfo.year),
      );
    });
  }

  private newYearlyInfoForm(year?: string): M2EmissionsYearForm {
    return new FormGroup({
      year: this.fb.control(year ?? ''),
      boughtElectricalEnergy: new FormArray<DetailsForm>([]),
      boughtHeatEnergy: new FormArray<DetailsForm>([]),
    });
  }

  private addValuesToForms(): void {
    this.emissionsData.organizationEmissionsYearlyInfo.forEach((yearlyInfo) => {
      const M2EmissionsYearForm = this.M2Form.controls.yearlyInfo.controls.find(
        (yearForm) => yearForm.controls.year.value === yearlyInfo.year,
      );
      yearlyInfo.M2_emissions?.boughtElectricalEnergy?.forEach(
        (electricalEnergyData) =>
          M2EmissionsYearForm?.controls.boughtElectricalEnergy.push(
            this.addDataDetailsToForm(
              this.emissionsLists.boughtElectricalEnergy,
              electricalEnergyData,
            ),
          ),
      );
      yearlyInfo.M2_emissions?.boughtHeatEnergy?.forEach((heatEnergyData) =>
        M2EmissionsYearForm?.controls.boughtHeatEnergy.push(
          this.addDataDetailsToForm(
            this.emissionsLists.boughtHeatEnergy,
            heatEnergyData,
          ),
        ),
      );
    });
  }

  showNextYear(): void {
    if (this.currentYearIndex < this.M2Form.controls.yearlyInfo.length - 1)
      this.currentYearIndex++;
  }

  showPrevYear(): void {
    if (this.currentYearIndex > 0) this.currentYearIndex--;
  }

  addField(
    form: M2EmissionsYearForm,
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

  removeField(form: M2EmissionsYearForm, i: number, controlName: string): void {
    const formControl = form.get(controlName) as FormArray<DetailsForm>;
    formControl.removeAt(i);
    const destroySubject = this.formSubjects.get(controlName)?.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.formSubjects.get(controlName)?.delete(i);
    }
  }
}
