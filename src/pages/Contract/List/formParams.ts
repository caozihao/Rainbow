import { productTypeOption, constractStatusOption, contractTypeOption } from '../../../constant';

const genInputParam = (name: string) => {
  return {
    title: name,
    tag: 'Input',
    required: true,
    // rules: [
    //   {
    //     required: true,
    //     message: `${name}不能为空`,
    //   },
    // ],
    otherProps: {},
  };
};

const formDict = {
  contractNo: genInputParam('合同号'),
  customId: genInputParam('客户编号'),
  type: {
    title: '合同类型',
    options: contractTypeOption,
    tag: 'QnSelect',
    required: true,
  },
  customName: genInputParam('客户名称'),
  xiaoshoujinhli: genInputParam('归属销售经理'),
  xiaoshoujinliyuangonghao: genInputParam('销售经理员工号'),

  contactName: genInputParam('联系人'),
  tel: genInputParam('联系方式'),
  email: genInputParam('邮箱'),

  // effectiveDate: {
  //   title: '生效日期',
  //   tag: 'DatePicker',
  //   rules: [
  //     {
  //       required: true,
  //       message: '生效日期不能为空',
  //     },
  //   ],
  // },
  //
  productType: {
    title: '产品类型',
    options: productTypeOption,
    tag: 'QnSelect',
    required: true,
  },
  status: {
    title: '合同状态',
    // Normal,Legal,3rd party
    options: constractStatusOption,
    tag: 'QnSelect',
    required: true,
  },
  totalAmount: genInputParam('总金额'),
  receivableNum: genInputParam('应收期数'),
  firstPayment: genInputParam('首付款'),
  periodPayment: genInputParam('每期应付'),
  // file: {
  //   title: '合同文件',
  //   tag: 'File',
  // },
};

const formInitialValueObj = {
  // tagSort: 'portrait',
  // speaker: 'all',
  // recorderType: [],
};

export { formDict, formInitialValueObj };
