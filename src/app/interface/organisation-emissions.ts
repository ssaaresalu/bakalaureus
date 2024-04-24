import { M1Emissions } from './m1-emissions';
import { M2Emissions } from './m2-emissions';
import { M3TransportEmissions } from './m3-transport-emissions';
import { M3OtherItems } from './m3-other-items';

export interface OrganisationEmissions {
  M1_emissions: M1Emissions;
  M2_emissions: M2Emissions;
  M3_transportEmissions: M3TransportEmissions;
  M3_otherEmissions: M3OtherItems;
}
