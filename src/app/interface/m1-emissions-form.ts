import { FormArray, FormControl, FormGroup } from '@angular/forms';

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

export type DetailsForm = FormGroup<{
  unitNumber: FormControl<string>;
  type: FormControl<string>;
  amount: FormControl<string | undefined>;
  isUsingModelEmissionFactor: FormControl<boolean | undefined>;
  emissionFactor: FormControl<number>;
  otherEmissionFactor: FormControl<string | undefined>;
}>;
