import { EmissionsDetails } from './emissions-details';

export interface M1Emissions {
  yearlyInfo: M1YearlyInfo[];
}

export interface M1YearlyInfo {
  year?: string;
  energy?: EmissionsDetails[];
  vehicleFuels1?: EmissionsDetails[];
  vehicleFuels2?: EmissionsDetails[];
  vehicleFuels3?: EmissionsDetails[];
  dispersedEmissions?: EmissionsDetails[];
}
