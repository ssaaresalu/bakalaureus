import { M1YearlyInfo } from './m1-emissions';
import { M2YearlyInfo } from './m2-emissions';
import { M3TransportYearlyInfo } from './m3-transport-emissions';
import { M3OtherItemsYearlyInfo } from './m3-other-items';

export interface OrganizationEmissions {
  organizationEmissionsYearlyInfo: OrganizationEmissionsYearlyInfo[];
}

export interface OrganizationEmissionsYearlyInfo {
  year?: string;
  M1_emissions?: M1YearlyInfo;
  M2_emissions?: M2YearlyInfo;
  M3_transportEmissions?: M3TransportYearlyInfo;
  M3_otherEmissions?: M3OtherItemsYearlyInfo;
  M3TotalEmissions?: number;
  totalOrganizationEmissions?: number;
}
