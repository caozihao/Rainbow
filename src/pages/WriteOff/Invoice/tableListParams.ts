import {round} from '@/utils/format/math'

export default {
  identifierCode: {
    name: 'identifierCode',
    title: '发票识别号',
  },
  invoiceNo: {
    name: 'invoiceNo',
    title: '发票编号',
  },
  customId: {
    name: 'customId',
    title: '客户编号',
  },
  customName: {
    name: 'customName',
    title: '客户名称',
  },
  subject: {
    name: 'subject',
    title: '发票科目',
  },
  amount: {
    name: 'amount',
    title: '发票金额',
    render: (text: string) => {
      return round(text)
    },
  },
  billingDate: {
    name: 'billingDate',
    title: '开票日期',
  },
};
