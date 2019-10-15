const genInputParam = (name: string, required = true) => {
  return {
    title: name,
    tag: 'Input',
    required,
    otherProps: {},
  };
};

const formDict = {
  identifierCode: genInputParam('发票识别号',false),
  invoiceNo: genInputParam('发票编号',false),
  billingDate: {
    title: '开票日期',
    tag: 'DatePicker',
    required: true,
    otherProps: {},
  },
  subject: genInputParam('发票科目'),
  amount: genInputParam('发票金额'),
};

export { formDict };
