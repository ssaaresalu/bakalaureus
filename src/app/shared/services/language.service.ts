import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  activeLanguage = new Subject<string>();

  private translateService = inject(TranslateService);

  constructor() {}

  setLanguage(lang?: string): void {
    if (lang) {
      this.translateService.setDefaultLang(lang);
      this.translateService.use(lang);
      localStorage.setItem('lang', lang);
    } else {
      this.translateService.setDefaultLang('ee');
      this.translateService.use('ee');
      localStorage.setItem('lang', 'ee');
    }
  }
}
