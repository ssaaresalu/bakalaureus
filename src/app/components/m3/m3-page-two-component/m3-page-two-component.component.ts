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
import { EntryComponent } from '../../../shared/components/row/entry.component';
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
  }

  submit() {}

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

  addHomeOfficeField(yearlyForm: M3OtherItemsYearForm) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(''),
      usedDevice: this.fb.control<string>(''),
      amountOfDevices: this.fb.control<string>(''),
      deviceElectricityAmount: this.fb.control<string>(''),
      amountOfHours: this.fb.control<string>(''),
      electricityPackage: this.fb.control<string>(''),
      amount_kWh: this.fb.control<number>(0),
      isUsingModelEmissionFactor: this.fb.control<boolean | undefined>(
        undefined,
      ),
      emissionFactor: this.fb.control<number>(0),
      otherEmissionFactor: this.fb.control<string | undefined>(undefined),
      kgCO2Footprint: this.fb.control<number>(0),
    }) as HomeOfficeForm;
    yearlyForm.controls.homeOffice.push(data);
    const index = yearlyForm.controls.homeOffice.length - 1;
    const destroy$ = new Subject<void>();
    this.formSubjects.get('homeOffice')?.set(index, destroy$);
    const controlAtIndex = yearlyForm.controls.homeOffice.at(index);
    this.subscribeToHomeOfficeElectricityAmountChanges(
      controlAtIndex,
      destroy$,
    );
    this.subscribeToHomeOfficeEmissionsChanges(controlAtIndex, destroy$);
  }

  private subscribeToHomeOfficeElectricityAmountChanges(
    controlAtIndex: HomeOfficeForm,
    destroy$: Subject<void>,
  ) {
    const deviceAmountChanges$ =
      controlAtIndex.controls.amountOfDevices.valueChanges;
    const deviceElectricityAmountChanges$ =
      controlAtIndex.controls.deviceElectricityAmount.valueChanges;
    const amountOfHoursChanges$ =
      controlAtIndex.controls.amountOfHours.valueChanges;
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
      controlAtIndex.controls.electricityPackage.valueChanges;
    const isUsingModelEmissionFactorChanges$ =
      controlAtIndex.controls.isUsingModelEmissionFactor.valueChanges;
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

  addProductField(form: M3OtherItemsYearForm) {
    const data = new FormGroup({
      soldOrBought: this.fb.control<string>(''),
      unitNumber: this.fb.control<string>(''),
      product: this.fb.control<string>(''),
      amount: this.fb.control<string>(''),
      price: this.fb.control<string>(''),
      emissionFactor: this.fb.control<string>(''),
      kgCO2Footprint: this.fb.control<number>(0),
    }) as ProductsForm;
    form.controls.products.push(data);
    const index = form.controls.products.length - 1;
    const destroy$ = new Subject<void>();
    this.formSubjects.get('products')?.set(index, destroy$);
    const controlAtIndex = form.controls.products.at(index);
    this.subscribeToProductsEmissionsChanges(controlAtIndex, destroy$);
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
      controlAtIndex.controls.emissionFactor.valueChanges;
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

  addVehicleFuelsField(form: M3OtherItemsYearForm) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(''),
      vehicleFuelsType: this.fb.control<string>(''),
      fuel: this.fb.control<string>(''),
      amount: this.fb.control<string>(''),
      distance: this.fb.control<string>(''),
      emissionFactor: this.fb.control<string>(''),
      kgCO2Footprint: this.fb.control<number>(0),
    }) as VehicleFuelsForm;
    form.controls.vehicleFuels.push(data);
    const index = form.controls.vehicleFuels.length - 1;
    const destroy$ = new Subject<void>();
    this.formSubjects.get('vehicleFuels')?.set(index, destroy$);
    const controlAtIndex = form.controls.vehicleFuels.at(index);
    this.subscribeToVehicleFuelsEmissionsChanges(controlAtIndex, destroy$);
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
      controlAtIndex.controls.emissionFactor.valueChanges;
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

  addDiffuseEmissionField(form: M3OtherItemsYearForm) {
    const data = new FormGroup({
      unitNumber: this.fb.control<string>(''),
      sourceOfEmission: this.fb.control<string>(''),
      amount: this.fb.control<string>(''),
      unit: this.fb.control<string>(''),
      emissionFactor: this.fb.control<string>(''),
      kgCO2Footprint: this.fb.control<number>(0),
    }) as DiffuseEmissionsForm;
    form.controls.diffuseEmissions.push(data);
    const index = form.controls.diffuseEmissions.length - 1;
    const destroy$ = new Subject<void>();
    this.formSubjects.get('diffuseEmissions')?.set(index, destroy$);
    const controlAtIndex = form.controls.diffuseEmissions.at(index);
    this.subscribeToDiffuseEmissionsChanges(controlAtIndex, destroy$);
  }

  private subscribeToDiffuseEmissionsChanges(
    controlAtIndex: DiffuseEmissionsForm,
    destroy$: Subject<void>,
  ) {
    const amountChanges$ = controlAtIndex.controls.amount.valueChanges;
    const emissionFactorChanges$ =
      controlAtIndex.controls.emissionFactor.valueChanges;
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

  addInvestmentField(yearlyForm: M3OtherItemsYearForm) {
    const data = this.fb.group({
      unitNumber: this.fb.control<string>(''),
      investment: this.fb.control<string>(''),
      calculationMethod: this.fb.control<string>(''),
      kgCO2Footprint: this.fb.control<number>(0),
    }) as InvestmentsForm;
    yearlyForm.controls.investments.push(data);
    const index = yearlyForm.controls.investments.length - 1;
    const destroy$ = new Subject<void>();
    this.formSubjects.get('investments')?.set(index, destroy$);
    const controlAtIndex = yearlyForm.controls.investments.at(index);
    this.subscribeToInvestmentFormCalculationMethodChanges(
      controlAtIndex,
      destroy$,
    );
  }

  subscribeToInvestmentFormCalculationMethodChanges(
    controlAtIndex: InvestmentsForm,
    destroy$: Subject<void>,
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
        );
      });
  }

  handleCalculationMethodChange(
    controlAtIndex: InvestmentsForm,
    calculationMethod: string,
    destroy$: Subject<void>,
  ) {
    if (
      calculationMethod === 'Investeeringu- või projektispetsiifilise meetod'
    ) {
      controlAtIndex.addControl(
        'investmentMethod',
        this.fb.group({
          M1_M2_emissions: [''],
          percentageOfExpenses: [''],
          equityShare: [''],
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
        averageMethodType: [''],
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
          );
        });

      controlAtIndex.addControl('averageMethod', averageMethodGroup);
      controlAtIndex.controls.kgCO2Footprint.setValue(0);
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
            companyTotalIncome: [''],
            equityShare: [''],
            emissionFactor: [''],
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
            projectBuildingCost: [''],
            percentageOfTotalExpenses: [''],
            emissionFactor: [''],
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
            projectProfit: [''],
            percentageOfTotalExpenses: [''],
            emissionFactor: [''],
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
}
