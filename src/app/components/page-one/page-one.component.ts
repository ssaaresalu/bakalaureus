import { Component } from '@angular/core';
import { IntroductoryComponent } from './sub-page-one/introductory/introductory.component';
import { OrganizationComponent } from './sub-page-one/organization/organization.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-page-one',
  standalone: true,
  imports: [IntroductoryComponent, OrganizationComponent, TranslateModule],
  templateUrl: './page-one.component.html',
})
export class PageOneComponent {}
