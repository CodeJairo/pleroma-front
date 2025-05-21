export interface IBudgetInfoEntity {
  certificateNumber: string;
  issuanceDate: string;
  totalAssignedAmount: string;
  rubros: IRubro[];
}

export interface IRubro {
  name: string;
  code: string;
  assignedAmount: string;
}
