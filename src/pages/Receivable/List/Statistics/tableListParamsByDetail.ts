import { round } from '@/utils/format/math';
import { constractStatusDict } from '@/constant';

export default {
  nper: {
    name: 'nper',
    title: '序号',
  },
  salerName: {
    name: 'salerName',
    title: '销售名字',
  },
  customStatus: {
    name: 'customStatus',
    title: '合同状态',
    render: (text: string) => {
      return constractStatusDict[text ? parseInt(text, 10) : ''];
    },
  },
  customName: {
    name: 'customName',
    title: '客户名称',
  },
  receivableTotal: {
    name: 'receivableTotal',
    title: '应收款合计',
    render: (text: string) => {
      return round(text);
    },
  },
  unOverdueAmount: {
    name: 'unOverdueAmount',
    title: '未逾期金额',
    render: (text: string) => {
      return round(text);
    },
  },
  day1_30: {
    name: 'day1_30',
    title: '1～30天',
  },
  day31_60: {
    name: 'day31_60',
    title: '31～60天',
  },
  day61_90: {
    name: 'day61_90',
    title: '61～90天',
  },
  day91_180: {
    name: 'day91_180',
    title: '91～180天',
  },
  day181_365: {
    name: 'day181_365',
    title: '181～365天',
  },
  day_lt_365: {
    name: 'day_lt_365',
    title: '>365天',
  },
  day_lt_90_total: {
    name: 'effectiveDate',
    title: '>90天合计',
  },
  day_lt_90_ratio: {
    name: 'effectiveDate',
    title: '>90天占比',
  },
  total: {
    name: 'total',
    title: '本期合计',
    render: (text: string) => {
      return round(text);
    },
  },
  actionPlan: {
    name: 'total',
    title: 'actionPlan',
  },
};
