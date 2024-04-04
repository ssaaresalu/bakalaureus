import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public readonly activeSpinners = new BehaviorSubject<number>(0);

  public show(): void {
    const nextValue = this.activeSpinners.value + 1;
    this.activeSpinners.next(nextValue);
  }

  public hide(): void {
    const nextValue = this.activeSpinners.value ? this.activeSpinners.value - 1 : 0;
    this.activeSpinners.next(nextValue);
  }

}
