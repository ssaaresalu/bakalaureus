import { Component, Input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ListValueItem } from '../../../interface/list-value-item';
import { RoundTonsPipe } from '../../pipes/round-tons.pipe';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { GetListItemValuePipe } from '../../pipes/get-list-item-value.pipe';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PageComponentAbstract } from '../page-component-abstract';
import { DetailsForm } from '../../../interface/details-form';
import { TransportDetailsForm } from '../../../interface/m3-transport-form';
import { CalculateDistanceAmountPipe } from '../../pipes/calculate-distance-amount.pipe';
import { takeUntil } from 'rxjs';
import { GetListByCapacityPipe } from '../../pipes/get-list-by-capacity.pipe';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [
    RoundTonsPipe,
    DropdownComponent,
    GetListItemValuePipe,
    MatIcon,
    TranslateModule,
    ReactiveFormsModule,
    CalculateDistanceAmountPipe,
    AsyncPipe,
  ],
  templateUrl: './row.component.html',
  styleUrl: './row.component.css',
})
export class RowComponent extends PageComponentAbstract implements OnInit {
  @Input() formGroup!: DetailsForm;
  @Input()
  transportFormGroup!: TransportDetailsForm;
  @Input() emissionList!: ListValueItem[];
  @Input() translationPrefix = '';
  @Input() year!: string;
  @Input() isDispersedEmissions = false;
  @Input() isTransport = false;
  @Input() capacityListName = '';
  capacityList$ = this.dataService.capacityList$;

  constructor(
    fb: NonNullableFormBuilder,
    private pipe: GetListByCapacityPipe,
  ) {
    super(fb);
  }

  ngOnInit(): void {
    if (this.isTransport) {
      if (this.transportFormGroup.controls.capacity) {
        this.transportFormGroup.controls.capacity.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((capacity) => {
            this.transportFormGroup.controls.type.setValue('');
            console.log(this.capacityListName);
            const newList = this.pipe.transform(
              this.capacityListName,
              capacity,
            );
            console.log(newList);
            this.capacityList$.next(newList);
            this.emissionList = newList;
          });
      } else this.capacityList$.next(this.emissionList);
    }
  }
}
