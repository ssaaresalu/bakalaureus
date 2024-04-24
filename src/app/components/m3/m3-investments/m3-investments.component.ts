import { Component, Input } from '@angular/core';
import { InvestmentsForm } from '../../../interface/m3-other-items-form';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { TranslateModule } from '@ngx-translate/core';
import { PageComponentAbstract } from '../../../shared/components/page-component-abstract';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AVERAGE_INVESTMENT_CALCULATION_METHODS,
  INVESTMENT_CALCULATION_METHODS,
} from '../../../util/lists';
import { RoundTonsPipe } from '../../../shared/pipes/round-tons.pipe';

@Component({
  selector: 'app-m3-investments',
  standalone: true,
  imports: [
    DropdownComponent,
    TranslateModule,
    ReactiveFormsModule,
    RoundTonsPipe,
  ],
  templateUrl: './m3-investments.component.html',
  styleUrl: './m3-investments.component.css',
})
export class M3InvestmentsComponent extends PageComponentAbstract {
  @Input() investmentForm!: InvestmentsForm;
  @Input() year!: string;
  protected readonly INVESTMENT_CALCULATION_METHODS =
    INVESTMENT_CALCULATION_METHODS;
  protected readonly AVERAGE_INVESTMENT_CALCULATION_METHODS =
    AVERAGE_INVESTMENT_CALCULATION_METHODS;
}
