import { EmissionsDetails } from './emissions-details';

export interface M2Emissions {
  yearlyInfo: M2YearlyInfo[];
}

export interface M2YearlyInfo {
  year: string;
  boughtElectricalEnergy: EmissionsDetails[];
  boughtHeatEnergy: EmissionsDetails[];
}
