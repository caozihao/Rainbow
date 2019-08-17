import { productTypeDict, contractTypeDict, constractStatusDict } from '@/constant';
import {round} from '@/utils/format/math'

export default {
  contractNo: {
    name: 'contractNo',
    title: '合同编号',
  },
  customId: {
    name: 'customId',
    title: '客户编号',
  },
  customName: {
    name: 'customName',
    title: '客户名称',
  },
  productType: {
    name: 'productType',
    title: '产品类型',
    render: (text: string) => {
      return productTypeDict[text];
    },
  },
  type: {
    name: 'productType',
    title: '合同类型',
    render: (text: string) => {
      return contractTypeDict[text];
    },
  },
  totalAmount: {
    name: 'totalAmount',
    title: '总金额',
    render: (text: string) => {
      return round(text)
    },
  },
  effectiveDate: {
    name: 'effectiveDate',
    title: '生效时间',
  },
};
