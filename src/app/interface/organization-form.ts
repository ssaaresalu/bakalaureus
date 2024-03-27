import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface OrganizationForm {
  id: FormControl<number>;
  name: FormControl<string>;
  reportingPeriodStart: FormControl<string>;
  reportingPeriodEnd: FormControl<string>;
  yearlyInfo: FormArray<OrganizationYearlyInfoForm>;
}

export type OrganizationYearlyInfoForm = FormGroup<{
  year: FormControl<string>;
  relativeIndicators?: FormArray<RelativeIndicatorGroup>;
  structuralUnits?: FormArray<StructuralUnitForm>;
  ghgAssessmentScopes?: FormArray<GhgAssessmentScopeForm>;
}>;

export type RelativeIndicatorGroup = FormGroup<{
  nrOfEmployees: FormControl<string>;
}>;

export type StructuralUnitForm = FormGroup<{
  number: FormControl<string>;
  name: FormControl<string>;
  location: FormControl<string>;
}>;

export type GhgAssessmentScopeForm = FormGroup<{
  unitNumber: FormControl<string>;
  influenceArea: FormControl<string>;
  category: FormControl<string>;
}>;
