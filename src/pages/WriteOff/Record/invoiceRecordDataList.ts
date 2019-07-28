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
  },
  firstPayment: {
    name: 'firstPayment',
    title: '首付款',
  },
  balance: {
    name: 'balance',
    title: '余额',
    render: (text, record) => {
      const { amount, firstPayment } = record;
      return round(parseFloat(amount) - parseFloat(firstPayment));
    },
  },
  receivableNum: {
    name: 'receivableNum',
    title: '期数',
  },
};
