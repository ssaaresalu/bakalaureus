export interface EmissionsDetails {
  unitNumber: string;
  type: string;
  amountOrDistance?: string;
  isUsingModelEmissionsFactor?: boolean;
  emissionFactor: number;
  otherEmissionFactor?: string;
  kgCO2Footprint: number;
  workHomeType?: string;
}
