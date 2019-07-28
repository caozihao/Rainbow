import config from '../config/constant.config';
const { MOCK_API, HOST_API, DEV_MODE } = config;

const host = DEV_MODE === 'mock' ? MOCK_API : HOST_API;

export default {
  contract: {
    create: `${host}/contract/create`,
    getContractFileById: `${host}/contract/getContractFile/:id`,
    modify: `${host}/contract/modify`,
    queryList: `${host}/contract/query`,
    queryById: `${host}/contract/queryById/:contractId`,
  },
  writeOff: {
    createWriteOff: `${host}/writeoff/createWriteOff`,
    deleteByWriteOffId: `${host}/writeoff/delete/:writeOffId`,
    exportByContractId: `${host}/writeoff/export/:contractId`,
    queryCommissionByContractId: `${host}/writeoff/queryCommissionByContractId/:contractId`,
    querySettlementByContractId: `${host}/writeoff/querySettlementByContractId/:contractId`,
    queryWriteOffRecord: `${host}/writeoff/queryWriteOffRecord`,
    relationToContract: `${host}/writeoff/relationToContract`,
    syncByCustomId: `${host}/writeoff/sync/:customId`,
    unRelationToContract: `${host}/writeoff/unRelationToContract`,
  },
  invoice: {
    queryByCustomIdAndEffectTime: `${host}/invoice/queryByCustomIdAndEffectTime`,
    relationToContract: `${host}/invoice/relationToContract`,
    unRelationToContract: `${host}/invoice/unRelationToContract`,
    syncByCustomId: `${host}/invoice/sync/:customId`,
    queryRelatedInvoice: `${host}/invoice/queryRelatedInvoice`,
  },
};
