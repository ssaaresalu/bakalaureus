import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  GhgAssessmentScopeForm,
  OrganizationForm,
  OrganizationYearlyInfoForm,
  RelativeIndicatorGroup,
  StructuralUnitForm,
} from '../../../../interface/organization-form';
import { TranslateModule } from '@ngx-translate/core';
import { YearPickerComponent } from '../../../../shared/components/year-picker/year-picker.component';
import { MatIcon } from '@angular/material/icon';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { AREAS, CATEGORIES } from '../../../../util/lists';
import { OrganizationApiService } from '../../../../shared/services/organization-api.service';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    YearPickerComponent,
    MatIcon,
    DropdownComponent,
  ],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.css',
})
export class OrganizationComponent implements OnInit {
  private organizationApiService = inject(OrganizationApiService);
  yearRange: number[] = [];
  readonly MAX_NR_OF_UNITS = 10;
  currentYearIndex = 0;
  protected readonly categoriesList = CATEGORIES;
  protected readonly areas = AREAS;

  organizationForm = new FormGroup<OrganizationForm>({
    id: this.fb.control<number>(0),
    name: this.fb.control<string>(''),
    reportingPeriodStart: this.fb.control<string>(''),
    reportingPeriodEnd: this.fb.control<string>(''),
    yearlyInfo: new FormArray<OrganizationYearlyInfoForm>([]),
  });

  public constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.subscribeToReportingPeriods();
  }

  getOrganizations(): void {
    this.organizationApiService.getOrganizations().subscribe((res) => {
      console.log(res);
      return res;
    });
  }

  onOrganizationSubmit() {
    console.log(this.organizationForm.value);
    this.organizationApiService
      .saveOrganization(this.organizationForm.value)
      .subscribe((res) => {
        console.log(res);
        this.getOrganizations();
      });
  }

  onYearSelected(selectedYear: number) {
    console.log('selected year: ', selectedYear);
  }

  get canShowNextYear(): boolean {
    return this.currentYearIndex < this.yearlyInfo.controls.length - 1;
  }

  get canShowPrevYear(): boolean {
    return this.currentYearIndex > 0;
  }

  showNextYear() {
    if (this.canShowNextYear) {
      this.currentYearIndex++;
    }
  }

  showPrevYear() {
    if (this.canShowPrevYear) {
      this.currentYearIndex--;
    }
  }

  getUnitNumbers(yearGroup: OrganizationYearlyInfoForm): string[] {
    const unitsLength = yearGroup.controls.structuralUnits?.length ?? 0;
    return [...Array(unitsLength)].map((_, i) => (i + 1).toString());
  }

  private subscribeToReportingPeriods() {
    this.organizationForm
      .get('reportingPeriodStart')!
      .valueChanges.subscribe(() => {
        this.updateYearRangeBlocks();
      });
    this.organizationForm
      .get('reportingPeriodEnd')!
      .valueChanges.subscribe(() => {
        this.updateYearRangeBlocks();
      });
  }

  private updateYearRangeBlocks() {
    const startYear = parseInt(
      this.organizationForm.get('reportingPeriodStart')!.value,
    );
    const endYear = parseInt(
      this.organizationForm.get('reportingPeriodEnd')!.value,
    );

    if (!isNaN(startYear) && !isNaN(endYear) && startYear <= endYear) {
      this.yearRange = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => startYear + i,
      );
      this.initYearlyInfoForm();
    } else {
      this.yearRange = [];
    }
  }

  private initYearlyInfoForm() {
    while (this.organizationForm.controls.yearlyInfo.length !== 0) {
      (this.organizationForm.get('yearlyInfo') as FormArray).removeAt(0);
    }
    this.yearRange.forEach((year) => {
      const yearlyInfoFormGroup = new FormGroup({
        year: new FormControl(year.toString()),
        relativeIndicators: new FormArray<RelativeIndicatorGroup>([]),
        structuralUnits: new FormArray<StructuralUnitForm>([]),
        ghgAssessmentScopes: new FormArray<GhgAssessmentScopeForm>([]),
      });
      this.organizationForm.controls.yearlyInfo.push(
        yearlyInfoFormGroup as OrganizationYearlyInfoForm,
      );
    });
    console.log(this.organizationForm.controls.yearlyInfo.controls);
  }

  get yearlyInfo() {
    return this.organizationForm.controls.yearlyInfo;
  }

  addStructuralUnit(yearGroup: OrganizationYearlyInfoForm) {
    if (yearGroup.controls.structuralUnits) {
      const data = new FormGroup({
        number: this.fb.control<string>(
          (yearGroup.controls.structuralUnits?.length + 1).toString(),
        ),
        name: this.fb.control<string>(''),
        location: this.fb.control<string>(''),
      });
      yearGroup.controls.structuralUnits?.push(data);
    }
  }

  removeStructuralUnit(yearGroup: OrganizationYearlyInfoForm, index: number) {
    yearGroup.controls.structuralUnits?.removeAt(index);
  }

  addGhgAssessmentScope(yearGroup: OrganizationYearlyInfoForm) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(''),
      influenceArea: this.fb.control<string>(''),
      category: this.fb.control<string>(''),
    });
    yearGroup.controls.ghgAssessmentScopes?.push(data);
  }

  removeGhgAssessmentScope(yearGroup: OrganizationYearlyInfoForm, i: number) {
    yearGroup.controls.ghgAssessmentScopes?.removeAt(i);
  }
}
