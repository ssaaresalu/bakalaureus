import { EmissionsDetails } from './emissions-details';

export interface M2YearlyInfo {
  boughtElectricalEnergy?: EmissionsDetails[];
  boughtHeatEnergy?: EmissionsDetails[];
  totalEmissions?: number;
  totalBoughtElectricalEnergyEmissions?: number;
  totalBoughtHeatEnergyEmissions?: number;
}
