import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DetailsForm } from './details-form';

export interface M3OtherItemsForm {
  yearlyInfo: FormArray<M3OtherItemsYearForm>;
}

export type M3OtherItemsYearForm = FormGroup<{
  year: FormControl<string>;
  businessTripsSmall: FormArray<DetailsForm>;
  businessTripsLarge: FormArray<DetailsForm>;
}>;
