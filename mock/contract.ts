import { Request, Response } from 'express';
import config from '../config/constant.config';

const Mockjs = require('mockjs');
const { Random, mock } = Mockjs;
const { MOCK_API } = config;

const create = (req: Request, res: Response) => {
  const result = mock({
    code: 0,
    errMsg: 'string',
  });

  return res.status(200).send(result);
};

const getContractFileById = () => {};

const modify = () => {};

const queryList = (req: Request, res: Response) => {
  const result = mock({
    body: {
      currentPage: req.body.currentPage,
      'dataList|100': [
        {
          contactName: `<${Random.word(6, 10)}>`,
          // customId: Random.id(5,10),
          'customId|+1': 100,
          'customName|1': ['阿里巴巴', '腾讯', '百度'],
          effectiveDate: Random.now(),
          email: Random.email(),
          firstPayment: Random.now(),
          'id|+1': 1,
          periodPayment: Random.natural(1,100),
          type: 'string',
          receivableNum: 'string',
          'status|1': ['Normal', 'Legal', '3rd party'],
          tel: Random.tel,
          totalAmount: Random.natural(1,100),
          'productType|1': ['直销', '渠道', '爱德堡'],
        },
      ],
      pageSize: 10,
      totalSize: 100,
    },
    code: 0,
    errMsg: '',
  });

  return res.status(200).send(result);
};

export default {
  [`POST ${MOCK_API}/contract/create`]: create,
  [`GET ${MOCK_API}/contract/getContractFile/:id`]: getContractFileById,
  [`POST ${MOCK_API}/contract/modify`]: modify,
  [`POST ${MOCK_API}/contract/query`]: queryList,
};
