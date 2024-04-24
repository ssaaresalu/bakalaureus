export interface M3TransportEmissions {
  yearlyInfo: M3TransportYearlyInfo[];
}

export interface M3TransportYearlyInfo {
  year?: string;
  vans?: TransportEmissions[];
  rigidTrucks?: TransportEmissions[];
  articulatedTrucks?: TransportEmissions[];
  articulatedRigidTrucks?: TransportEmissions[];
  transportBus?: TransportEmissions[];
  trains?: TransportEmissions[];
  planes?: TransportEmissions[];
  ships?: TransportEmissions[];
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
