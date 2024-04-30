export interface M3TransportYearlyInfo {
  vans?: TransportEmissions[];
  rigidTrucks?: TransportEmissions[];
  articulatedTrucks?: TransportEmissions[];
  articulatedRigidTrucks?: TransportEmissions[];
  transportBus?: TransportEmissions[];
  trains?: TransportEmissions[];
  planes?: TransportEmissions[];
  ships?: TransportEmissions[];
  totalEmissions?: number;
}

export interface TransportEmissions {
  unitNumber: string;
  capacity?: string;
  type: string;
  distance: string;
  productAmount?: string;
  totalDistanceProductAmount?: number;
  isUsingModelEmissionFactor: boolean | undefined;
  emissionFactor: number;
  otherEmissionFactor: string;
  kgCO2Footprint: number;
}
