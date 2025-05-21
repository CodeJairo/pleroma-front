export interface IMasterInfoEntity {
  costCenters: ICostCenters;
  modality: string;
  denomination: string;
  typology: string;
  class: string;
  orderNumber: number;
  startDate: string;
  endDate: string;
  contractor: string;
  contractorDocument: string;
  expeditionPlace: string;
  birthDate: string;
  gender: string;
  contractObject: string;
  scope: string;
  executionPlace: string;
  durationUntil: string;
  contractValue: number;
  contractValueInWords: string;
  partialActsValue: number;
  partialActsValueInWords: string;
  paymentMethod: string;
  supervisorName: string;
  supervisorDocument: string;
  acquisitionPlan: string;
  developmentPlan: string;
  strategicLine: string;
  sectorName: string;
  classifier: string;
  ciiu: number;
}

export interface ICostCenters {
  aqueduct: boolean;
  sewer: boolean;
  cleaning: boolean;
  energy: boolean;
  gas: boolean;
}
