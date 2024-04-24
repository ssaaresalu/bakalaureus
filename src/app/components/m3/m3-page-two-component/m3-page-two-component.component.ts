import { Component, OnInit } from '@angular/core';
import { PageComponentAbstract } from '../../../shared/components/page-component-abstract';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  AverageMethodFormGroup,
  CompanyProfitEmissionsForm,
  DiffuseEmissionsForm,
  HomeOfficeForm,
  InvestmentBuildingEmissionsForm,
  InvestmentMethodFormGroup,
  InvestmentsForm,
  InvestmentUsingEmissionsForm,
  M3OtherItemsForm,
  M3OtherItemsYearForm,
  ProductsForm,
  VehicleFuelsForm,
} from '../../../interface/m3-other-items-form';
import { combineLatestWith, startWith, Subject, takeUntil } from 'rxjs';
import { DetailsForm } from '../../../interface/details-form';
import { ListValueItem } from '../../../interface/list-value-item';
import { EntryComponent } from '../../../shared/components/entry/entry.component';
import { MatIcon } from '@angular/material/icon';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { GetListItemValuePipe } from '../../../shared/pipes/get-list-item-value.pipe';
import { RoundTonsPipe } from '../../../shared/pipes/round-tons.pipe';
import { getFootprintInKilos, getListItemValue } from '../../../util/data-util';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {
  BOUGHT_OR_SOLD,
  VEHICLE_FUELS_UPSTREAM_TYPES,
} from '../../../util/lists';
import { M3InvestmentsComponent } from '../m3-investments/m3-investments.component';
import {
  AverageMethod,
  DiffuseEmissions,
  HomeOfficeEmissions,
  Investments,
  M3OtherItemsYearlyInfo,
  ProductsEmissions,
  VehicleFuelEmissions,
} from '../../../interface/m3-other-items';
import { OrganisationEmissions } from '../../../interface/organisation-emissions';

@Component({
  selector: 'app-m3-page-two-component',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    EntryComponent,
    MatIcon,
    DropdownComponent,
    GetListItemValuePipe,
    RoundTonsPipe,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    M3InvestmentsComponent,
  ],
  templateUrl: './m3-page-two-component.component.html',
  styleUrl: './m3-page-two-component.component.css',
})
export class M3PageTwoComponentComponent
  extends PageComponentAbstract
  implements OnInit
{
  M3OtherItems =
    this.dataService.organizationEmissions$.value.M3_otherEmissions;
  M3OtherItemsForm = new FormGroup<M3OtherItemsForm>({
    yearlyInfo: new FormArray<M3OtherItemsYearForm>([]),
  });

  private businessTripsSmallFormSubjects: Map<number, Subject<void>> =
    new Map();
  private businessTripsLargeFormSubjects: Map<number, Subject<void>> =
    new Map();
  private workHomeSmallFormSubjects: Map<number, Subject<void>> = new Map();
  private workHomeLargeFormSubjects: Map<number, Subject<void>> = new Map();
  private wasteFormSubjects: Map<number, Subject<void>> = new Map();
  private homeOfficeFormSubjects: Map<number, Subject<void>> = new Map();
  private productsFormSubjects: Map<number, Subject<void>> = new Map();
  private vehicleFuelsFormSubjects: Map<number, Subject<void>> = new Map();
  private diffuseEmissionsFormSubjects: Map<number, Subject<void>> = new Map();
  private investmentFormSubjects: Map<number, Subject<void>> = new Map();

  homeOfficeElectricalList = this.emissionsLists.boughtElectricalEnergy.slice(
    0,
    3,
  );

  protected readonly BOUGHT_OR_SOLD = BOUGHT_OR_SOLD;
  protected readonly VEHICLE_FUELS_UPSTREAM_TYPES =
    VEHICLE_FUELS_UPSTREAM_TYPES;

  private formSubjects: Map<string, Map<number, Subject<void>>> = new Map([
    ['businessTripsSmall', this.businessTripsSmallFormSubjects],
    ['businessTripsLarge', this.businessTripsLargeFormSubjects],
    ['workHomeTransportSmall', this.workHomeSmallFormSubjects],
    ['workHomeTransportLarge', this.workHomeLargeFormSubjects],
    ['waste', this.wasteFormSubjects],
    ['homeOffice', this.homeOfficeFormSubjects],
    ['products', this.productsFormSubjects],
    ['vehicleFuels', this.vehicleFuelsFormSubjects],
    ['diffuseEmissions', this.diffuseEmissionsFormSubjects],
    ['investments', this.investmentFormSubjects],
  ]);

  ngOnInit(): void {
    this.initYearlyInfoForm();
    this.addValuesToForms();
  }

  submit() {
    this.dataService.saveFields(this.savedFootprintData);
  }

  protected get savedFootprintData(): OrganisationEmissions {
    return {
      ...this.dataService.organizationEmissions$.value,
      M3_otherEmissions: {
        yearlyInfo: this.getYearlyInfoValues(),
      },
    };
  }

  private getYearlyInfoValues(): M3OtherItemsYearlyInfo[] {
    return this.M3OtherItemsForm.controls.yearlyInfo.controls.map(
      (yearlyInfoForm) => {
        return {
          ...yearlyInfoForm.value,
          year: yearlyInfoForm.value.year ?? '',
          businessTripsSmall: this.getDetailsFormValues(
            yearlyInfoForm.controls.businessTripsSmall,
          ),
          businessTripsLarge: this.getDetailsFormValues(
            yearlyInfoForm.controls.businessTripsLarge,
          ),
          workHomeTransportSmall: this.getDetailsFormValues(
            yearlyInfoForm.controls.workHomeTransportSmall,
          ),
          workHomeTransportLarge: this.getDetailsFormValues(
            yearlyInfoForm.controls.workHomeTransportLarge,
          ),
          waste: this.getDetailsFormValues(yearlyInfoForm.controls.waste),
          homeOffice: this.getHomeOfficeValues(
            yearlyInfoForm.controls.homeOffice,
          ),
          products: this.getProductsValues(yearlyInfoForm.controls.products),
          vehicleFuels: this.getVehicleFuelsValues(
            yearlyInfoForm.controls.vehicleFuels,
          ),
          diffuseEmissions: this.getDiffuseEmissionsValues(
            yearlyInfoForm.controls.diffuseEmissions,
          ),
          investments: this.getInvestmentsValues(
            yearlyInfoForm.controls.investments,
          ),
        };
      },
    );
  }

  private addValuesToForms(): void {
    this.M3OtherItems.yearlyInfo.forEach((yearlyInfo) => {
      const M3OtherItemsYearForm =
        this.M3OtherItemsForm.controls.yearlyInfo.controls.find(
          (yearForm) => yearForm.controls.year.value === yearlyInfo.year,
        );
      yearlyInfo.businessTripsSmall?.forEach((smallTrip) =>
        M3OtherItemsYearForm?.controls.businessTripsSmall.push(
          this.addDataDetailsToForm(
            this.emissionsLists.businessTripsSmall,
            smallTrip,
          ),
        ),
      );
      yearlyInfo.businessTripsLarge?.forEach((largeTrip) =>
        M3OtherItemsYearForm?.controls.businessTripsLarge.push(
          this.addDataDetailsToForm(
            this.emissionsLists.businessTripsBig,
            largeTrip,
          ),
        ),
      );
      yearlyInfo.workHomeTransportSmall?.forEach((workHomeSmall) =>
        M3OtherItemsYearForm?.controls.workHomeTransportSmall.push(
          this.addDataDetailsToForm(
            this.emissionsLists.workHomeSmallVehicle,
            workHomeSmall,
          ),
        ),
      );
      yearlyInfo.workHomeTransportLarge?.forEach((workHomeLarge) =>
        M3OtherItemsYearForm?.controls.workHomeTransportLarge.push(
          this.addDataDetailsToForm(
            this.emissionsLists.workHomeBigVehicle,
            workHomeLarge,
          ),
        ),
      );
      yearlyInfo.waste?.forEach((wasteData) =>
        M3OtherItemsYearForm?.controls.waste.push(
          this.addDataDetailsToForm(this.emissionsLists.waste, wasteData),
        ),
      );
      yearlyInfo.homeOffice?.forEach((homeOffice) =>
        this.addHomeOfficeField(M3OtherItemsYearForm, homeOffice),
      );
      yearlyInfo.products?.forEach((product) =>
        this.addProductField(M3OtherItemsYearForm, product),
      );
      yearlyInfo.vehicleFuels?.forEach((vehicle) =>
        this.addVehicleFuelsField(M3OtherItemsYearForm, vehicle),
      );
      yearlyInfo.diffuseEmissions?.forEach((diffuseEmission) =>
        this.addDiffuseEmissionField(M3OtherItemsYearForm, diffuseEmission),
      );
      yearlyInfo.investments?.forEach((investment) =>
        this.addInvestmentField(M3OtherItemsYearForm, investment),
      );
    });
  }

  private initYearlyInfoForm() {
    this.organizationData.yearlyInfo?.forEach((yearlyInfo) => {
      this.M3OtherItemsForm.controls.yearlyInfo.push(
        this.newYearlyInfoForm(yearlyInfo.year),
      );
    });
  }

  private newYearlyInfoForm(year?: string): M3OtherItemsYearForm {
    return new FormGroup({
      year: this.fb.control(year ?? ''),
      businessTripsSmall: new FormArray<DetailsForm>([]),
      businessTripsLarge: new FormArray<DetailsForm>([]),
      workHomeTransportSmall: new FormArray<DetailsForm>([]),
      workHomeTransportLarge: new FormArray<DetailsForm>([]),
      waste: new FormArray<DetailsForm>([]),
      homeOffice: new FormArray<HomeOfficeForm>([]),
      products: new FormArray<ProductsForm>([]),
      vehicleFuels: new FormArray<VehicleFuelsForm>([]),
      diffuseEmissions: new FormArray<DiffuseEmissionsForm>([]),
      investments: new FormArray<InvestmentsForm>([]),
    });
  }

  showNextYear(): void {
    if (
      this.currentYearIndex <
      this.M3OtherItemsForm.controls.yearlyInfo.length - 1
    )
      this.currentYearIndex++;
  }

  showPrevYear(): void {
    if (this.currentYearIndex > 0) this.currentYearIndex--;
  }

  addField(
    form: M3OtherItemsYearForm,
    controlName: string,
    list: ListValueItem[],
    isWorkHomeField?: boolean,
  ): void {
    const data = this.addNewDetailsFormGroup();
    if (isWorkHomeField)
      data.addControl(
        'workHomeType',
        new FormControl<string>('', { nonNullable: true }),
      );
    const formControl = form.get(controlName) as FormArray<DetailsForm>;
    formControl.push(data);
    const index = formControl.length - 1;
    const destroy$ = new Subject<void>();
    this.formSubjects.get(controlName)?.set(index, destroy$);
    const controlAtIndex = formControl.at(index);
    this.subscribeToFormGroupFields(controlAtIndex, list, destroy$);
  }

  removeField(
    form: M3OtherItemsYearForm,
    i: number,
    controlName: string,
  ): void {
    const formControl = form.get(controlName) as FormArray<DetailsForm>;
    formControl.removeAt(i);
    const destroySubject = this.formSubjects.get(controlName)?.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.formSubjects.get(controlName)?.delete(i);
    }
  }

  addHomeOfficeField(
    yearlyForm?: M3OtherItemsYearForm,
    details?: HomeOfficeEmissions,
  ) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(details?.unitNumber ?? ''),
      usedDevice: this.fb.control<string>(details?.usedDevice ?? ''),
      amountOfDevices: this.fb.control<string>(details?.amountOfDevices ?? ''),
      deviceElectricityAmount: this.fb.control<string>(
        details?.deviceElectricityAmount ?? '',
      ),
      amountOfHours: this.fb.control<string>(details?.amountOfHours ?? ''),
      electricityPackage: this.fb.control<string>(
        details?.electricityPackage ?? '',
      ),
      amount_kWh: this.fb.control<number>(details?.amount_kWh ?? 0),
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(
        details?.isUsingModelEmissionFactor ?? undefined,
      ),
      emissionFactor: this.fb.control<number>(details?.emissionFactor ?? 0),
      otherEmissionFactor: this.fb.control<string | undefined>(
        details?.otherEmissionFactor ?? undefined,
      ),
      kgCO2Footprint: this.fb.control<number>(details?.kgCO2Footprint ?? 0),
    }) as HomeOfficeForm;
    if (yearlyForm) yearlyForm.controls.homeOffice.push(data);

    const destroy$ = new Subject<void>();
    this.subscribeToHomeOfficeElectricityAmountChanges(data, destroy$);
    this.subscribeToHomeOfficeEmissionsChanges(data, destroy$);
  }

  private subscribeToHomeOfficeElectricityAmountChanges(
    controlAtIndex: HomeOfficeForm,
    destroy$: Subject<void>,
  ) {
    const deviceAmountChanges$ =
      controlAtIndex.controls.amountOfDevices.valueChanges.pipe(
        startWith(controlAtIndex.controls.amountOfDevices.value),
      );
    const deviceElectricityAmountChanges$ =
      controlAtIndex.controls.deviceElectricityAmount.valueChanges.pipe(
        startWith(controlAtIndex.controls.deviceElectricityAmount.value),
      );
    const amountOfHoursChanges$ =
      controlAtIndex.controls.amountOfHours.valueChanges.pipe(
        startWith(controlAtIndex.controls.amountOfHours.value),
      );
    deviceAmountChanges$
      .pipe(
        combineLatestWith(
          deviceElectricityAmountChanges$,
          amountOfHoursChanges$,
        ),
        takeUntil(destroy$),
      )
      .subscribe(([amount, electricityAmount, hours]) => {
        controlAtIndex.controls.amount_kWh.setValue(
          Math.round((+electricityAmount / 1000) * +hours * +amount * 1e3) /
            1e3,
        );
      });
  }

  private subscribeToHomeOfficeEmissionsChanges(
    controlAtIndex: HomeOfficeForm,
    destroy$: Subject<void>,
  ) {
    const kWh_amountChanges$ =
      controlAtIndex.controls.amount_kWh.valueChanges.pipe(
        startWith(controlAtIndex.controls.amount_kWh.value),
      );
    const electricityPackageValueChanges$ =
      controlAtIndex.controls.electricityPackage.valueChanges.pipe(
        startWith(controlAtIndex.controls.electricityPackage.value),
      );
    const isUsingModelEmissionFactorChanges$ =
      controlAtIndex.controls.isUsingModelEmissionFactor.valueChanges.pipe(
        startWith(controlAtIndex.controls.isUsingModelEmissionFactor.value),
      );
    const otherEmissionFactorChanges$ =
      controlAtIndex.controls.otherEmissionFactor.valueChanges.pipe(
        startWith(controlAtIndex.controls.otherEmissionFactor.value),
      );
    electricityPackageValueChanges$
      .pipe(
        combineLatestWith(
          isUsingModelEmissionFactorChanges$,
          otherEmissionFactorChanges$,
          kWh_amountChanges$,
        ),
        takeUntil(destroy$),
      )
      .subscribe(
        ([type, isUsingModelEmissionFactor, otherEmissionFactor, amount]) => {
          const value = getListItemValue(type, this.homeOfficeElectricalList);
          controlAtIndex.controls.emissionFactor.setValue(value);
          const emissionFactor = isUsingModelEmissionFactor
            ? controlAtIndex.controls.emissionFactor.value
            : otherEmissionFactor;

          const footprint = getFootprintInKilos(emissionFactor, amount);
          controlAtIndex.controls.kgCO2Footprint.setValue(footprint);
        },
      );
  }

  removeHomeOfficeField(form: M3OtherItemsYearForm, i: number): void {
    form.controls.homeOffice.removeAt(i);
    const destroySubject = this.formSubjects.get('homeOffice')?.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.formSubjects.get('homeOffice')?.delete(i);
    }
  }

  addProductField(form?: M3OtherItemsYearForm, details?: ProductsEmissions) {
    const data = new FormGroup({
      soldOrBought: this.fb.control<string>(details?.soldOrBought ?? ''),
      unitNumber: this.fb.control<string>(details?.unitNumber ?? ''),
      product: this.fb.control<string>(details?.product ?? ''),
      amount: this.fb.control<string>(details?.amount ?? ''),
      price: this.fb.control<string>(details?.price ?? ''),
      emissionFactor: this.fb.control<string>(details?.emissionFactor ?? ''),
      kgCO2Footprint: this.fb.control<number>(details?.kgCO2Footprint ?? 0),
    }) as ProductsForm;
    if (form) form.controls.products.push(data);
    const destroy$ = new Subject<void>();
    this.subscribeToProductsEmissionsChanges(data, destroy$);
  }

  private subscribeToProductsEmissionsChanges(
    controlAtIndex: ProductsForm,
    destroy$: Subject<void>,
  ) {
    const amountChanges$ = controlAtIndex.controls.amount.valueChanges.pipe(
      startWith(controlAtIndex.controls.amount.value),
    );
    const priceChanges$ = controlAtIndex.controls.price.valueChanges.pipe(
      startWith(controlAtIndex.controls.price.value),
    );
    const emissionFactorChanges$ =
      controlAtIndex.controls.emissionFactor.valueChanges.pipe(
        startWith(controlAtIndex.controls.emissionFactor.value),
      );
    amountChanges$
      .pipe(
        takeUntil(destroy$),
        combineLatestWith(priceChanges$, emissionFactorChanges$),
      )
      .subscribe(([amount, price, emissionFactor]) => {
        const footprint = getFootprintInKilos(
          emissionFactor,
          +amount > 0 ? amount : price,
        );
        controlAtIndex.controls.kgCO2Footprint.setValue(footprint);
      });
  }

  removeProductsField(form: M3OtherItemsYearForm, i: number) {
    form.controls.products.removeAt(i);
    const destroySubject = this.formSubjects.get('products')?.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.formSubjects.get('products')?.delete(i);
    }
  }

  addVehicleFuelsField(
    form?: M3OtherItemsYearForm,
    details?: VehicleFuelEmissions,
  ) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(details?.unitNumber ?? ''),
      vehicleFuelsType: this.fb.control<string>(
        details?.vehicleFuelsType ?? '',
      ),
      fuel: this.fb.control<string>(details?.fuel ?? ''),
      amount: this.fb.control<string>(details?.amount ?? ''),
      distance: this.fb.control<string>(details?.distance ?? ''),
      emissionFactor: this.fb.control<string>(details?.emissionFactor ?? ''),
      kgCO2Footprint: this.fb.control<number>(details?.kgCO2Footprint ?? 0),
    }) as VehicleFuelsForm;
    if (form) form.controls.vehicleFuels.push(data);
    const destroy$ = new Subject<void>();
    this.subscribeToVehicleFuelsEmissionsChanges(data, destroy$);
  }

  private subscribeToVehicleFuelsEmissionsChanges(
    controlAtIndex: VehicleFuelsForm,
    destroy$: Subject<void>,
  ) {
    const amountChanges$ = controlAtIndex.controls.amount.valueChanges.pipe(
      startWith(controlAtIndex.controls.amount.value),
    );
    const distanceChanges$ = controlAtIndex.controls.distance.valueChanges.pipe(
      startWith(controlAtIndex.controls.distance.value),
    );
    const emissionFactorChanges$ =
      controlAtIndex.controls.emissionFactor.valueChanges.pipe(
        startWith(controlAtIndex.controls.emissionFactor.value),
      );
    amountChanges$
      .pipe(
        takeUntil(destroy$),
        combineLatestWith(distanceChanges$, emissionFactorChanges$),
      )
      .subscribe(([amount, distance, emissionFactor]) => {
        const footprint = getFootprintInKilos(
          emissionFactor,
          +amount > 0 ? amount : distance,
        );
        controlAtIndex.controls.kgCO2Footprint.setValue(footprint);
      });
  }

  removeVehicleFuelsField(form: M3OtherItemsYearForm, i: number) {
    form.controls.vehicleFuels.removeAt(i);
    const destroySubject = this.formSubjects.get('vehicleFuels')?.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.formSubjects.get('vehicleFuels')?.delete(i);
    }
  }

  addDiffuseEmissionField(
    form?: M3OtherItemsYearForm,
    details?: DiffuseEmissions,
  ) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(details?.unitNumber ?? ''),
      sourceOfEmission: this.fb.control<string>(
        details?.sourceOfEmission ?? '',
      ),
      amount: this.fb.control<string>(details?.amount ?? ''),
      unit: this.fb.control<string>(details?.unit ?? ''),
      emissionFactor: this.fb.control<string>(details?.emissionFactor ?? ''),
      kgCO2Footprint: this.fb.control<number>(details?.kgCO2Footprint ?? 0),
    }) as DiffuseEmissionsForm;
    if (form) form.controls.diffuseEmissions.push(data);
    const destroy$ = new Subject<void>();
    this.subscribeToDiffuseEmissionsChanges(data, destroy$);
  }

  private subscribeToDiffuseEmissionsChanges(
    controlAtIndex: DiffuseEmissionsForm,
    destroy$: Subject<void>,
  ) {
    const amountChanges$ = controlAtIndex.controls.amount.valueChanges.pipe(
      startWith(controlAtIndex.controls.amount.value),
    );
    const emissionFactorChanges$ =
      controlAtIndex.controls.emissionFactor.valueChanges.pipe(
        startWith(controlAtIndex.controls.emissionFactor.value),
      );
    amountChanges$
      .pipe(takeUntil(destroy$), combineLatestWith(emissionFactorChanges$))
      .subscribe(([amount, emissionFactor]) => {
        const footprint = getFootprintInKilos(emissionFactor, amount);
        controlAtIndex.controls.kgCO2Footprint.setValue(footprint);
      });
  }

  removeDiffuseEmissionField(form: M3OtherItemsYearForm, i: number) {
    form.controls.diffuseEmissions.removeAt(i);
    const destroySubject = this.formSubjects.get('diffuseEmissions')?.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.formSubjects.get('diffuseEmissions')?.delete(i);
    }
  }

  addInvestmentField(yearlyForm?: M3OtherItemsYearForm, details?: Investments) {
    const data = this.fb.group({
      unitNumber: this.fb.control<string>(details?.unitNumber ?? ''),
      investment: this.fb.control<string>(details?.investment ?? ''),
      calculationMethod: this.fb.control<string>(
        details?.calculationMethod ?? '',
      ),
      kgCO2Footprint: this.fb.control<number>(details?.kgCO2Footprint ?? 0),
    }) as InvestmentsForm;
    if (yearlyForm) yearlyForm.controls.investments.push(data);
    const destroy$ = new Subject<void>();
    this.subscribeToInvestmentFormCalculationMethodChanges(
      data,
      destroy$,
      details,
    );
  }

  subscribeToInvestmentFormCalculationMethodChanges(
    controlAtIndex: InvestmentsForm,
    destroy$: Subject<void>,
    details?: Investments,
  ) {
    controlAtIndex.controls.calculationMethod.valueChanges
      .pipe(
        startWith(controlAtIndex.controls.calculationMethod.value),
        takeUntil(destroy$),
      )
      .subscribe((calculationMethod) => {
        this.handleCalculationMethodChange(
          controlAtIndex,
          calculationMethod,
          destroy$,
          details,
        );
      });
  }

  handleCalculationMethodChange(
    controlAtIndex: InvestmentsForm,
    calculationMethod: string,
    destroy$: Subject<void>,
    details?: Investments,
  ) {
    if (
      calculationMethod === 'Investeeringu- või projektispetsiifilise meetod'
    ) {
      controlAtIndex.addControl(
        'investmentMethod',
        this.fb.group({
          M1_M2_emissions: details?.investmentMethod?.M1_M2_emissions ?? '',
          percentageOfExpenses:
            details?.investmentMethod?.percentageOfExpenses ?? '',
          equityShare: details?.investmentMethod?.equityShare ?? '',
        }),
      );
      controlAtIndex.removeControl('averageMethod');
      controlAtIndex.controls.kgCO2Footprint.setValue(0);
      this.subscribeToInvestmentMethodEmissions(
        controlAtIndex.controls.investmentMethod,
        destroy$,
        controlAtIndex,
      );
    } else if (calculationMethod === 'Keskmiste andmete meetod') {
      const averageMethodGroup: AverageMethodFormGroup = this.fb.group({
        averageMethodType: details?.averageMethod?.averageMethodType ?? '',
      });

      averageMethodGroup.controls.averageMethodType.valueChanges
        .pipe(
          startWith(averageMethodGroup.controls.averageMethodType.value),
          takeUntil(destroy$),
        )
        .subscribe((type) => {
          this.updateAverageMethodDetails(
            averageMethodGroup,
            type,
            controlAtIndex,
            details?.averageMethod,
          );
        });

      controlAtIndex.addControl('averageMethod', averageMethodGroup);
      if (!details) controlAtIndex.controls.kgCO2Footprint.setValue(0);
      controlAtIndex.removeControl('investmentMethod');
    } else {
      controlAtIndex.removeControl('investmentMethod');
      controlAtIndex.removeControl('averageMethod');
    }
  }

  updateAverageMethodDetails(
    averageMethodGroup: AverageMethodFormGroup,
    type: string,
    controlAtIndex: InvestmentsForm,
    details?: AverageMethod,
  ) {
    const formNames = [
      'companyProfitEmissionsForm',
      'investmentBuildingEmissionsForm',
      'investmentUsingEmissionsForm',
    ];

    formNames.forEach((formName) => {
      if (averageMethodGroup.contains(formName)) {
        averageMethodGroup.removeControl(
          formName as
            | 'companyProfitEmissionsForm'
            | 'investmentBuildingEmissionsForm'
            | 'investmentUsingEmissionsForm',
        );
      }
    });

    switch (type) {
      case 'Investeeringu objektiks olev äriühing':
        averageMethodGroup.addControl(
          'companyProfitEmissionsForm',
          this.fb.group({
            companyTotalIncome:
              details?.companyProfitEmissionsForm?.companyTotalIncome ?? '',
            equityShare: details?.companyProfitEmissionsForm?.equityShare ?? '',
            emissionFactor:
              details?.companyProfitEmissionsForm?.emissionFactor ?? '',
          }),
        );
        averageMethodGroup.removeControl('investmentBuildingEmissionsForm');
        averageMethodGroup.removeControl('investmentUsingEmissionsForm');
        controlAtIndex.controls.kgCO2Footprint.setValue(0);
        this.subscribeToCompanyProfitEmissions(
          controlAtIndex,
          averageMethodGroup.controls.companyProfitEmissionsForm,
        );
        break;
      case 'Võlainvesteeringud ja projektide rahastamine - ehitusetapp':
        averageMethodGroup.addControl(
          'investmentBuildingEmissionsForm',
          this.fb.group({
            projectBuildingCost:
              details?.investmentBuildingEmissionsForm?.projectBuildingCost ??
              '',
            percentageOfTotalExpenses:
              details?.investmentBuildingEmissionsForm?.projectBuildingCost ??
              '',
            emissionFactor:
              details?.investmentBuildingEmissionsForm?.emissionFactor ?? '',
          }),
        );
        averageMethodGroup.removeControl('companyProfitEmissionsForm');
        averageMethodGroup.removeControl('investmentUsingEmissionsForm');
        controlAtIndex.controls.kgCO2Footprint.setValue(0);
        this.subscribeToInvestmentBuildingEmissions(
          controlAtIndex,
          averageMethodGroup.controls.investmentBuildingEmissionsForm,
        );
        break;
      case 'Võlainvesteeringud ja projektide rahastamine - kasutusetapp':
        averageMethodGroup.addControl(
          'investmentUsingEmissionsForm',
          this.fb.group({
            projectProfit:
              details?.investmentUsingEmissionsForm?.projectProfit ?? '',
            percentageOfTotalExpenses:
              details?.investmentUsingEmissionsForm
                ?.percentageOfTotalExpenses ?? '',
            emissionFactor:
              details?.investmentUsingEmissionsForm?.emissionFactor ?? '',
          }),
        );
        averageMethodGroup.removeControl('investmentBuildingEmissionsForm');
        averageMethodGroup.removeControl('companyProfitEmissionsForm');
        controlAtIndex.controls.kgCO2Footprint.setValue(0);
        this.subscribeToInvestmentUsingEmissions(
          controlAtIndex,
          averageMethodGroup.controls.investmentUsingEmissionsForm,
        );
        break;
    }
  }

  private subscribeToInvestmentMethodEmissions(
    investmentMethodForm: InvestmentMethodFormGroup | undefined,
    destroy$: Subject<void>,
    control: InvestmentsForm,
  ) {
    if (investmentMethodForm) {
      const percentageOfExpensesValueChanges$ =
        investmentMethodForm.controls.percentageOfExpenses.valueChanges.pipe(
          startWith(investmentMethodForm.controls.percentageOfExpenses.value),
        );
      const equityValueChanges$ =
        investmentMethodForm.controls.equityShare.valueChanges.pipe(
          startWith(investmentMethodForm.controls.equityShare.value),
        );
      investmentMethodForm.controls.M1_M2_emissions.valueChanges
        .pipe(
          takeUntil(destroy$),
          startWith(investmentMethodForm.controls.M1_M2_emissions.value),
          combineLatestWith(
            percentageOfExpensesValueChanges$,
            equityValueChanges$,
          ),
        )
        .subscribe(([M1_M2_emissions, percentage, equity]) => {
          const footprint = getFootprintInKilos(
            M1_M2_emissions,
            +equity > 0 ? +equity * 0.01 : +percentage * 0.01,
          );
          control.controls.kgCO2Footprint.setValue(footprint);
        });
    }
  }

  removeInvestmentField(yearlyForm: M3OtherItemsYearForm, i: number) {
    yearlyForm.controls.investments.removeAt(i);
    const destroySubject = this.formSubjects.get('investments')?.get(i);
    if (destroySubject) {
      destroySubject.next();
      destroySubject.complete();
      this.formSubjects.get('investments')?.delete(i);
    }
  }

  private subscribeToCompanyProfitEmissions(
    controlAtIndex: InvestmentsForm,
    companyProfitEmissionsForm?: CompanyProfitEmissionsForm,
  ) {
    if (companyProfitEmissionsForm) {
      const equityValueChanges$ =
        companyProfitEmissionsForm.controls.equityShare.valueChanges.pipe(
          startWith(companyProfitEmissionsForm.controls.equityShare.value),
        );
      const emissionFactorValueChanges =
        companyProfitEmissionsForm.controls.emissionFactor.valueChanges.pipe(
          startWith(companyProfitEmissionsForm.controls.emissionFactor.value),
        );
      companyProfitEmissionsForm.controls.companyTotalIncome.valueChanges
        .pipe(
          startWith(
            companyProfitEmissionsForm.controls.companyTotalIncome.value,
          ),
          combineLatestWith(equityValueChanges$, emissionFactorValueChanges),
        )
        .subscribe(([income, equity, emissionFactor]) => {
          const footprint = getFootprintInKilos(
            +income * (+equity * 0.01),
            emissionFactor,
          );
          controlAtIndex.controls.kgCO2Footprint.setValue(footprint);
        });
    }
  }

  private subscribeToInvestmentBuildingEmissions(
    controlAtIndex: InvestmentsForm,
    investmentBuildingEmissionsForm?: InvestmentBuildingEmissionsForm,
  ) {
    if (investmentBuildingEmissionsForm) {
      const totalExpensesValueChanges$ =
        investmentBuildingEmissionsForm.controls.percentageOfTotalExpenses.valueChanges.pipe(
          startWith(
            investmentBuildingEmissionsForm.controls.percentageOfTotalExpenses
              .value,
          ),
        );
      const emissionFactorValueChanges =
        investmentBuildingEmissionsForm.controls.emissionFactor.valueChanges.pipe(
          startWith(
            investmentBuildingEmissionsForm.controls.emissionFactor.value,
          ),
        );
      investmentBuildingEmissionsForm.controls.projectBuildingCost.valueChanges
        .pipe(
          startWith(
            investmentBuildingEmissionsForm.controls.projectBuildingCost.value,
          ),
          combineLatestWith(
            totalExpensesValueChanges$,
            emissionFactorValueChanges,
          ),
        )
        .subscribe(([cost, expenses, emissionFactor]) => {
          const footprint = getFootprintInKilos(
            +cost * (+expenses * 0.01),
            emissionFactor,
          );
          controlAtIndex.controls.kgCO2Footprint.setValue(footprint);
        });
    }
  }

  private subscribeToInvestmentUsingEmissions(
    controlAtIndex: InvestmentsForm,
    investmentUsingEmissionsForm?: InvestmentUsingEmissionsForm,
  ) {
    if (investmentUsingEmissionsForm) {
      const totalExpensesValueChanges$ =
        investmentUsingEmissionsForm.controls.percentageOfTotalExpenses.valueChanges.pipe(
          startWith(
            investmentUsingEmissionsForm.controls.percentageOfTotalExpenses
              .value,
          ),
        );
      const emissionFactorValueChanges =
        investmentUsingEmissionsForm.controls.emissionFactor.valueChanges.pipe(
          startWith(investmentUsingEmissionsForm.controls.emissionFactor.value),
        );
      investmentUsingEmissionsForm.controls.projectProfit.valueChanges
        .pipe(
          startWith(investmentUsingEmissionsForm.controls.projectProfit.value),
          combineLatestWith(
            totalExpensesValueChanges$,
            emissionFactorValueChanges,
          ),
        )
        .subscribe(([profit, expenses, emissionFactor]) => {
          const footprint = getFootprintInKilos(
            +profit * (+expenses * 0.01),
            emissionFactor,
          );
          controlAtIndex.controls.kgCO2Footprint.setValue(footprint);
        });
    }
  }

  private getHomeOfficeValues(
    homeOffice: FormArray<HomeOfficeForm>,
  ): HomeOfficeEmissions[] {
    return homeOffice.controls.map((details) => {
      return {
        unitNumber: details.value.unitNumber ?? '',
        usedDevice: details.value.usedDevice ?? '',
        amountOfDevices: details.value.amountOfDevices ?? '',
        deviceElectricityAmount: details.value.deviceElectricityAmount ?? '',
        amountOfHours: details.value.amountOfHours ?? '',
        electricityPackage: details.value.electricityPackage ?? '',
        amount_kWh: details.value.amount_kWh ?? 0,
        isUsingModelEmissionFactor:
          details.value.isUsingModelEmissionFactor ?? undefined,
        emissionFactor: details.value.emissionFactor ?? 0,
        otherEmissionFactor: details.value.otherEmissionFactor ?? '',
        kgCO2Footprint: details.value.kgCO2Footprint ?? 0,
      };
    });
  }

  private getProductsValues(
    products: FormArray<ProductsForm>,
  ): ProductsEmissions[] {
    return products.controls.map((details) => {
      return {
        soldOrBought: details.value.soldOrBought ?? '',
        unitNumber: details.value.unitNumber ?? '',
        product: details.value.product ?? '',
        amount: details.value.amount ?? '',
        price: details.value.price ?? '',
        emissionFactor: details.value.emissionFactor ?? '',
        kgCO2Footprint: details.value.kgCO2Footprint ?? 0,
      };
    });
  }

  private getVehicleFuelsValues(
    vehicleFuels: FormArray<VehicleFuelsForm>,
  ): VehicleFuelEmissions[] {
    return vehicleFuels.controls.map((fuelInfo) => {
      return {
        vehicleFuelsType: fuelInfo.value.vehicleFuelsType ?? '',
        unitNumber: fuelInfo.value.unitNumber ?? '',
        fuel: fuelInfo.value.fuel ?? '',
        amount: fuelInfo.value.amount ?? '',
        distance: fuelInfo.value.distance ?? '',
        emissionFactor: fuelInfo.value.emissionFactor ?? '',
        kgCO2Footprint: fuelInfo.value.kgCO2Footprint ?? 0,
      };
    });
  }

  private getDiffuseEmissionsValues(
    diffuseEmissions: FormArray<DiffuseEmissionsForm>,
  ): DiffuseEmissions[] {
    return diffuseEmissions.controls.map((diffuseEmission) => {
      return {
        unitNumber: diffuseEmission.value.unitNumber ?? '',
        sourceOfEmission: diffuseEmission.value.sourceOfEmission ?? '',
        amount: diffuseEmission.value.amount ?? '',
        unit: diffuseEmission.value.unit ?? '',
        emissionFactor: diffuseEmission.value.emissionFactor ?? '',
        kgCO2Footprint: diffuseEmission.value.kgCO2Footprint ?? 0,
      };
    });
  }

  private getInvestmentsValues(
    investments: FormArray<InvestmentsForm>,
  ): Investments[] {
    const investmentsData = [] as Investments[];
    investments.controls.forEach((investment) => {
      const data = investment.getRawValue();
      if (data.calculationMethod.trim().length === 0) {
        delete data.investmentMethod;
        delete data.averageMethod;
        delete data.initialInvestmentYear;
      }
      if (
        data.calculationMethod ===
        'Investeeringu- või projektispetsiifilise meetod'
      ) {
        delete data.averageMethod;
        delete data.initialInvestmentYear;
      }
      if (data.calculationMethod === 'Keskmiste andmete meetod') {
        delete data.investmentMethod;
        delete data.initialInvestmentYear;
        if (data.averageMethod?.averageMethodType.length === 0) {
          delete data.averageMethod.investmentUsingEmissionsForm;
          delete data.averageMethod.companyProfitEmissionsForm;
          delete data.averageMethod.investmentBuildingEmissionsForm;
        }
        if (
          data.averageMethod?.averageMethodType ===
          'Investeeringu objektiks olev äriühing'
        ) {
          delete data.averageMethod.investmentBuildingEmissionsForm;
          delete data.averageMethod.investmentUsingEmissionsForm;
        }
        if (
          data.averageMethod?.averageMethodType ===
          'Võlainvesteeringud ja projektide rahastamine - ehitusetapp'
        ) {
          delete data.averageMethod.investmentUsingEmissionsForm;
          delete data.averageMethod.companyProfitEmissionsForm;
        }
        if (
          data.averageMethod?.averageMethodType ===
          'Võlainvesteeringud ja projektide rahastamine - kasutusetapp'
        ) {
          delete data.averageMethod.companyProfitEmissionsForm;
          delete data.averageMethod.investmentBuildingEmissionsForm;
        }
      }
      investmentsData.push(data);
    });
    return investmentsData;
  }
}
