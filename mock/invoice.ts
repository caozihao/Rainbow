import { Request, Response } from 'express';
import { postRequest } from './common';
import config from '../config/constant.config';

const Mockjs = require('mockjs');
const { Random, mock } = Mockjs;
const { MOCK_API } = config;

const queryByCustomIdAndEffectTime = (req: Request, res: Response) => {
  const result = mock({
    'body|10': [
      {
        amount: Random.natural(1, 100),
        billingDate: Random.now(),
        'contractId|+1': 200,
        contractNo: Random.natural(1, 100),
        'customId|+1': 100,
        customName: ['阿里巴巴', '腾讯', '百度'],
        'id|+1': 1,
        identifierCode: Random.natural(1, 5),
        'invoiceNo|+1': 100,
        subject: Random.word(6, 10),
        'writeOffType|1': [0, 1],
      },
    ],
    code: 0,
    errMsg: '',
  });

  return res.status(200).send(result);
};

export default {
  [`GET ${MOCK_API}/invoice/queryByCustomIdAndEffectTime`]: queryByCustomIdAndEffectTime,
  [`POST ${MOCK_API}/invoice/relationToContract`]: postRequest,
  [`POST ${MOCK_API}/invoice/unRelationToContract`]: postRequest,
  [`GET ${MOCK_API}/invoice/sync/:customId`]: postRequest,
  [`GET ${MOCK_API}/invoice/queryRelatedInvoice`]: queryByCustomIdAndEffectTime,
};
