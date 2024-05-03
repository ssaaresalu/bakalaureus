import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [NgForOf, NgClass, TranslateModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent {
  @Input() pageIndex = 0;
  @Output() pageIdEmitter = new EventEmitter<number>();

  navigate(i: number) {
    this.pageIndex = i;
    this.pageIdEmitter.emit(i);
  }

  calculateWidth(): string {
    // Calculate percentage based on the current pageIndex (0-based index)
    return `${((this.pageIndex + 1) / 6) * 100}%`;
  }
}
