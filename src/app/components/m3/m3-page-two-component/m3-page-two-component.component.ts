import { Component, OnInit } from '@angular/core';
import { PageComponentAbstract } from '../../../shared/components/page-component-abstract';
import {
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  M3OtherItemsForm,
  M3OtherItemsYearForm,
} from '../../../interface/m3-other-items-form';
import { Subject } from 'rxjs';
import { DetailsForm } from '../../../interface/details-form';
import { ListValueItem } from '../../../interface/list-value-item';
import { RowComponent } from '../../../shared/components/row/row.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-m3-page-two-component',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    RowComponent,
    MatIcon,
  ],
  templateUrl: './m3-page-two-component.component.html',
  styleUrl: './m3-page-two-component.component.css',
})
export class M3PageTwoComponentComponent
  extends PageComponentAbstract
  implements OnInit
{
  M3OtherItemsForm = new FormGroup<M3OtherItemsForm>({
    yearlyInfo: new FormArray<M3OtherItemsYearForm>([]),
  });

  private businessTripsFormSubjects: Map<number, Subject<void>> = new Map();

  private formSubjects: Map<string, Map<number, Subject<void>>> = new Map([
    ['businessTrips', this.businessTripsFormSubjects],
  ]);

  ngOnInit(): void {
    this.initYearlyInfoForm();
  }

  submit() {}

  private initYearlyInfoForm() {
    this.organizationData.yearlyInfo?.forEach((yearlyInfo) => {
      this.M3OtherItemsForm.controls.yearlyInfo.push(
        this.newYearlyInfoForm(yearlyInfo.year),
      );
    });
  }

  private newYearlyInfoForm(year?: string): M3OtherItemsYearForm {
    return new FormGroup({
      year: this.fb.control(year ?? ''),
      businessTripsSmall: new FormArray<DetailsForm>([]),
      businessTripsLarge: new FormArray<DetailsForm>([]),
    });
  }

  showNextYear(): void {
    if (
      this.currentYearIndex <
      this.M3OtherItemsForm.controls.yearlyInfo.length - 1
    )
      this.currentYearIndex++;
  }

  showPrevYear(): void {
    if (this.currentYearIndex > 0) this.currentYearIndex--;
  }

  addField(
    form: M3OtherItemsYearForm,
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

  removeField(
    form: M3OtherItemsYearForm,
    i: number,
    controlName: string,
  ): void {
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
