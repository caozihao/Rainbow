import { round } from '@/utils/format/math';

export default {
  billingDate: {
    name: 'billingDate',
    title: '开票日期',
  },
  identifierCode: {
    name: 'identifierCode',
    title: '发票识别号',
  },
  invoiceNo: {
    name: 'invoiceNo',
    title: '发票编号',
  },
  subject: {
    name: 'subject',
    title: '发票科目',
  },
  amount: {
    name: 'amount',
    title: '发票金额',
    render: (text: string) => round(text),
  },
  firstPayment: {
    name: 'firstPayment',
    title: '首付款',
  },
  balance: {
    name: 'balance',
    title: '余额',
  },
  receivableNum: {
    name: 'receivableNum',
    title: '期数',
  },
  productModel: {
    name: 'productModel',
    title: '机型',
  },
};
