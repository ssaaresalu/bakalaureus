import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PageComponentAbstract } from '../../shared/components/page-component-abstract';
import {
  FormArray,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  DetailsForm,
  M1EmissionsForm,
  M1EmissionsYearForm,
} from '../../interface/m1-emissions-form';
import { MatIcon } from '@angular/material/icon';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { GetListItemValuePipe } from '../../shared/pipes/get-list-item-value.pipe';
import { Subject, takeUntil } from 'rxjs';
import { getListItemValue } from '../../util/data-util';
import { CalculateEmissionsPipe } from '../../shared/pipes/calculate-emissions.pipe';

@Component({
  selector: 'app-page-two',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatIcon,
    DropdownComponent,
    GetListItemValuePipe,
    CalculateEmissionsPipe,
  ],
  templateUrl: './page-two.component.html',
  styleUrl: './page-two.component.css',
})
export class PageTwoComponent extends PageComponentAbstract implements OnInit {
  currentYearIndex = 0;
  M1Form = new FormGroup<M1EmissionsForm>({
    yearlyInfo: new FormArray<M1EmissionsYearForm>([]),
  });
  private energyFormGroupSubjects: Map<number, Subject<void>> = new Map();
  private vehicleFuels1FormSubjects: Map<number, Subject<void>> = new Map();
  private vehicleFuels2FormSubjects: Map<number, Subject<void>> = new Map();
  private vehicleFuels3FormSubjects: Map<number, Subject<void>> = new Map();
  private dispersedEmissionsFormSubjects: Map<number, Subject<void>> =
    new Map();

  public constructor(private fb: NonNullableFormBuilder) {
    super();
  }

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

  addEnergyField(form: M1EmissionsYearForm) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(''),
      type: this.fb.control<string>(''),
      amount: this.fb.control<string | undefined>(undefined),
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(
        undefined,
      ),
      emissionFactor: this.fb.control<number>(0),
      otherEmissionFactor: this.fb.control<string | undefined>(undefined),
    });
    form.controls.energy.push(data);

    const index = form.controls.energy.length - 1;
    const destroySubject = new Subject<void>();
    this.energyFormGroupSubjects.set(index, destroySubject);
    form.controls.energy
      .at(index)
      .controls.type.valueChanges.pipe(takeUntil(destroySubject))
      .subscribe((type) => {
        const value = getListItemValue(type, this.emissionsLists.energy);
        form.controls.energy.at(index).controls.emissionFactor.setValue(value);
      });
  }

  removeEnergyField(form: M1EmissionsYearForm, i: number) {
    form.controls.energy.removeAt(i);

    const destroySubject = this.energyFormGroupSubjects.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.energyFormGroupSubjects.delete(i);
    }
  }

  showNextYear(): void {
    if (this.currentYearIndex < this.M1Form.controls.yearlyInfo.length - 1)
      this.currentYearIndex++;
  }

  showPrevYear(): void {
    if (this.currentYearIndex > 0) this.currentYearIndex--;
  }

  getUnitsByYear(year: string): string[] {
    return (
      this.organizationData.yearlyInfo
        ?.filter((yearlyInfo) => yearlyInfo.year === year)
        .flatMap((yearlyInfo) => yearlyInfo.structuralUnits ?? [])
        .map((structuralUnit) => structuralUnit.number)
        .filter((number): number is string => number !== undefined) || []
    );
  }

  addVehicle1Field(form: M1EmissionsYearForm) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(''),
      type: this.fb.control<string>(''),
      amount: this.fb.control<string | undefined>(undefined),
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(
        undefined,
      ),
      emissionFactor: this.fb.control<number>(0),
      otherEmissionFactor: this.fb.control<string | undefined>(undefined),
    });
    form.controls.vehicleFuels1.push(data);

    const index = form.controls.vehicleFuels1.length - 1;
    const destroySubject = new Subject<void>();
    this.vehicleFuels1FormSubjects.set(index, destroySubject);
    form.controls.vehicleFuels1
      .at(index)
      .controls.type.valueChanges.pipe(takeUntil(destroySubject))
      .subscribe((type) => {
        const value = getListItemValue(type, this.emissionsLists.vehicleFuels1);
        form.controls.vehicleFuels1
          .at(index)
          .controls.emissionFactor.setValue(value);
      });
  }

  removeVehicle1Field(form: M1EmissionsYearForm, i: number) {
    form.controls.vehicleFuels1.removeAt(i);

    const destroySubject = this.vehicleFuels1FormSubjects.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.vehicleFuels1FormSubjects.delete(i);
    }
  }

  addVehicle2Field(form: M1EmissionsYearForm) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(''),
      type: this.fb.control<string>(''),
      amount: this.fb.control<string | undefined>(undefined),
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(
        undefined,
      ),
      emissionFactor: this.fb.control<number>(0),
      otherEmissionFactor: this.fb.control<string | undefined>(undefined),
    });
    form.controls.vehicleFuels2.push(data);

    const index = form.controls.vehicleFuels2.length - 1;
    const destroySubject = new Subject<void>();
    this.vehicleFuels2FormSubjects.set(index, destroySubject);
    form.controls.vehicleFuels2
      .at(index)
      .controls.type.valueChanges.pipe(takeUntil(destroySubject))
      .subscribe((type) => {
        const value = getListItemValue(type, this.emissionsLists.vehicleFuels2);
        form.controls.vehicleFuels2
          .at(index)
          .controls.emissionFactor.setValue(value);
      });
  }

  removeVehicle2Field(form: M1EmissionsYearForm, i: number) {
    form.controls.vehicleFuels2.removeAt(i);

    const destroySubject = this.vehicleFuels2FormSubjects.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.vehicleFuels2FormSubjects.delete(i);
    }
  }

  addVehicle3Field(form: M1EmissionsYearForm) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(''),
      type: this.fb.control<string>(''),
      amount: this.fb.control<string | undefined>(undefined),
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(
        undefined,
      ),
      emissionFactor: this.fb.control<number>(0),
      otherEmissionFactor: this.fb.control<string | undefined>(undefined),
    });
    form.controls.vehicleFuels3.push(data);

    const index = form.controls.vehicleFuels3.length - 1;
    const destroySubject = new Subject<void>();
    this.vehicleFuels3FormSubjects.set(index, destroySubject);
    form.controls.vehicleFuels3
      .at(index)
      .controls.type.valueChanges.pipe(takeUntil(destroySubject))
      .subscribe((type) => {
        const value = getListItemValue(type, this.emissionsLists.vehicleFuels3);
        form.controls.vehicleFuels3
          .at(index)
          .controls.emissionFactor.setValue(value);
      });
  }

  removeVehicle3Field(form: M1EmissionsYearForm, i: number) {
    form.controls.vehicleFuels3.removeAt(i);

    const destroySubject = this.vehicleFuels3FormSubjects.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.vehicleFuels3FormSubjects.delete(i);
    }
  }

  addDispersedEmissionsField(form: M1EmissionsYearForm) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(''),
      type: this.fb.control<string>(''),
      amount: this.fb.control<string | undefined>(undefined),
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(
        undefined,
      ),
      emissionFactor: this.fb.control<number>(0),
      otherEmissionFactor: this.fb.control<string | undefined>(undefined),
    });
    form.controls.dispersedEmissions.push(data);

    const index = form.controls.dispersedEmissions.length - 1;
    const destroySubject = new Subject<void>();
    this.dispersedEmissionsFormSubjects.set(index, destroySubject);
    form.controls.dispersedEmissions
      .at(index)
      .controls.type.valueChanges.pipe(takeUntil(destroySubject))
      .subscribe((type) => {
        const value = getListItemValue(
          type,
          this.emissionsLists.dispersedEmissions,
        );
        form.controls.dispersedEmissions
          .at(index)
          .controls.emissionFactor.setValue(value);
      });
  }

  removeDispersedEmissionsField(form: M1EmissionsYearForm, i: number) {
    form.controls.dispersedEmissions.removeAt(i);

    const destroySubject = this.dispersedEmissionsFormSubjects.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.dispersedEmissionsFormSubjects.delete(i);
    }
  }
}
