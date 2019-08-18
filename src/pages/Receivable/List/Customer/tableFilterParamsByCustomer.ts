import { productTypeOption, constractStatusOption, contractTypeOption } from '@/constant';

export default [
  {
    tag: 'Input',
    name: 'customName',
    title: '客户名称',
    // initValue: undefined,
  },
  {
    tag: 'Input',
    name: 'contractId',
    title: '合同编号',
    // initValue: undefined,
  },
  {
    tag: 'Input',
    name: 'customId',
    title: '客户编号',
    // initValue: undefined,
  },
  {
    tag: 'Select',
    name: 'salesName',
    title: '销售经理姓名',
    // initValue: [],
    // otherProps: {mode: 'multiple' },
    // mode: 'multiple',
    options: [],
  },
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
    name: 'type',
    title: '合同类型',
    // initValue: [],
    // otherProps: {mode: 'multiple' },
    // mode: 'multiple',
    options: contractTypeOption,
  },
  {
    tag: 'RangePicker',
    name: 'beginDate,endDate',
    title: '起始结束时间',
    // initValue: undefined,
  },
];
