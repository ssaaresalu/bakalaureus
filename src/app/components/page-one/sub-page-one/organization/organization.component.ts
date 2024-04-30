import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  GhgAssessmentScopeForm,
  OrganizationForm,
  OrganizationYearlyInfoForm,
  StructuralUnitForm,
} from '../../../../interface/organization-form';
import { TranslateModule } from '@ngx-translate/core';
import { YearPickerComponent } from '../../../../shared/components/year-picker/year-picker.component';
import { MatIcon } from '@angular/material/icon';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { AREAS, CATEGORIES } from '../../../../util/lists';
import { OrganizationApiService } from '../../../../shared/services/organization-api.service';
import { PageComponentAbstract } from '../../../../shared/components/page-component-abstract';
import {
  GhgAssessmentScopes,
  OrganizationData,
  OrganizationYearlyInfo,
  StructuralUnits,
} from '../../../../interface/organization-data';
import { takeUntil } from 'rxjs';

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
export class OrganizationComponent
  extends PageComponentAbstract
  implements OnInit
{
  private organizationApiService = inject(OrganizationApiService);
  yearRange: number[] = [];
  readonly MAX_NR_OF_UNITS = 10;
  protected readonly categoriesList = CATEGORIES;
  protected readonly areas = AREAS;
  protected allOrganizationNames: string[] = [];
  protected allOrganizations: OrganizationData[] = [];
  protected chosenOrganization: OrganizationData = {} as OrganizationData;

  organizationForm = new FormGroup<OrganizationForm>({
    id: this.fb.control<number>(0),
    name: this.fb.control<string>(''),
    reportingPeriodStart: this.fb.control<string>(''),
    reportingPeriodEnd: this.fb.control<string>(''),
    yearlyInfo: new FormArray<OrganizationYearlyInfoForm>([]),
  });

  ngOnInit(): void {
    this.loadOrganizations();
    this.initOrganizationInfo();
    this.subscribeToReportingPeriods();
  }

  private loadOrganizations(): void {
    this.organizationApiService
      .getOrganizations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((organizationsData) => {
        this.allOrganizationNames = organizationsData
          .map((data) => data.name ?? '')
          .filter((name) => name !== this.organizationData.name);
        this.allOrganizations = organizationsData;
      });
  }

  private initOrganizationInfo(): void {
    this.organizationForm.controls.name.setValue(
      this.organizationData.name ?? '',
    );
    this.organizationForm.controls.id.setValue(this.organizationData.id ?? 0);
    this.organizationForm.controls.reportingPeriodStart.setValue(
      this.organizationData.reportingPeriodStart ?? '',
    );
    this.organizationForm.controls.reportingPeriodEnd.setValue(
      this.organizationData.reportingPeriodEnd ?? '',
    );
    this.organizationData.yearlyInfo?.forEach((yearlyInfo) => {
      this.organizationForm.controls.yearlyInfo.push(
        this.newYearlyInfoForm(yearlyInfo),
      );
    });
  }

  private newYearlyInfoForm(
    info: OrganizationYearlyInfo,
  ): OrganizationYearlyInfoForm {
    return this.fb.group({
      year: info.year ?? '',
      nrOfEmployees: info.nrOfEmployees ?? '',
      structuralUnits: this.fb.array(
        info.structuralUnits?.map((unitInfo) =>
          this.setStructuralUnits(unitInfo),
        ) ?? [],
      ),
      ghgAssessmentScopes: this.fb.array(
        info.ghgAssessmentScopes?.map((assessmentInfo) =>
          this.setGhgAssessmentScopes(assessmentInfo),
        ) ?? [],
      ),
    });
  }

  private setStructuralUnits(info: StructuralUnits): StructuralUnitForm {
    return this.fb.group({
      number: info.number ?? '',
      name: info.name ?? '',
      location: info.location ?? '',
    });
  }

  private setGhgAssessmentScopes(
    info: GhgAssessmentScopes,
  ): GhgAssessmentScopeForm {
    return this.fb.group({
      unitNumber: info.unitNumber ?? '',
      influenceArea: info.influenceArea ?? '',
      category: info.category ?? '',
    });
  }

  onOrganizationSubmit(): void {
    this.organizationApiService
      .saveOrganization(this.organizationForm.value)
      .subscribe((organization) => {
        this.dataService.organizationData$.next(organization);
        if (organization.yearlyInfo) {
          const emissionsInfo = organization.yearlyInfo.map((yi) => ({
            year: yi.year,
          }));
          this.dataService.organizationEmissions$.next({
            organizationEmissionsYearlyInfo: emissionsInfo,
          });
        }
      });
  }

  get canShowNextYear(): boolean {
    return this.currentYearIndex < this.yearlyInfo.controls.length - 1;
  }

  get canShowPrevYear(): boolean {
    return this.currentYearIndex > 0;
  }

  showNextYear(): void {
    if (this.canShowNextYear) {
      this.currentYearIndex++;
    }
  }

  showPrevYear(): void {
    if (this.canShowPrevYear) {
      this.currentYearIndex--;
    }
  }

  getUnitNumbers(yearGroup: OrganizationYearlyInfoForm): string[] {
    const unitsLength = yearGroup.controls.structuralUnits?.length ?? 0;
    return [...Array(unitsLength)].map((_, i) => (i + 1).toString());
  }

  private subscribeToReportingPeriods(): void {
    this.organizationForm
      .get('reportingPeriodStart')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateYearRangeBlocks();
      });
    this.organizationForm
      .get('reportingPeriodEnd')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateYearRangeBlocks();
      });
  }

  private updateYearRangeBlocks(): void {
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

  private initYearlyInfoForm(): void {
    while (this.organizationForm.controls.yearlyInfo.length !== 0) {
      (this.organizationForm.get('yearlyInfo') as FormArray).removeAt(0);
    }
    this.yearRange.forEach((year) => {
      const yearlyInfoFormGroup = new FormGroup({
        year: new FormControl<string>(year.toString()),
        nrOfEmployees: new FormControl<string>(''),
        structuralUnits: new FormArray<StructuralUnitForm>([]),
        ghgAssessmentScopes: new FormArray<GhgAssessmentScopeForm>([]),
      });
      if (!this.chosenOrganization.name) {
        this.organizationForm.controls.yearlyInfo.push(
          yearlyInfoFormGroup as OrganizationYearlyInfoForm,
        );
      }
    });
  }

  get yearlyInfo(): FormArray<OrganizationYearlyInfoForm> {
    return this.organizationForm.controls.yearlyInfo;
  }

  addStructuralUnit(yearGroup: OrganizationYearlyInfoForm): void {
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

  removeStructuralUnit(
    yearGroup: OrganizationYearlyInfoForm,
    index: number,
  ): void {
    yearGroup.controls.structuralUnits?.removeAt(index);
  }

  addGhgAssessmentScope(yearGroup: OrganizationYearlyInfoForm): void {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(''),
      influenceArea: this.fb.control<string>(''),
      category: this.fb.control<string>(''),
    });
    yearGroup.controls.ghgAssessmentScopes?.push(data);
  }

  removeGhgAssessmentScope(
    yearGroup: OrganizationYearlyInfoForm,
    i: number,
  ): void {
    yearGroup.controls.ghgAssessmentScopes?.removeAt(i);
  }

  protected fillFieldsByChosenOrganization(organizationName: string): void {
    this.chosenOrganization =
      this.allOrganizations.find((org) => org.name === organizationName) ??
      ({} as OrganizationData);
    this.organizationData = this.chosenOrganization;
    this.initOrganizationInfo();
  }
}
