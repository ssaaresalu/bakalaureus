import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateEmissions',
  standalone: true,
})
export class CalculateEmissionsPipe implements PipeTransform {
  transform(amount: string, factor: number | string, isTons?: boolean): number {
    const emissionsKg = +amount * +factor;
    const emissionsT = emissionsKg / 1000;
    return isTons ? emissionsT : emissionsKg;
  }
}
