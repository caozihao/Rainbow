/* eslint-disable react/destructuring-assignment */
import React, { Component, Fragment } from 'react';
import propTypes from 'prop-types';
import {
  Modal,
  Button,
  Input,
  InputNumber,
  DatePicker,
  Form,
  Tooltip,
  Icon,
  Spin,
  Row,
  Col,
} from 'antd';
import QnSelect from '../QnSelect/QnSelect';
import QnListTagAdder from '../QnListTagAdder/QnListTagAdder';
import QnUpload from '../QnUpload/QnUpload';
import QnDynamicForm from '../QnDynamicForm/QnDynamicForm';
// import './QnFormModal.less';
const log = console.log.bind(console);
const FormItem = Form.Item;

class QnFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    // const isChanged = (name) => {
    //   return (this.props[name] !== nextProps[name]);
    // };
    // if (isChanged('formDict')) {
    // }
  }

  handleTriggerBtnClick = () => {
    const { handleTriggerClick, isShow } = this.props;

    if (typeof handleTriggerClick === 'function') {
      handleTriggerClick();
    }

    if (typeof isShow === 'function') {
      if (isShow()) {
        this.setState({ visible: true });
      } else {
        this.setState({ visible: false });
      }
    } else if (!isShow) {
      this.setState({ visible: true });
    }
  };

  handleModalOk = () => {
    const { handleOk, formInitialValueObj, extraData, keyValue } = this.props;
    this.props.form.validateFields((error, values) => {
      if (!error) {
        if (typeof handleOk === 'function') {
          if (extraData && Object.keys(extraData).length) {
            values = Object.assign(extraData, values);
          }

          const result = handleOk(values);
          if (result instanceof Promise) {
            result.then(() => {
              this.handleOkAfterSubmit();
            });
          } else {
            this.handleOkAfterSubmit();
          }
        }
      }
    });
  };

  handleOkAfterSubmit = () => {
    if (this.props.ifResetAfterSuccess) {
      this.props.form.resetFields();
    }
    this.setState({ visible: false });
  };

  handleModalCancel = () => {
    this.props.handleCancel && this.props.handleCancel();
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  };

  genFormItem = (itemData, dataDict, initialValueObj) => {
    const { getFieldDecorator } = this.props.form;
    const inputLayout = {
      style: { width: '100%' },
    };

    const { rowsNumber, saveDynamicFormData, formInitialValueObj, type } = this.props;
    const name = typeof itemData === 'string' ? itemData : itemData.name;
    // const { name } = itemData;

    const { tag, title, required, otherProps, ...otherParams } = dataDict[name];
    let rules = [];
    if (required) {
      rules = [
        {
          required: true,
          message: `${title}不能为空`,
        },
      ];
    } else {
      rules = dataDict[name].rules || [];
    }

    const otherPropsOfForm = typeof itemData.otherProps === 'undefined' ? {} : itemData.otherProps;
    const otherPropsOfDict =
      typeof dataDict[name].otherProps === 'undefined' ? {} : dataDict[name].otherProps;
    const itemProps = { ...inputLayout, ...otherPropsOfDict, ...otherPropsOfForm, ...otherParams };
    let QnDynamicFormInitData = null;
    if (tag === 'QnDynamicForm' && formInitialValueObj && Object.keys(formInitialValueObj).length) {
      QnDynamicFormInitData = formInitialValueObj[name];
    }

    const formPartDict = {
      Input: <Input {...itemProps} allowClear />,
      InputNumber: <InputNumber {...itemProps} allowClear />,
      DatePicker: <DatePicker {...itemProps} allowClear />,
      QnSelect: (
        <QnSelect
          {...itemProps}
          options={dataDict[name].options}
          formItemName={name}
          formProps={this.props.form}
          {...otherProps}
        />
      ),
      Select: <QnSelect {...itemProps} options={dataDict[name].options} />,
      QnListTagAdder: <QnListTagAdder {...itemProps} />,
      File: <QnUpload {...itemProps} />,
      QnDynamicForm: (
        <QnDynamicForm
          {...otherProps}
          {...itemProps}
          initData={QnDynamicFormInitData}
          saveDynamicFormData={saveDynamicFormData}
          type={type}
        />
      ),
    };

    const formPart = formPartDict[tag];
    // 空对象在索引不存在的key值时, 会返回undefined ,但null和undefind若索引会报错并卡死
    const defaultInitialValue = initialValueObj || {};
    let formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
    };

    let colSpan = Math.ceil(24 / rowsNumber);
    if (tag === 'QnDynamicForm') {
      colSpan = 24;
      formItemLayout = {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
      };
    }

    const initialValue =
      typeof defaultInitialValue[name] === 'undefined' ? undefined : defaultInitialValue[name];
    return (
      <Col span={colSpan} key={name}>
        <FormItem {...formItemLayout} label={title}>
          {getFieldDecorator(name, {
            // valuePropName: 'value',
            initialValue,
            rules,
          })(formPart)}
        </FormItem>
      </Col>
    );
  };

  genFormItems = (itemDataArr, dataDict, initialValueObj, rowSplitTitleDict) => {
    if (Array.isArray(itemDataArr) && itemDataArr.length > 0) {
      const items = [];
      for (let i = 0; i < itemDataArr.length; i += 1) {
        if (rowSplitTitleDict) {
          if (rowSplitTitleDict[i]) {
            items.push(
              <Col span={24} style={{ paddingBottom: '10px' }} key={i}>
                {i !== 0 ? <hr style={{ marginBottom: '20px' }} /> : ''}
                <b>{rowSplitTitleDict[i]}</b>
              </Col>,
            );
          }
        }
        items.push(this.genFormItem(itemDataArr[i], dataDict, initialValueObj));
      }
      return <Row>{items}</Row>;
    }
  };

  getAllFormItemsFromDict = dict => {
    const items = [];
    for (const itemKey in dict) {
      if (Object.prototype.hasOwnProperty.call(dict, itemKey)) {
        items.push({ name: itemKey });
      }
    }
    return items;
  };

  render() {
    const {
      triggerType,
      buttonProps,
      formItems,
      formInitialValueObj,
      hasTooltip,
      title,
      ifShowFormLoading,
      formDict,
      triggerTitle,
      otherProps,
      width,
      rowSplitTitleDict,
      type,
    } = this.props;

    let trigger = null;
    if (triggerType === 'button') {
      trigger = (
        <Button {...buttonProps} className="triggerBtn" onClick={this.handleTriggerBtnClick}>
          {buttonProps.title}
        </Button>
      );
    } else if (triggerType === 'a') {
      trigger = <a onClick={this.handleTriggerBtnClick}>{triggerTitle}</a>;
    }

    const itemDataArr = formItems || this.getAllFormItemsFromDict(formDict);
    const formItemData = this.genFormItems(
      itemDataArr,
      formDict,
      formInitialValueObj,
      rowSplitTitleDict,
    );

    let extraParam = {};
    if (type === 'detail') {
      extraParam = {
        footer: null,
      };
    }

    return (
      <span className="QnFormModal">
        {hasTooltip ? <Tooltip title={title}>{trigger}</Tooltip> : trigger}
        <Modal
          className="mainModal"
          title={title}
          visible={this.state.visible}
          maskClosable={false}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          width={width}
          destroyOnClose={true}
          closable
          {...extraParam}
          {...otherProps}
        >
          <Spin spinning={ifShowFormLoading}>{formItemData}</Spin>
        </Modal>
      </span>
    );
  }
}
QnFormModal.propTypes = {};
QnFormModal.defaultProps = {
  title: '打开modal',
  triggerType: 'button', // 触发器的样式 可以是button | a,
  triggerTitle: (
    <span>
      <Icon type="edit" />
      打开modal
    </span>
  ),
  buttonProps: {
    type: 'primary',
    icon: 'plus',
    title: <Icon type="rocket" />,
  },
  handleTriggerClick: null,
  isShow: null,
  handleOk: () => {},
  handleCancel: () => {},
  // formItems:格式
  // [
  //   {
  //     name: 'tagName',
  //     otherProps: {},
  //   },
  //   {
  //     name: 'tagSort',
  //   },
  //   {
  //     name: 'speaker',
  //   },
  // ];
  formItems: null,
  // formItems 格式
  // tagSort: {
  //   title: '标签分类',
  //   options: [
  //     {
  //       title: '客户画像',
  //       name: "portrait",
  //     },
  //     {
  //       title: '客户资料',
  //       name: "info",
  //     },
  //     {
  //       title: '话术标签',
  //       name: "tag",
  //     },
  //   ],
  //   tag: 'QnSelect',
  //   rules: [
  //     {
  //       required: true,
  //       message: '标签分类不能为空',
  //     },
  //   ],
  //   otherProps: {
  //     nameKey: 'id',
  //     valueKey: 'name',
  //   },
  // },
  required: false,
  formDict: null,
  formInitialValueObj: null,
  hasTooltip: false,
  // creditorList: [],
  ifResetAfterSuccess: true,
  ifShowFormLoading: false,
  width: 500,
  rowsNumber: 1,
  rowSplitTitleDict: null,
  saveDynamicFormData: () => {},
  type: 'form', // detail | ""，默认是表单
  extraData: null, // 额外的数据
};

export default Form.create()(QnFormModal);
