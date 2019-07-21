// import { formatDate } from '../../src/utils/format/dataFormatter';
var Mock = require('mockjs');

const data = Mock.mock({
  'data|100': [
    {
      'id|+1': 0,
      contractOrder: Mock.Random.guid(),
      customerOrder: Mock.Random.guid(),
      'companyName|1': ['阿里巴巴', '腾讯', '百度'],
      'contractType|1': ['大合同', '小合同'],
      totalPrice: Mock.Random.float(),
      effectTime: Mock.Random.now(),
    },
  ],
});

export default data.data;
