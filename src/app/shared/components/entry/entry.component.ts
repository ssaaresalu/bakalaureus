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
import { WORK_HOME_TYPES } from '../../../util/lists';

@Component({
  selector: 'app-entry',
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
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.css',
})
export class EntryComponent extends PageComponentAbstract implements OnInit {
  protected readonly WORK_HOME_TYPES = WORK_HOME_TYPES;
  @Input() formGroup!: DetailsForm;
  @Input()
  transportFormGroup!: TransportDetailsForm;
  @Input() emissionList!: ListValueItem[];
  @Input() translationPrefix = '';
  @Input() year!: string;
  @Input() isDispersedEmissions = false;
  @Input() isTransport = false;
  @Input() capacityListName = '';
  @Input() isWorkHomeForm = false;
  @Input() isDistanceLabel = false;
  @Input() isWasteMass = false;

  constructor(
    fb: NonNullableFormBuilder,
    private pipe: GetListByCapacityPipe,
  ) {
    super(fb);
  }

  ngOnInit(): void {
    if (this.isTransport) {
      if (this.transportFormGroup.controls.capacity) {
        if (!this.transportFormGroup.controls.capacity.value)
          this.emissionList = [];
        else {
          this.emissionList = this.pipe.transform(
            this.capacityListName,
            this.transportFormGroup.controls.capacity.value,
          );
          this.subscribeToTransportFormGroupFields(
            this.transportFormGroup,
            this.destroy$,
            this.emissionList,
          );
        }
        this.transportFormGroup.controls.capacity.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((capacity) => {
            this.transportFormGroup.controls.type.setValue('');
            this.emissionList = this.pipe.transform(
              this.capacityListName,
              capacity,
            );
            this.subscribeToTransportFormGroupFields(
              this.transportFormGroup,
              this.destroy$,
              this.emissionList,
            );
          });
      }
    }
  }
}
