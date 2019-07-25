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
    deleteByWriteOffId: `${host}/writeoff/delete/:writeOffId`,
    deleteCommissionByWriteOffId: `${host}/writeoff/deleteCommission/:writeOffId`,
    exportByContractId: `${host}/writeoff/export/:contractId`,
    exportCommissionByContractId: `${host}/writeoff/exportCommission/:contractId`,
    queryByContractId: `${host}/writeoff/queryByContractId/{contractId}`,
    queryCommissionByContractId: `${host}/writeoff/queryCommissionByContractId/:contractId`,
    update: `${host}/writeoff/update`,
    updateCommission: `${host}/writeoff/updateCommission`,
  },
  invoice: {
    queryByCustomIdAndEffactTime: `${host}/invoice/queryByCustomIdAndEffactTime`,
    relationToContract: `${host}/invoice/relationToContract`,
    syncByCustomId: `${host}/invoice/sync/:customId`,
  },
};
