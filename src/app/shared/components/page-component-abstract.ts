import {Directive, inject, OnDestroy} from '@angular/core';
import { DataService } from '../services/data.service';
import {Subject} from "rxjs";

@Directive()
export abstract class PageComponentAbstract implements OnDestroy {

  protected destroy$ = new Subject<void>();
  public dataService = inject(DataService);
  public emissionsLists = this.dataService.emissionsLists;
  public organizationData = this.dataService.organizationData;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
