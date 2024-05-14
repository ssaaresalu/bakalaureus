import { FormControl, FormGroup } from '@angular/forms';

export type DetailsForm = FormGroup<{
  unitNumber: FormControl<string>;
  type: FormControl<string>;
  amountOrDistance: FormControl<string | undefined>;
  isUsingModelEmissionFactor: FormControl<boolean>;
  emissionFactor: FormControl<number>;
  otherEmissionFactor: FormControl<string | undefined>;
  kgCO2Footprint: FormControl<number>;
  workHomeType?: FormControl<string>;
}>;
