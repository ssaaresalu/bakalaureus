import { Component } from '@angular/core';
import { PageComponentAbstract } from '../../shared/components/page-component-abstract';
import { TranslateModule } from '@ngx-translate/core';
import { RoundTonsPipe } from '../../shared/pipes/round-tons.pipe';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [TranslateModule, RoundTonsPipe],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent extends PageComponentAbstract {
  organisationEmissions = this.dataService.organizationEmissions$.value;

  showNextYear(): void {
    if (
      this.currentYearIndex <
      this.organisationEmissions.organizationEmissionsYearlyInfo.length - 1
    )
      this.currentYearIndex++;
  }

  showPrevYear(): void {
    if (this.currentYearIndex > 0) this.currentYearIndex--;
  }
}
