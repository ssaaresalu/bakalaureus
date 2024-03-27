import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-year-picker',
  standalone: true,
  imports: [
    FormsModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    TranslateModule,
  ],
  templateUrl: './year-picker.component.html',
  styleUrl: './year-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: YearPickerComponent,
      multi: true,
    },
  ],
})
export class YearPickerComponent implements OnInit, ControlValueAccessor {
  years: number[] = [];
  selectedYear: number | null = null;
  @Output() yearChanged = new EventEmitter<number>();

  onChange: (i: number) => void = () => {};
  onTouched: (i: number) => void = () => {};

  ngOnInit(): void {
    this.generateYears();
  }

  writeValue(value: number): void {
    this.selectedYear = value;
  }
  registerOnChange(fn: (i: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: (i: number) => void): void {
    this.onTouched = fn;
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 3;

    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  selectYear(year: number) {
    this.selectedYear = year;
    this.onChange(year);
    this.yearChanged.emit(year);
  }
}
