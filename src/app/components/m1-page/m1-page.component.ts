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
import { RowComponent } from '../../shared/components/row/row.component';
import { ListValueItem } from '../../interface/list-value-item';

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
    RowComponent,
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
  }

  submit() {}

  initYearlyInfoForm(): void {
    this.organizationData.yearlyInfo?.forEach((yearlyInfo) => {
      this.M1Form.controls.yearlyInfo.push(
        this.newYearlyInfoForm(yearlyInfo.year),
      );
    });
  }

  private newYearlyInfoForm(year?: string): M1EmissionsYearForm {
    return new FormGroup({
      year: this.fb.control(year ?? ''),
      energy: new FormArray<DetailsForm>([]),
      vehicleFuels1: new FormArray<DetailsForm>([]),
      vehicleFuels2: new FormArray<DetailsForm>([]),
      vehicleFuels3: new FormArray<DetailsForm>([]),
      dispersedEmissions: new FormArray<DetailsForm>([]),
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
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(true),
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
