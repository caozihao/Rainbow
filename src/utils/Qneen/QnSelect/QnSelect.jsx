import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Select } from 'antd';

const { Option, OptGroup } = Select;
const log = console.log.bind(console);

class QnSelect extends Component {
  constructor(props) {
    super(props);
    if (typeof this.props.value !== 'undefined') {
      this.state = { value: this.props.value };
    } else if (this.props.mode && this.props.mode === 'multiple') {
      this.state = { value: [] };
    } else {
      this.state = { value: '' };
    }
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  onChange = value => {
    const { formItemName, formProps } = this.props;
    this.setState({ value }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(value);
      }
    });
  };

  onFocus = value => {
    const { formItemName, formProps, onFocus } = this.props;
    this.setState({ value }, () => {
      if (typeof onFocus === 'function') {
        if (formItemName && formProps && formItemName === 'salesNo') {
          const salesName = formProps.getFieldValue('salesName');
          onFocus(salesName);
        } else {
          onFocus(value);
        }
      }
    });
  };
  getSelectOptions = (data, nameKey = 'label', valueKey = 'value') => {
    const options = [];
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i += 1) {
        const name = data[i][nameKey];
        const value = data[i][valueKey];
        options.push(
          <Option key={`${value}`} value={`${value}`}>
            {name}
          </Option>,
        );
      }
    }
    return options;
  };

  getSelectOptionsGroup = (data, nameKey = 'label', valueKey = 'value') => {
    const options = [];
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i += 1) {
        const name = data[i][nameKey];
        const value = data[i][valueKey];
        const children = data[i]['children'];
        const childrenGroup = [];
        if (children.length) {
          children.forEach(v => {
            childrenGroup.push(
              <Option key={`${v[valueKey]}`} value={`${v[valueKey]}`}>
                {v[nameKey]}
              </Option>,
            );
          });
        }
        options.push(
          <OptGroup key={`${value}`} label={`${name}`}>
            {childrenGroup}
          </OptGroup>,
        );
      }
    }
    return options;
  };

  filterOption = (input, option) => {
    // console.log('typeof option.props.children------->', typeof option.props.children);
    // console.log('typeof input------->', typeof input);
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  // 单个数值转换
  valueToStr = value => {
    // if (typeof value === 'string') {
    //   return value;
    // } else if (typeof value === 'number') {
    //   return `${value}`;
    // } else if (!value) {
    //   return undefined;
    // } else {
    //   console.log('select的value出错了,typeof value = ', typeof value);
    // }
    // if (typeof value === 'string' || typeof value === 'number') {
    //   return `${value}`;
    // } else if (!value) {
    //   return undefined;
    // } else {
    //   console.log('select的value出错了,typeof value = ', typeof value);
    // }

    // 简化版
    if (typeof value === 'string' || typeof value === 'number') {
      return `${value}`;
    } else if (typeof value === 'object') {
      return value;
    } else if (value) {
      log('select传入的值有错误');
      log('typeof value', typeof value);
      log('value', value);
    }
    //  else {
    //   return undefined;
    // }
  };

  // 全部数值转换
  formatSelectValue = value => {
    if (Array.isArray(value)) {
      return value.map(item => this.valueToStr(item));
    } else {
      return this.valueToStr(value);
    }
  };

  render() {
    const filterProps = {
      showSearch: true,
      optionFilterProp: 'children',
      filterOption: this.filterOption,
    };
    let modeProps = {};
    if (this.props.mode) {
      if (this.props.mode === 'multiple') {
        modeProps = {
          mode: this.props.mode,
          // multiple: true,
        };
      } else {
        modeProps = {
          mode: this.props.mode,
        };
      }
    }

    const {
      onDeselect,
      options,
      nameKey,
      valueKey,
      disabled,
      otherProps,
      width,
      style,
      allowClear,
    } = this.props;
    const { ifIsOptGroup } = otherProps;
    return (
      <Select
        className="QnSelect"
        {...filterProps}
        {...modeProps}
        {...otherProps}
        style={{ width, ...style }}
        allowClear={allowClear}
        value={this.formatSelectValue(this.state.value)}
        /* value={this.state.value} */
        onChange={this.onChange}
        onDeselect={onDeselect}
        onFocus={this.onFocus}
        disabled={disabled}
      >
        {ifIsOptGroup
          ? this.getSelectOptionsGroup(options, nameKey, valueKey)
          : this.getSelectOptions(options, nameKey, valueKey)}
      </Select>
    );
  }
}
QnSelect.propTypes = {
  onChange: propTypes.func,
  onDeselect: propTypes.func,
  options: propTypes.array,
  nameKey: propTypes.string,
  // nameKey: propTypes.oneOfType([
  //   propTypes.string,
  //   propTypes.array,
  // ]),
  valueKey: propTypes.string,
  disabled: propTypes.bool,
  mode: propTypes.string,
};

QnSelect.defaultProps = {
  onChange: () => {},
  onFocus: () => {},
  onDeselect: () => {},
  options: [],
  nameKey: 'label', // TODO 使得他可以是一个数组, 会将数组中的数据组合后用来显示
  valueKey: 'value',
  disabled: false,
  width: '100%',
  style: {},
  allowClear: true,
  // mode 可以设置多选
  // 其他属性,原封不动的传入antd原生select组件
  otherProps: {
    placeholder: '请选择(支持输入搜索)',
  },
  formItemName: '',
};
export default QnSelect;
