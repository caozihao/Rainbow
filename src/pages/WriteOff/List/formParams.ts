import { productTypeOption, constractStatusOption, contractTypeOption } from '../../../constant';

const genInputParam = (name: string) => {
  return {
    title: name,
    tag: 'Input',
    required: true,
    otherProps: {},
  };
};

const formDict = {
  contractNo: genInputParam('合同号'),
  customId: genInputParam('客户编号'),
  type: {
    title: '合同类型',
    contractTypeOption,
    tag: 'QnSelect',
    required: true,
  },
  customName: genInputParam('客户名称'),
  contactName: genInputParam('联系人'),
  tel: genInputParam('联系方式'),
  email: genInputParam('邮箱'),
  effectiveDate: {
    title: '生效日期',
    tag: 'DatePicker',
    required: true,
  },
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
  periodPayment: {
    title: '每期应付',
    // Normal,Legal,3rd party
    options: [
      {
        title: '自动生成',
        name: 'auto',
      },
    ],
    tag: 'QnSelect',
    required: true,
  },
  file: {
    title: '合同文件',
    tag: 'File',
  },
};

const formInitialValueObj = {
  // tagSort: 'portrait',
  // speaker: 'all',
  // recorderType: [],
};

export { formDict, formInitialValueObj };
