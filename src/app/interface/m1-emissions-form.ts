import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DetailsForm } from './details-form';

export interface M1EmissionsForm {
  yearlyInfo: FormArray<M1EmissionsYearForm>;
}

export type M1EmissionsYearForm = FormGroup<{
  year: FormControl<string>;
  energy: FormArray<DetailsForm>;
  vehicleFuels1: FormArray<DetailsForm>;
  vehicleFuels2: FormArray<DetailsForm>;
  vehicleFuels3: FormArray<DetailsForm>;
  dispersedEmissions: FormArray<DetailsForm>;
}>;
