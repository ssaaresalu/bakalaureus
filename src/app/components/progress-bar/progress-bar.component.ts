import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [NgForOf, NgClass, TranslateModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent {
  protected dataService = inject(DataService);
  @Input() pageIndex = 0;
  @Output() pageIdEmitter = new EventEmitter<number>();

  navigate(i: number): void {
    if (
      this.pageIndex === 0 &&
      this.dataService.organizationData$.value === null
    )
      return;
    this.pageIndex = i;
    this.pageIdEmitter.emit(i);
  }

  calculateWidth(): string {
    return `${((this.pageIndex + 1) / 6) * 100}%`;
  }
}
