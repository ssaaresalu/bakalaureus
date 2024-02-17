import { Component } from '@angular/core';
import {LanguageSelectionComponent} from "./language-selection/language-selection.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LanguageSelectionComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {}
