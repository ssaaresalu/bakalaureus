import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DetailsForm } from './details-form';

export interface M2EmissionsForm {
  yearlyInfo: FormArray<M2EmissionsYearForm>;
}

export type M2EmissionsYearForm = FormGroup<{
  year: FormControl<string>;
  boughtElectricalEnergy: FormArray<DetailsForm>;
  boughtHeatEnergy: FormArray<DetailsForm>;
}>;
