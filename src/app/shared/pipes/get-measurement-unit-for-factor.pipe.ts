import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getMeasurementUnitForFactor',
  standalone: true,
})
export class GetMeasurementUnitForFactorPipe implements PipeTransform {
  transform(type?: string): string {
    if (!type) return '';
    if (type.endsWith('(kWh)')) {
      return 'kg CO₂ ekv/kWh';
    }
    if (type.endsWith('(kg)')) {
      return 'kg CO₂ ekv/kg';
    }
    if (type.endsWith('(mᶟ)')) {
      return 'kg CO₂ ekv/mᶟ';
    }
    if (type.endsWith('(l)')) {
      return 'kg CO₂ ekv/l';
    }
    if (type.endsWith('tonn-km')) {
      return 'kg CO₂ ekv/tonn-km';
    }
    if (type.endsWith('km')) {
      return 'kg CO₂ ekv/km';
    }
    if (type === '') return '';
    return '';
  }
}
