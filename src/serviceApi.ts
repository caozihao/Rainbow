import config from '../config/constant.config';
const { MOCK_API, HOST_API, DEV_MODE } = config;

const host = DEV_MODE === 'mock' ? MOCK_API : '/rcs';

export default {
  contract: {
    create: `${host}/contract/create`,
    getContractFileById: `${host}/contract/getContractFile/:id`,
    modify: `${host}/contract/modify`,
    queryList: `${host}/contract/query`, // ok
    queryById: `${host}/contract/queryById/:contractId`,
    batchDelete: `${host}/contract/delete`,
  },
  writeOff: {
    createWriteOff: `${host}/writeOff/createWriteOff`,
    deleteByWriteOffId: `${host}/writeOff/delete/:writeOffId`,
    exportByContractId: `${host}/writeOff/export/:contractId`,
    queryCommissionByContractId: `${host}/writeOff/queryCommissionByContractId/:contractId`,
    querySettlementByContractId: `${host}/writeOff/querySettlementByContractId/:contractId`,
    queryWriteOffRecord: `${host}/writeOff/queryWriteOffRecord`,
    relationToContract: `${host}/writeOff/relationToContract`,
    syncByCustomId: `${host}/writeOff/sync/:customId`,
    unRelationToContract: `${host}/writeOff/unRelationToContract`,
  },
  invoice: {
    queryInvoice: `${host}/invoice/queryInvoice`,
    relationToContract: `${host}/invoice/relationToContract`,
    unRelationToContract: `${host}/invoice/unRelationToContract`,
    syncByCustomId: `${host}/invoice/sync/:customId`,
    queryRelatedInvoice: `${host}/invoice/queryRelatedInvoice`,
    create: `${host}/invoice/create`,
    update: `${host}/invoice/update`,
  },
  receivable: {
    queryHWAndServiceSummary: `${host}/receivable/queryHWAndServiceSummary`,
    queryCustomService: `${host}/receivable/queryCustomService/:contractId`,
    queryCustomHw: `${host}/receivable/queryCustomHw/:contractId`,
    queryHwDetail: `${host}/receivable/queryHwDetail`,
    queryHwSummary: `${host}/receivable/queryHwSummary`,
    queryServiceDetail: `${host}/receivable/queryServiceDetail`,
    queryServiceSummary: `${host}/receivable/queryServiceSummary`,
    updateCustomService: `${host}/receivable/updateCustomService`,
    updateCustomHw: `${host}/receivable/updateCustomHw`,
  },
  account: {
    queryByName: `${host}/account/queryByName`,
  },
};
