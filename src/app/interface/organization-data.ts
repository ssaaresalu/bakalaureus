export interface OrganizationData {
  id?: number;
  name?: string;
  reportingPeriodStart?: string;
  reportingPeriodEnd?: string;
  yearlyInfo?: OrganizationYearlyInfo[];
}

export interface OrganizationYearlyInfo {
  year?: string;
  relativeIndicators?: RelativeIndicators[];
  structuralUnits?: StructuralUnits[];
  ghgAssessmentScopes?: GhgAssessmentScopes[];
}

export interface RelativeIndicators {
  nrOfEmployees?: string;
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
