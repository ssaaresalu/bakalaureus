import { Component, inject, OnInit } from '@angular/core';
import { DataService } from './shared/services/data.service';
import { LanguageService } from './shared/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'bakalaureus';

  private dataService = inject(DataService);
  private langService = inject(LanguageService);

  ngOnInit(): void {
    console.log('hi');
    this.langService.setLanguage();
  }
}
