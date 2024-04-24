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
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { TransportDetailsForm } from '../../interface/m3-transport-form';
import { EmissionsDetails } from '../../interface/emissions-details';
import { TransportEmissions } from '../../interface/m3-transport-emissions';

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
    const typeChanges$ = formControl.controls.type.valueChanges.pipe(
      startWith(formControl.controls.type.value),
    );
    const amountChanges$ =
      formControl.controls.amountOrDistance.valueChanges.pipe(
        startWith(formControl.controls.amountOrDistance.value),
      );
    const isUsingModelEmissionFactorChanges$ =
      formControl.controls.isUsingModelEmissionFactor.valueChanges.pipe(
        startWith(formControl.controls.isUsingModelEmissionFactor.value),
      );
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
    const distanceChanges$ = formControl.controls.distance.valueChanges.pipe(
      startWith(formControl.controls.distance.value),
    );
    const isUsingModelEmissionFactorChanges$ =
      formControl.controls.isUsingModelEmissionFactor.valueChanges.pipe(
        startWith(formControl.controls.isUsingModelEmissionFactor.value),
      );
    const otherEmissionFactorChanges$ =
      formControl.controls.otherEmissionFactor.valueChanges.pipe(
        startWith(formControl.controls.otherEmissionFactor.value),
      );
    const typeChanges$ = formControl.controls.type.valueChanges.pipe(
      startWith(formControl.controls.type.value),
    );
    if (formControl.controls.capacity)
      typeChanges$.pipe(takeUntil(formControl.controls.capacity.valueChanges));
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
        ),
        takeUntil(destroy$),
      )
      .subscribe((values) => {
        const [
          type,
          isUsingModelEmissionFactor,
          otherEmissionFactor,
          distance,
          totalDistance,
        ] = values;
        if (!list) list = [];
        const value = getListItemValue(type, list);
        formControl.controls.emissionFactor.setValue(value);
        const emissionFactor = isUsingModelEmissionFactor
          ? formControl.controls.emissionFactor.value
          : otherEmissionFactor;
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
      const distanceChanges$ = formControl.controls.distance.valueChanges.pipe(
        startWith(formControl.controls.distance.value),
      );
      const productChanges$ =
        formControl.controls.productAmount.valueChanges.pipe(
          startWith(formControl.controls.productAmount.value),
        );
      distanceChanges$
        .pipe(combineLatestWith(productChanges$), takeUntil(destroy$))
        .subscribe(([distance, productAmount]) => {
          formControl.controls.totalDistanceProductAmount?.setValue(
            +distance * +productAmount,
          );
        });
    }
  }

  addNewDetailsFormGroup(isDispersedEmissions?: boolean): DetailsForm {
    return new FormGroup({
      unitNumber: this.fb.control<string>(''),
      type: this.fb.control<string>(''),
      amountOrDistance: this.fb.control<string | undefined>(undefined),
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(
        isDispersedEmissions ? true : undefined,
      ),
      emissionFactor: this.fb.control<number>(0),
      otherEmissionFactor: this.fb.control<string | undefined>(undefined),
      kgCO2Footprint: this.fb.control<number>(0),
    });
  }

  getDetailsFormValues(
    formDetails: FormArray<DetailsForm>,
  ): EmissionsDetails[] {
    return formDetails.controls.map((formDet) => {
      return {
        unitNumber: formDet.value.unitNumber ?? '',
        type: formDet.value.type ?? '',
        emissionFactor: formDet.value.emissionFactor ?? 0,
        kgCO2Footprint: formDet.value.kgCO2Footprint ?? 0,
        isUsingModelEmissionsFactor:
          formDet.value.isUsingModelEmissionFactor ?? undefined,
        otherEmissionFactor: formDet.value.otherEmissionFactor ?? '',
        amountOrDistance: formDet.value.amountOrDistance ?? '',
      };
    });
  }

  addDataDetailsToForm(
    list: ListValueItem[],
    details: EmissionsDetails,
    isWorkHome?: boolean,
  ): DetailsForm {
    const newForm = new FormGroup({
      unitNumber: this.fb.control<string>(details.unitNumber ?? ''),
      type: this.fb.control<string>(details.type ?? ''),
      amountOrDistance: this.fb.control<string | undefined>(
        details.amountOrDistance ?? undefined,
      ),
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(
        details.isUsingModelEmissionsFactor ?? undefined,
      ),
      emissionFactor: this.fb.control<number>(details.emissionFactor ?? 0),
      otherEmissionFactor: this.fb.control<string | undefined>(
        details.otherEmissionFactor ?? undefined,
      ),
      kgCO2Footprint: this.fb.control<number>(details.kgCO2Footprint ?? 0),
    }) as DetailsForm;
    if (isWorkHome) {
      newForm.addControl(
        'workHomeType',
        this.fb.control<string>(details.workHomeType ?? ''),
      );
    }
    const destroy$ = new Subject<void>();
    //this.formSubjects.get(controlName)?.set(index, destroy$);
    this.subscribeToFormGroupFields(newForm, list, destroy$);
    return newForm;
  }

  addTransportDataDetailsToForm(
    details: TransportEmissions,
    hasAmount: boolean,
    hasCapacity: boolean,
    list?: ListValueItem[],
  ): TransportDetailsForm {
    const newForm = new FormGroup({
      unitNumber: this.fb.control<string>(details.unitNumber ?? ''),
      type: this.fb.control<string>(details.type ?? ''),
      distance: this.fb.control<string>(details.distance ?? ''),
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(
        details.isUsingModelEmissionFactor ?? undefined,
      ),
      emissionFactor: this.fb.control<number>(details.emissionFactor ?? 0),
      otherEmissionFactor: this.fb.control<string>(
        details.otherEmissionFactor ?? '',
      ),
      kgCO2Footprint: this.fb.control<number>(details.kgCO2Footprint ?? 0),
    }) as TransportDetailsForm;
    if (hasAmount) {
      newForm.addControl(
        'productAmount',
        this.fb.control<string>(details.productAmount ?? ''),
      );
      newForm.addControl(
        'totalDistanceProductAmount',
        this.fb.control<number>(details.totalDistanceProductAmount ?? 0),
      );
      if (hasCapacity) {
        newForm.addControl(
          'capacity',
          this.fb.control<string>(details.capacity ?? ''),
        );
      }
    }
    const destroy$ = new Subject<void>();
    this.subscribeToTransportFormGroupFields(newForm, destroy$, list);
    return newForm;
  }

  getTransportDetailsFormValues(
    formDetails: FormArray<TransportDetailsForm>,
  ): TransportEmissions[] {
    const transportData = [] as TransportEmissions[];
    formDetails.controls.forEach((dataForm) => {
      const data = dataForm.getRawValue();
      const strCap = data.capacity?.trim();
      if (strCap && strCap.length === 0) {
        delete data.capacity;
      }
      const strAmount = data.productAmount?.trim();
      if (strAmount && strAmount.length === 0) {
        delete data.productAmount;
      }
      if (
        data.totalDistanceProductAmount &&
        data.totalDistanceProductAmount === 0
      ) {
        delete data.totalDistanceProductAmount;
      }
      transportData.push(data);
    });
    return transportData;
  }
}
