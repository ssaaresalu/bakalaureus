import { ListValueItem } from './list-value-item';

export interface EmissionLists {
  energy: ListValueItem[];
  vehicleFuels1: ListValueItem[];
  vehicleFuels2: ListValueItem[];
  vehicleFuels3: ListValueItem[];
  dispersedEmissions: ListValueItem[];
  boughtElectricalEnergy: ListValueItem[];
  boughtHeatEnergy: ListValueItem[];
  vans: ListValueItem[];
  rigidTruckMean: ListValueItem[];
  rigidTruckTonsFull: ListValueItem[];
  rigidTruckTonsHalf: ListValueItem[];
  articulatedTruckMean: ListValueItem[];
  articulatedTruckFull: ListValueItem[];
  articulatedTruckHalf: ListValueItem[];
  articulatedRigidMean: ListValueItem[];
  articulatedRigidFull: ListValueItem[];
  articulatedRigidHalf: ListValueItem[];
  transportBus: ListValueItem[];
  trains: ListValueItem[];
  planes: ListValueItem[];
  ships: ListValueItem[];
  businessTripsSmall: ListValueItem[];
  businessTripsBig: ListValueItem[];
  workHomeSmallVehicle: ListValueItem[];
  workHomeBigVehicle: ListValueItem[];
  waste: ListValueItem[];
  capacity: ListValueItem[];
}
