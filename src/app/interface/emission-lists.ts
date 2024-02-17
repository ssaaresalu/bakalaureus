import { ListValueItem } from './list-value-item';

export interface EmissionLists {
  energy: ListValueItem[];
  vehicleFuels1: ListValueItem[];
  vehicleFuels2: ListValueItem[];
  vehicleFuels3: ListValueItem[];
  dispersedEmissions: ListValueItem[];
  boughtElectricalEnergy: ListValueItem[];
  boughtHeatEnergy: ListValueItem[];
}
