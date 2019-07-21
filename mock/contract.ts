import { Request, Response } from 'express';
import config from '../config/constant.config';
const { MOCK_API } = config;

const create = () => {};

const getContractFileById = () => {};

const modify = () => {};

const queryList = () => {};

export default {
  [`POST ${MOCK_API}/contract/create`]: create,
  [`GET ${MOCK_API}/contract/getContractFile/:id`]: getContractFileById,
  [`POST${MOCK_API}/contract/modify`]: modify,
  [`POST${MOCK_API}/contract/query`]: queryList,
};
