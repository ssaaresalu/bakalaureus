import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundTons',
  standalone: true,
})
export class RoundTonsPipe implements PipeTransform {
  transform(footprint: string | number): number {
    return Math.round(+footprint * 0.001 * 1e3) / 1e3;
  }
}
