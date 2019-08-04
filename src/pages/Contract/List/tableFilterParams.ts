import { rangeTimeProps } from '../../../utils/format/dataFormatter';
import { productTypeOption, contractTypeOption } from '../../../constant';

export default [
  {
    tag: 'Input',
    name: 'contractNo',
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
    name: 'startDate,endDate',
    title: '生效时间',
    otherProps: rangeTimeProps,
  },
];
