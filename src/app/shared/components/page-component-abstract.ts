import { Directive, inject, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import {
  combineLatestWith,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { DetailsForm } from '../../interface/details-form';
import { ListValueItem } from '../../interface/list-value-item';
import {
  getFootprintInKilos,
  getFootprintInKilosTransport,
  getListItemValue,
} from '../../util/data-util';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { TransportDetailsForm } from '../../interface/m3-transport-form';

@Directive()
export abstract class PageComponentAbstract implements OnDestroy {
  public currentYearIndex = 0;

  protected destroy$ = new Subject<void>();
  public dataService = inject(DataService);
  public emissionsLists = this.dataService.emissionsLists;
  public organizationData = this.dataService.organizationData;

  constructor(protected fb: NonNullableFormBuilder) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUnitsByYear(year: string): string[] {
    return (
      this.organizationData.yearlyInfo
        ?.filter((yearlyInfo) => yearlyInfo.year === year)
        .flatMap((yearlyInfo) => yearlyInfo.structuralUnits ?? [])
        .map((structuralUnit) => structuralUnit.number)
        .filter((number): number is string => number !== undefined) || []
    );
  }

  subscribeToFormGroupFields(
    formControl: DetailsForm,
    list: ListValueItem[],
    destroy$: Subject<void>,
  ): void {
    const typeChanges$ = formControl.controls.type.valueChanges;
    const amountChanges$ = formControl.controls.amountOrDistance.valueChanges;
    const isUsingModelEmissionFactorChanges$ =
      formControl.controls.isUsingModelEmissionFactor.valueChanges;
    const otherEmissionFactorChanges$ =
      formControl.controls.otherEmissionFactor.valueChanges.pipe(
        startWith(formControl.controls.otherEmissionFactor.value),
      );

    typeChanges$
      .pipe(
        combineLatestWith(
          isUsingModelEmissionFactorChanges$,
          otherEmissionFactorChanges$,
          amountChanges$,
        ),
        takeUntil(destroy$),
      )
      .subscribe(
        ([type, isUsingModelEmissionFactor, otherEmissionFactor, amount]) => {
          const value = getListItemValue(type, list);
          formControl.controls.emissionFactor.setValue(value);
          const emissionFactor = isUsingModelEmissionFactor
            ? formControl.controls.emissionFactor.value
            : otherEmissionFactor;

          const footprint = getFootprintInKilos(emissionFactor, amount);
          formControl.controls.kgCO2Footprint.setValue(footprint);
        },
      );
  }

  subscribeToTransportFormGroupFields(
    formControl: TransportDetailsForm,
    destroy$: Subject<void>,
    list?: ListValueItem[],
  ): void {
    if (!formControl.controls.productAmount) {
      this.subscribeToEmissionCalculation(formControl, destroy$, list);
    } else {
      this.subscribeToProductAmountChanges(formControl, destroy$);
      this.subscribeToEmissionCalculation(formControl, destroy$, list);
    }
  }

  subscribeToEmissionCalculation(
    formControl: TransportDetailsForm,
    destroy$: Subject<void>,
    list?: ListValueItem[],
  ): void {
    const distanceChanges$ = formControl.controls.distance.valueChanges;
    const isUsingModelEmissionFactorChanges$ =
      formControl.controls.isUsingModelEmissionFactor.valueChanges;
    const otherEmissionFactorChanges$ =
      formControl.controls.otherEmissionFactor.valueChanges.pipe(
        startWith(formControl.controls.otherEmissionFactor.value),
      );
    const typeChanges$ = formControl.controls.type.valueChanges;
    const totalDistanceProductChanges$ =
      formControl.controls.totalDistanceProductAmount?.valueChanges.pipe(
        startWith(formControl.controls.totalDistanceProductAmount?.value),
      ) ?? new Observable();
    typeChanges$
      .pipe(
        combineLatestWith(
          isUsingModelEmissionFactorChanges$,
          otherEmissionFactorChanges$,
          distanceChanges$,
          totalDistanceProductChanges$,
          this.dataService.capacityList$.asObservable(),
        ),
        takeUntil(destroy$),
      )
      .subscribe((values) => {
        console.log('hi');
        const [
          type,
          isUsingModelEmissionFactor,
          otherEmissionFactor,
          distance,
          totalDistance,
          latestList,
        ] = values;
        const effectiveList = latestList || list;
        if (!effectiveList) {
          return;
        }
        const value = getListItemValue(type, effectiveList);
        formControl.controls.emissionFactor.setValue(value);
        const emissionFactor = isUsingModelEmissionFactor
          ? formControl.controls.emissionFactor.value
          : otherEmissionFactor;
        console.log(formControl.controls.totalDistanceProductAmount, distance);
        const footprint = getFootprintInKilosTransport(
          emissionFactor,
          formControl.controls.totalDistanceProductAmount
            ? +totalDistance
            : +distance,
        );
        formControl.controls.kgCO2Footprint.setValue(footprint);
      });
  }

  subscribeToProductAmountChanges(
    formControl: TransportDetailsForm,
    destroy$: Subject<void>,
  ): void {
    if (
      formControl.controls.productAmount &&
      formControl.controls.totalDistanceProductAmount
    ) {
      const distanceChanges$ = formControl.controls.distance.valueChanges;
      const productChanges$ = formControl.controls.productAmount.valueChanges;
      distanceChanges$
        .pipe(combineLatestWith(productChanges$), takeUntil(destroy$))
        .subscribe(([distance, productAmount]) => {
          formControl.controls.totalDistanceProductAmount?.setValue(
            +distance * +productAmount,
          );
        });
    }
  }

  addNewDetailsFormGroup(): DetailsForm {
    return new FormGroup({
      unitNumber: this.fb.control<string>(''),
      type: this.fb.control<string>(''),
      amountOrDistance: this.fb.control<string | undefined>(undefined),
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(
        undefined,
      ),
      emissionFactor: this.fb.control<number>(0),
      otherEmissionFactor: this.fb.control<string | undefined>(undefined),
      kgCO2Footprint: this.fb.control<number>(0),
    });
  }
}
