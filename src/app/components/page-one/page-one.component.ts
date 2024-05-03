import { Component } from '@angular/core';
import { OrganizationComponent } from './sub-page-one/organization/organization.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-page-one',
  standalone: true,
  imports: [OrganizationComponent, TranslateModule],
  templateUrl: './page-one.component.html',
})
export class PageOneComponent {}
