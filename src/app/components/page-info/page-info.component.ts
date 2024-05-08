import { Component, Input } from '@angular/core';
import { Pages } from '../../enums/pages.enum';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectionComponent } from '../footer/language-selection/language-selection.component';

@Component({
  selector: 'app-page-info',
  standalone: true,
  imports: [TranslateModule, LanguageSelectionComponent],
  templateUrl: './page-info.component.html',
  styleUrl: './page-info.component.css',
})
export class PageInfoComponent {
  @Input() pageIndex!: number;
  protected readonly Pages = Pages;
}
