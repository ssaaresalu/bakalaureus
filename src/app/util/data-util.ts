import { EmissionLists } from '../interface/emission-lists';
import { ListValueItem } from '../interface/list-value-item';

export const emptyEmissionLists: EmissionLists = {
  articulatedRigidFull: [],
  articulatedRigidHalf: [],
  articulatedRigidMean: [],
  articulatedTruckFull: [],
  articulatedTruckHalf: [],
  articulatedTruckMean: [],
  businessTripsBig: [],
  businessTripsSmall: [],
  planes: [],
  rigidTruckMean: [],
  rigidTruckTonsFull: [],
  rigidTruckTonsHalf: [],
  ships: [],
  trains: [],
  transportBus: [],
  vans: [],
  waste: [],
  workHomeBigVehicle: [],
  workHomeSmallVehicle: [],
  boughtElectricalEnergy: [],
  boughtHeatEnergy: [],
  dispersedEmissions: [],
  energy: [],
  vehicleFuels1: [],
  vehicleFuels2: [],
  vehicleFuels3: [],
  capacity: [],
};

export function getUserLanguage(): string {
  try {
    const localLanguage = localStorage.getItem('lang');
    if (localLanguage) return localLanguage;
    localStorage.setItem('lang', 'ee');
    return 'ee';
  } catch (error) {
    console.error('error getting language' + JSON.stringify(error));
    localStorage.setItem('lang', 'ee');
    return 'ee';
  }
}

export function getLanguageCode(language: string): string {
  switch (language) {
    case 'Eesti':
      return 'ee';
    case 'English':
      return 'en';
    default:
      return '';
  }
}

export function getLanguageBasedOnCode(code: string): string {
  switch (code) {
    case 'ee':
      return 'Eesti';
    case 'en':
      return 'English';
    default:
      return '';
  }
}

export function getListItemValue(label: string, list: ListValueItem[]): number {
  return list.find((item) => item.label === label)?.value ?? 0;
}

export function getFootprintInKilos(
  factor?: number | string,
  amount?: string,
): number {
  return Math.round(+(amount ?? '') * +(factor ?? '') * 1e3) / 1e3;
}

export function getFootprintInKilosTransport(
  factor?: number | string,
  totalDistanceAmount?: number,
) {
  return Math.round(+(totalDistanceAmount ?? '') * +(factor ?? '') * 1e3) / 1e3;
}
