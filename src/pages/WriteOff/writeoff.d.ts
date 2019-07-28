export interface IContractDetail {
  customId: string;
  effectiveDate: string;
  contractNo: string;
  customName: string;
  firstPayment: string;
  receivableNum: string;
}

export interface IQueryParams {
  type: string;
  contractId: string;
}
