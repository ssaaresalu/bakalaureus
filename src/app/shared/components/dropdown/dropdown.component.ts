import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { ListValueItem } from '../../../interface/list-value-item';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent implements OnChanges {
  @Input() simpleList: string[] = [];
  @Input() emissionList: ListValueItem[] = [];
  @Input() control = new FormControl<string>('', { nonNullable: true });
  @ViewChild('dropdown') dropdown?: NgbDropdown;
  @Input() chosenArea = '';
  @Output() chosenValue = new EventEmitter<string>();
  filteredList: string[] = [];

  ngOnChanges() {
    if (this.simpleList.length > 0) {
      if (this.chosenArea !== '') {
        this.filterList();
      } else this.filteredList = this.simpleList;
    } else {
      this.emissionList
        ? (this.filteredList = this.emissionList.map(
            (emission) => emission.label,
          ))
        : [];
    }
  }

  filterList(): void {
    this.filteredList = this.simpleList.filter((item) =>
      item.startsWith(this.chosenArea),
    );
  }

  select(item: string): void {
    this.control.setValue(item);
    this.chosenValue.emit(item);
  }
}
