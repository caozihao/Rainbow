import { Request, Response } from 'express';
import config from '../config/constant.config';
import { postRequest } from './common';

const Mockjs = require('mockjs');
const { Random, mock } = Mockjs;
const { MOCK_API } = config;

const querySettlementByContractId = (req: Request, res: Response) => {
  let ramdonFloat = () => Random.float(60, 100, 3, 5);
  const result = mock({
    'body|10': [
      {
        accumulatedPayAmount: ramdonFloat(),
        actualPayAmount: ramdonFloat(),
        actualPayDate: Random.now(),
        'contractId|+1': 1,
        overdueAmount: ramdonFloat(),
        overdueNumOfDate: Random.now(),
        'payMonth|1-12': 1,
        'planNumOfPeriods|1': [0, 1, 2, 3, 4],
        planPayAmount: ramdonFloat(),
        receivableReasonable: ramdonFloat(),
        'settlementId|+2': 10,
      },
    ],
    code: 0,
    errMsg: '',
  });

  return res.status(200).send(result);
};

const queryWriteOffRecord = (req: Request, res: Response) => {
  let ramdonFloat = () => Random.float(60, 100, 3, 5);
  const result = mock({
    'body|10': [
      {
        actualPayAmount: ramdonFloat(),
        actualPayDate: Random.now(),
        'contractId|+1': 1,
        'customId|+1': 1,
        customName: Random.word(6, 10),
        'settlementId|+2': 10,
        'type|1': [0, 1],
      },
    ],
    code: 0,
    errMsg: '',
  });

  return res.status(200).send(result);
};

export default {
  [`GET ${MOCK_API}/writeOff/querySettlementByContractId/:contractId`]: querySettlementByContractId,
  [`GET ${MOCK_API}/writeOff/queryCommissionByContractId/:contractId`]: querySettlementByContractId,
  [`POST ${MOCK_API}/writeOff/queryWriteOffRecord`]: queryWriteOffRecord,
  [`POST ${MOCK_API}/writeOff/relationToContract`]: postRequest,
  [`GET ${MOCK_API}/writeOff/sync/:customId`]: postRequest,
  [`POST ${MOCK_API}/writeOff/unRelationToContract`]: postRequest,
};
