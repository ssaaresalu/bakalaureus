import { inject, Injectable } from '@angular/core';
import { GHGFootprintApiService } from './ghgfootprint-api.service';
import { BehaviorSubject } from 'rxjs';
import { EmissionLists } from '../../interface/emission-lists';
import { emptyEmissionLists } from '../../util/data-util';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  ghgFootPrintApiService = inject(GHGFootprintApiService);
  _emissionLists = new BehaviorSubject<EmissionLists>(emptyEmissionLists);
  _currentLang = new BehaviorSubject<string>('');
  lang$ = this._currentLang.asObservable();

  private translateService = inject(TranslateService);

  constructor() {}
}
