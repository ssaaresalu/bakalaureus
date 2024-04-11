import { inject, Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../services/data.service';
import { ListValueItem } from '../../interface/list-value-item';

@Pipe({
  name: 'getListByCapacity',
  standalone: true,
})
export class GetListByCapacityPipe implements PipeTransform {
  private data = inject(DataService);

  transform(listName: string, listType: string): ListValueItem[] {
    if (listName === 'rigidTrucks') {
      return this.checkRigidTruckType(listType);
    } else if (listName === 'articulatedTrucks') {
      return this.checkArticulatedTruckType(listType);
    } else if (listName === 'articulatedRigidTrucks') {
      return this.checkRigidArticulatedTruckType(listType);
    } else return [];
  }

  checkRigidTruckType(listType: string): ListValueItem[] {
    if (listType === 'Keskmine km')
      return this.data.emissionsLists.rigidTruckMean;
    else if (listType === 'Täiskoorem')
      return this.data.emissionsLists.rigidTruckTonsFull;
    else return this.data.emissionsLists.rigidTruckTonsHalf;
  }
  checkArticulatedTruckType(listType: string): ListValueItem[] {
    if (listType === 'Keskmine km')
      return this.data.emissionsLists.articulatedTruckMean;
    else if (listType === 'Täiskoorem')
      return this.data.emissionsLists.articulatedTruckFull;
    else return this.data.emissionsLists.articulatedTruckHalf;
  }

  checkRigidArticulatedTruckType(listType: string): ListValueItem[] {
    if (listType === 'Keskmine km')
      return this.data.emissionsLists.articulatedRigidMean;
    else if (listType === 'Täiskoorem')
      return this.data.emissionsLists.articulatedRigidFull;
    else return this.data.emissionsLists.articulatedRigidHalf;
  }
}
