import React from 'react';
import { round } from '@/utils/format/math';

export default {
  settlementId: {
    name: 'settlementId',
    title: <span className="color-red">序号</span>,
  },
  payDate: {
    name: 'payDate',
    title: <span className="color-red">开票日期</span>,
  },
  payAmount: {
    name: 'payAmount',
    title: <span className="color-red">发票金额</span>,
    render: (text: string) => {
      return round(text)
    },
  },
  invoiceNo: {
    name: 'invoiceNo',
    title: <span className="color-red">发票编号</span>,
  },
  actualPayAmount: {
    name: 'actualPayAmount',
    title: '实际收款金额',
    render: (text: string) => {
      return round(text)
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
      return round(text)
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
      return round(text)
    },
  },

  planPayAmount: {
    name: 'planPayAmount',
    title: <span className="color-red">每期计划收款金额</span>,
    render: (text: string) => {
      return round(text)
    },
  },
};
