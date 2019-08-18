import { productTypeOption, constractStatusOption, contractTypeOption } from '@/constant';

export default [
  {
    tag: 'Select',
    name: 'productType',
    title: '产品类型',
    // otherProps: {mode: 'multiple' },
    // mode: 'multiple',
    options: productTypeOption,
  },
  {
    tag: 'Select',
    name: 'teamId',
    title: '团队',
    options: [],
  },
  {
    tag: 'Select',
    name: 'salesName',
    title: '销售经理姓名',
    options: [],
  },
  {
    tag: 'QnSelect',
    name: 'contractStatus',
    title: '合同状态',
    // Normal,Legal,3rd party
    options: constractStatusOption,
  },
  {
    tag: 'DatePicker',
    name: 'beginDate',
    title: '起始时间',
    // initValue: undefined,
  },
];
