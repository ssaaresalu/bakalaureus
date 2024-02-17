import { Component, inject, OnInit } from '@angular/core';
import {
  getLanguageBasedOnCode,
  getLanguageCode,
  getUserLanguage,
} from '../../../util/data-util';
import { LanguageService } from '../../../shared/services/language.service';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { NgForOf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selection',
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgForOf,
    TranslateModule,
  ],
  templateUrl: './language-selection.component.html',
  styleUrl: './language-selection.component.css',
})
export class LanguageSelectionComponent implements OnInit {
  activeLanguage: string = '';
  availableLanguages: string[] = [];
  shownLanguage = '';

  private languageService = inject(LanguageService);

  ngOnInit(): void {
    this.handleLanguages();
  }

  private handleLanguages(): void {
    this.activeLanguage = getUserLanguage();
    this.availableLanguages =
      this.activeLanguage === 'ee' ? ['English'] : ['Eesti'];
    this.shownLanguage = getLanguageBasedOnCode(this.activeLanguage);
  }

  protected useLanguage(selectedLang: string): void {
    this.languageService.setLanguage(getLanguageCode(selectedLang));
    this.handleLanguages();
  }
}
