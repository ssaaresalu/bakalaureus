import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface M3TransportForm {
  yearlyInfo: FormArray<M3TransportYearForm>;
}

export type M3TransportYearForm = FormGroup<{
  year: FormControl<string>;
  vans: FormArray<TransportDetailsForm>;
  rigidTrucks: FormArray<TransportDetailsForm>;
  articulatedTrucks: FormArray<TransportDetailsForm>;
  articulatedRigidTrucks: FormArray<TransportDetailsForm>;
  transportBus: FormArray<TransportDetailsForm>;
  trains: FormArray<TransportDetailsForm>;
  planes: FormArray<TransportDetailsForm>;
  ships: FormArray<TransportDetailsForm>;
}>;

export type TransportDetailsForm = FormGroup<{
  unitNumber: FormControl<string>;
  capacity?: FormControl<string>;
  type: FormControl<string>;
  distance: FormControl<string>;
  productAmount?: FormControl<string>;
  totalDistanceProductAmount?: FormControl<number>;
  isUsingModelEmissionFactor: FormControl<boolean | undefined>;
  emissionFactor: FormControl<number>;
  otherEmissionFactor: FormControl<string>;
  kgCO2Footprint: FormControl<number>;
}>;
