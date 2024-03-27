import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent implements OnChanges {
  @Input() list: string[] = [];
  @Input() control = new FormControl<string>('', { nonNullable: true });
  @ViewChild('dropdown') dropdown?: NgbDropdown;
  @Input() chosenArea = '';
  filteredList: string[] = [];

  ngOnChanges() {
    if (this.chosenArea !== '') {
      this.filterList();
    } else this.filteredList = this.list;
  }

  filterList(): void {
    this.filteredList = this.list.filter((item) =>
      item.startsWith(this.chosenArea),
    );
  }

  select(item: string): void {
    this.control.setValue(item);
  }
}
