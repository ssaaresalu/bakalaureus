import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-introductory',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './introductory.component.html',
  styleUrl: './introductory.component.css',
})
export class IntroductoryComponent {}
