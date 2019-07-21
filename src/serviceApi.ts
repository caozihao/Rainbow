import config from '../config/constant.config';
const {MOCK_API,HOST_API,DEV_MODE}  = config;

const host = DEV_MODE === 'mock' ? MOCK_API : HOST_API;

export default {
  contract:{
    create:`${host}/contract/create`,
    getContractFileById:`${host}/contract/getContractFile/:id`,
    modify:`${host}/contract/modify`,
    queryList:`${host}/contract/query`
  }
}
