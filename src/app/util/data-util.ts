import { EmissionLists } from '../interface/emission-lists';

export const emptyEmissionLists: EmissionLists = {
  boughtElectricalEnergy: [],
  boughtHeatEnergy: [],
  dispersedEmissions: [],
  energy: [],
  vehicleFuels1: [],
  vehicleFuels2: [],
  vehicleFuels3: [],
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
