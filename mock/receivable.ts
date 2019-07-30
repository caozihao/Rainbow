import { Request, Response } from 'express';
import config from '../config/constant.config';
import { postRequest } from './common';

const Mockjs = require('mockjs');
const { Random, mock } = Mockjs;
const { MOCK_API } = config;

const queryCustomHw = (req: Request, res: Response) => {
  let ramdonFloat = () => Random.float(60, 100, 3, 5);
  const result = mock({
    'body|10': [
      {
        actualPayment: ramdonFloat(),
        'contractId|+1': 1,
        day181_365: ramdonFloat(),
        day1_30: ramdonFloat(),
        day31_60: ramdonFloat(),
        day61_90: ramdonFloat(),
        day91_180: ramdonFloat(),
        day_lt_365: ramdonFloat(),
        day_lt_90_ratio: 0.4,
        day_lt_90_total: ramdonFloat(),
        'nper|+1': 1,
        overdueTotal: ramdonFloat(),
        receivablePayment: ramdonFloat(),
        total: 100,
        unOverdueAmount: ramdonFloat(),
      },
    ],
    code: 0,
    errMsg: '',
  });

  return res.status(200).send(result);
};

export default {
  [`POST ${MOCK_API}/receivable/queryCustomCommission`]: queryCustomHw,
  [`POST ${MOCK_API}/receivable/queryCustomHw`]: queryCustomHw,
  [`POST ${MOCK_API}/receivable/queryHwDetail`]: queryCustomHw,
  [`POST ${MOCK_API}/receivable/queryHwSummary`]: queryCustomHw,
  [`POST ${MOCK_API}/receivable/queryServiceDetail`]: queryCustomHw,
  [`POST ${MOCK_API}/receivable/queryServiceSummary`]: queryCustomHw,
};
