import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [NgForOf, NgClass, TranslateModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
})
export class ProgressBarComponent {
  @Input() pageIndex = 0;
  @Output() pageIdEmitter = new EventEmitter<number>();

  navigate(i: number) {
    if (i === 4) this.pageIdEmitter.emit(i + 1);
    this.pageIdEmitter.emit(i);
  }
}
