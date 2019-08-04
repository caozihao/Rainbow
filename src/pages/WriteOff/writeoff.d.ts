export interface IContractDetail {
  contractId: string;
  effectDate: string;
  customId: string;
  effectiveDate: string;
  contractNo: string;
  customName: string;
  firstPayment: string;
  receivableNum: string;
}

export interface IQueryParams {
  pageType: string;
  contractId: string;
  tabType: string;
}
