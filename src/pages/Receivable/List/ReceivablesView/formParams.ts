
const genInputParam = (name: string, otherProps = {}) => {
  return {
    title: name,
    tag: 'Input',
    required: true,
    otherProps: {},
  };
};

const formDict = {
  // nper: genInputParam('期数'),
  receivablePayment: genInputParam('应收款合计'),
  actualPayment: genInputParam('本期实际到账'),
  unOverdueAmount: genInputParam('未逾期金额'),
  day1_5: genInputParam('1～5天'),
  day1_30: genInputParam('1～30天'),
  day6_30: genInputParam('6～30天'),
  day31_60: genInputParam('31～60天'),
  day61_90: genInputParam('61～90天'),
  day91_180: genInputParam('91～180天'),
  day181_365: genInputParam('181～365天'),
  day_lt_365: genInputParam('>365天'),
  day_lt_90_total: genInputParam('90天合计'),
  day_lt_90_ratio: genInputParam('90天占比'),
  total: genInputParam('本期合计'),
  // "contractId": "string",
  // "id": 0,
};

export { formDict };
