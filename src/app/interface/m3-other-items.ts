import { EmissionsDetails } from './emissions-details';

export interface M3OtherItems {
  yearlyInfo: M3OtherItemsYearlyInfo[];
}

export interface M3OtherItemsYearlyInfo {
  year: string;
  businessTripsSmall: EmissionsDetails[];
  businessTripsLarge: EmissionsDetails[];
  workHomeTransportSmall: EmissionsDetails[];
  workHomeTransportLarge: EmissionsDetails[];
  waste: EmissionsDetails[];
  homeOffice: HomeOfficeEmissions[];
  products: ProductsEmissions[];
  vehicleFuels: VehicleFuelEmissions[];
  diffuseEmissions: DiffuseEmissions[];
  investments: Investments[];
}

export interface HomeOfficeEmissions {
  unitNumber: string;
  usedDevice: string;
  amountOfDevices: string;
  deviceElectricityAmount: string;
  amountOfHours: string;
  electricityPackage: string;
  amount_kWh: number;
  isUsingModelEmissionFactor: boolean | undefined;
  emissionFactor: number;
  otherEmissionFactor: string | undefined;
  kgCO2Footprint: number;
}

export interface ProductsEmissions {
  soldOrBought: string;
  unitNumber: string;
  product: string;
  amount: string;
  price: string;
  emissionFactor: string;
  kgCO2Footprint: number;
}

export interface VehicleFuelEmissions {
  vehicleFuelsType: string;
  unitNumber: string;
  fuel: string;
  amount: string;
  distance: string;
  emissionFactor: string;
  kgCO2Footprint: number;
}

export interface DiffuseEmissions {
  unitNumber: string;
  sourceOfEmission: string;
  amount: string;
  unit: string;
  emissionFactor: string;
  kgCO2Footprint: number;
}

export interface Investments {
  unitNumber: string;
  investment: string;
  calculationMethod: string;
  investmentMethod?: InvestmentMethod;
  averageMethod?: AverageMethod;
  initialInvestmentYear?: InitialInvestmentYear;
  kgCO2Footprint: number;
}

export interface InvestmentMethod {
  M1_M2_emissions: string;
  percentageOfExpenses: string;
  equityShare: string;
}
export interface AverageMethod {
  averageMethodType: string;
  companyProfitEmissionsForm?: CompanyProfit;
  investmentBuildingEmissionsForm?: InvestmentBuilding;
  investmentUsingEmissionsForm?: InvestmentUsing;
}
export interface CompanyProfit {
  companyTotalIncome: string;
  equityShare: string;
  emissionFactor: string;
}

export interface InvestmentBuilding {
  projectBuildingCost: string;
  percentageOfTotalExpenses: string;
  emissionFactor: string;
}

export interface InvestmentUsing {
  projectProfit: string;
  percentageOfTotalExpenses: string;
  emissionFactor: string;
}

export interface InitialInvestmentYear {
  predictedYearlyEmissions: string;
  predictedLifespanOfProject: string;
  percentageOfExpenses: string;
}
