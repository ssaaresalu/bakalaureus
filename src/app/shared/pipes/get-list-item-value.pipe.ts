import { Pipe, PipeTransform } from '@angular/core';
import { ListValueItem } from '../../interface/list-value-item';

@Pipe({
  name: 'getListItemValue',
  standalone: true,
})
export class GetListItemValuePipe implements PipeTransform {
  transform(list: ListValueItem[], label: string): number {
    return list.find((item) => item.label === label)?.value ?? 0;
  }
}
