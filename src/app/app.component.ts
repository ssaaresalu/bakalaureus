import { Component, inject, OnInit } from '@angular/core';
import { DataService } from './shared/services/data.service';
import { LanguageService } from './shared/services/language.service';
import { Pages } from './enums/pages.enum';
import {Observable} from "rxjs";
import {SpinnerService} from "./shared/services/spinner.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'bakalaureus';
  protected readonly Pages = Pages;


  private dataService = inject(DataService);
  private langService = inject(LanguageService);
  private spinnerService = inject(SpinnerService);
  pageIndex = 0;

  ngOnInit(): void {
    this.langService.setLanguage();
    this.dataService.initLists()
  }

  nextPage() {
    if (this.pageIndex < 4) {
      this.pageIndex++;
    }
  }

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  public get showSpinner(): Observable<number> {
    return this.spinnerService.activeSpinners.asObservable();
  }
}
