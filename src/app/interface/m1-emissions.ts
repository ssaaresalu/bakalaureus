import { EmissionsDetails } from './emissions-details';

export interface M1YearlyInfo {
  energy?: EmissionsDetails[];
  vehicleFuels1?: EmissionsDetails[];
  vehicleFuels2?: EmissionsDetails[];
  vehicleFuels3?: EmissionsDetails[];
  dispersedEmissions?: EmissionsDetails[];
  totalEnergyEmissions?: number;
  totalVehicleEmissions?: number;
  totalDispersedEmissions?: number;
  totalEmissions?: number;
}
