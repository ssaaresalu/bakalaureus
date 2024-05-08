import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http'; // Import HttpClientModule
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/footer/footer.component';
import { PageOneComponent } from './components/page-one/page-one.component';
import { M1PageComponent } from './components/m1-page/m1-page.component';
import { ApiRequestInterceptor } from './shared/api-request.interceptor';
import { M2PageComponent } from './components/m2-page/m2-page.component';
import { M3TransportPageComponent } from './components/m3/transport/m3-transport-page.component';
import { GetListByCapacityPipe } from './shared/pipes/get-list-by-capacity.pipe';
import { M3PageTwoComponentComponent } from './components/m3/m3-page-two-component/m3-page-two-component.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { ResultsComponent } from './components/results/results.component';
import { PageInfoComponent } from './components/page-info/page-info.component';
import { LanguageSelectionComponent } from './components/footer/language-selection/language-selection.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule, // Added this line
    MatToolbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'ee',
    }),
    NgbModule,
    FooterComponent,
    PageOneComponent,
    M1PageComponent,
    M2PageComponent,
    M3TransportPageComponent,
    M3PageTwoComponentComponent,
    ProgressBarComponent,
    BrowserAnimationsModule,
    ResultsComponent,
    PageInfoComponent,
    LanguageSelectionComponent,
  ],
  providers: [
    provideAnimations(),
    GetListByCapacityPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiRequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: [AppComponent],
})
export class AppModule {}
