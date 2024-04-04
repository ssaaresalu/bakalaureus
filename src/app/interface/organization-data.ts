export interface OrganizationData {
  id?: number;
  name?: string;
  reportingPeriodStart?: string;
  reportingPeriodEnd?: string;
  yearlyInfo?: OrganizationYearlyInfo[];
}

export interface OrganizationYearlyInfo {
  year?: string;
  nrOfEmployees?: string;
  structuralUnits?: StructuralUnits[];
  ghgAssessmentScopes?: GhgAssessmentScopes[];
}

export interface StructuralUnits {
  number?: string;
  name?: string;
  location?: string;
}

export interface GhgAssessmentScopes {
  unitNumber?: string;
  influenceArea?: string;
  category?: string;
}
