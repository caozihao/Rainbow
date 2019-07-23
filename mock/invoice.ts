import { Request, Response } from 'express';
import config from '../config/constant.config';

const Mockjs = require('mockjs');
const { Random, mock } = Mockjs;
const { MOCK_API } = config;

const queryByCustomIdAndEffactTime = (req: Request, res: Response) => {
  const result = mock({
    'body|10': [
      {
        amount: Random.natural(1, 100),
        billingDate: Random.now(),
        'customId|+1': 100,
        customName: ['阿里巴巴', '腾讯', '百度'],
        'id|+1': 1,
        identifierCode: Random.natural(1, 5),
        'invoiceNo|+1': 100,
        subject: Random.word(6, 10),
      },
    ],
    code: 0,
    errMsg: '',
  });

  return res.status(200).send(result);
};

export default {
  [`GET ${MOCK_API}/invoice/queryByCustomIdAndEffactTime`]: queryByCustomIdAndEffactTime,
};
