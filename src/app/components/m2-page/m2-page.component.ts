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
import { RowComponent } from '../../shared/components/row/row.component';
import { ListValueItem } from '../../interface/list-value-item';

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
    RowComponent,
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
  }

  submit() {}

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
