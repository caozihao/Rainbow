import { productTypeOption, constractStatusOption, contractTypeOption } from '../../../constant';

const genInputParam = (name: string, otherProps = {}) => {
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
    // otherProps: {
    //   disabled: true,
    // },
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
  salesName: genInputParam('归属销售经理', { required: false }),
  salesNo: {
    title: '销售经理员工号',
    // options: productTypeOption,
    tag: 'QnSelect',
    required: false,
  },
  remark: {
    title: '备注',
    tag: 'Input',
  },
  // contactName: genInputParam('联系人'),
  // tel: genInputParam('联系方式'),
  // email: genInputParam('邮箱'),

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
  projectInfo: {
    tag: 'QnDynamicForm',
    title: '',
    otherProps: {
      columns: 2,
      dataType: 'projectInfo',
      item: {
        address: '联系地址',
        model: '产品机型',
        num: '产品数量',
      },
    },
  },
  contactsInfo: {
    tag: 'QnDynamicForm',
    title: '',
    otherProps: {
      columns: 2,
      dataType: 'contactsInfo',
      item: {
        connectName: '联系人',
        position: '职位',
        connectWay: '联系方式',
        email: '邮箱',
      },
    },
  },
  payments: {
    tag: 'QnDynamicForm',
    title: '',
    otherProps: {
      columns: 1,
      dataType: 'payments',
      item: {
        number: (index: any) => `第${index}期`,
      },
    },
  },
  // file: {
  //   title: '合同文件',
  //   tag: 'File',
  // },
};

export { formDict };
