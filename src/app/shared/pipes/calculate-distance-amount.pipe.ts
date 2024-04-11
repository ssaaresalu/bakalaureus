import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateDistanceAmount',
  standalone: true,
})
export class CalculateDistanceAmountPipe implements PipeTransform {
  transform(productAmount?: string, distance?: string): number {
    if (productAmount && distance) {
      return +productAmount * +distance;
    }
    return 0;
  }
}
