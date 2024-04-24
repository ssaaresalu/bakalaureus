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
import { EntryComponent } from '../../../shared/components/row/entry.component';
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
  }

  submit() {}

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
