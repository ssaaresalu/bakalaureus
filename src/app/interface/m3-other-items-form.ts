import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DetailsForm } from './details-form';

export interface M3OtherItemsForm {
  yearlyInfo: FormArray<M3OtherItemsYearForm>;
}

export type M3OtherItemsYearForm = FormGroup<{
  year: FormControl<string>;
  businessTripsSmall: FormArray<DetailsForm>;
  businessTripsLarge: FormArray<DetailsForm>;
  workHomeTransportSmall: FormArray<DetailsForm>;
  workHomeTransportLarge: FormArray<DetailsForm>;
  waste: FormArray<DetailsForm>;
  homeOffice: FormArray<HomeOfficeForm>;
  products: FormArray<ProductsForm>;
  vehicleFuels: FormArray<VehicleFuelsForm>;
  diffuseEmissions: FormArray<DiffuseEmissionsForm>;
  investments: FormArray<InvestmentsForm>;
}>;

export type HomeOfficeForm = FormGroup<{
  unitNumber: FormControl<string>;
  usedDevice: FormControl<string>;
  amountOfDevices: FormControl<string>;
  deviceElectricityAmount: FormControl<string>;
  amountOfHours: FormControl<string>;
  electricityPackage: FormControl<string>;
  amount_kWh: FormControl<number>;
  isUsingModelEmissionFactor: FormControl<boolean | undefined>;
  emissionFactor: FormControl<number>;
  otherEmissionFactor: FormControl<string | undefined>;
  kgCO2Footprint: FormControl<number>;
}>;

export type ProductsForm = FormGroup<{
  soldOrBought: FormControl<string>;
  unitNumber: FormControl<string>;
  product: FormControl<string>;
  amount: FormControl<string>;
  price: FormControl<string>;
  emissionFactor: FormControl<string>;
  kgCO2Footprint: FormControl<number>;
}>;

export type VehicleFuelsForm = FormGroup<{
  vehicleFuelsType: FormControl<string>;
  unitNumber: FormControl<string>;
  fuel: FormControl<string>;
  amount: FormControl<string>;
  distance: FormControl<string>;
  emissionFactor: FormControl<string>;
  kgCO2Footprint: FormControl<number>;
}>;

export type DiffuseEmissionsForm = FormGroup<{
  unitNumber: FormControl<string>;
  sourceOfEmission: FormControl<string>;
  amount: FormControl<string>;
  unit: FormControl<string>;
  emissionFactor: FormControl<string>;
  kgCO2Footprint: FormControl<number>;
}>;

export type InvestmentsForm = FormGroup<{
  unitNumber: FormControl<string>;
  investment: FormControl<string>;
  calculationMethod: FormControl<string>;
  investmentMethod?: InvestmentMethodFormGroup;
  averageMethod?: AverageMethodFormGroup;
  initialInvestmentYear?: InitialInvestmentYearFormGroup;
  kgCO2Footprint: FormControl<number>;
}>;

export type InvestmentMethodFormGroup = FormGroup<{
  M1_M2_emissions: FormControl<string>;
  percentageOfExpenses: FormControl<string>;
  equityShare: FormControl<string>;
}>;

export type AverageMethodFormGroup = FormGroup<{
  averageMethodType: FormControl<string>;
  companyProfitEmissionsForm?: CompanyProfitEmissionsForm;
  investmentBuildingEmissionsForm?: InvestmentBuildingEmissionsForm;
  investmentUsingEmissionsForm?: InvestmentUsingEmissionsForm;
}>;

export type CompanyProfitEmissionsForm = FormGroup<{
  companyTotalIncome: FormControl<string>;
  equityShare: FormControl<string>;
  emissionFactor: FormControl<string>;
}>;

export type InvestmentBuildingEmissionsForm = FormGroup<{
  projectBuildingCost: FormControl<string>;
  percentageOfTotalExpenses: FormControl<string>;
  emissionFactor: FormControl<string>;
}>;

export type InvestmentUsingEmissionsForm = FormGroup<{
  projectProfit: FormControl<string>;
  percentageOfTotalExpenses: FormControl<string>;
  emissionFactor: FormControl<string>;
}>;

export type InitialInvestmentYearFormGroup = FormGroup<{
  predictedYearlyEmissions: FormControl<string>;
  predictedLifespanOfProject: FormControl<string>;
  percentageOfExpenses: FormControl<string>;
}>;
