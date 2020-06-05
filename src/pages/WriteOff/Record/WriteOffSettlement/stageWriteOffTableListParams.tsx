import React from 'react';
import { round } from '@/utils/format/math';

export default {
  settlementId: {
    name: 'settlementId',
    title: <span className="color-red">序号</span>,
  },
  payMonth: {
    name: 'payMonth',
    title: <span className="color-red">月份</span>,
  },
  planPayAmount: {
    name: 'planPayAmount',
    title: <span className="color-red">每期计划收款金额</span>,
    render: (text: string) => {
      return round(text);
    },
  },
  planNumOfPeriods: {
    name: 'planNumOfPeriods',
    title: <span className="color-red">计划期数</span>,
    // render: (text, record) => {
    //   let result = '';
    //   if (text === 0) {
    //     result = '首付款';
    //   } else {
    //     result = `第${text}期`;
    //   }
    //   return result;
    // },
  },
  actualPayAmount: {
    name: 'actualPayAmount',
    title: '实际收款金额',
    render: (text: string) => {
      return round(text);
    },
  },
  actualPayDate: {
    name: 'actualPayDate',
    title: '实际到账日期',
  },
  overdueAmount: {
    name: 'overdueAmount',
    title: <span className="color-blue">逾期应收款金额</span>,
    render: (text: string) => {
      return round(text);
    },
  },
  overdueNumOfDate: {
    name: 'overdueNumOfDate',
    title: <span className="color-blue">逾期天数</span>,
  },
  accumulatedPayAmount: {
    name: 'accumulatedPayAmount',
    title: <span className="color-blue">累计收款金额</span>,
    render: (text: string) => {
      return round(text);
    },
  },

  receivableReasonable: {
    name: 'receivableReasonable',
    title: <span className="color-blue">应收款余额</span>,
    render: (text: string) => {
      return round(text);
    },
  },
  remark: {
    name: 'remark',
    title: <span className="color-blue">备注</span>,
  },
};
