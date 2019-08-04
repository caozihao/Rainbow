import { productTypeOption, constractStatusOption, contractTypeOption } from '../../../constant';

export default [
  {
    tag: 'Input',
    name: 'customName',
    title: '客户名称',
    // initValue: undefined,
  },
  {
    tag: 'Input',
    name: 'contractNo',
    title: '合同编号',
    // initValue: undefined,
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
];
