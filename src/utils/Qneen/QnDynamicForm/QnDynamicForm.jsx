/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
import React, { Component, Fragment } from 'react';
import propTypes, { object } from 'prop-types';
import { Form, Input, Icon, Button, Row, Col, message } from 'antd';
import styles from './QnDynamicForm.less';
import classNames from 'classnames';

let id = 0;

class QnDynamicForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
    };
    this.formItemLayoutWithOutLabel = {
      labelCol: { span: 0 },
      wrapperCol: { span: 14, offset: 7 },
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dataType } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        this.props.saveDynamicFormData(dataType, values);
        message.success('保存成功');
      }
    });
  };

  genInputGroup = (k, index, initialValueDict) => {
    const { item, type, columns, dataType, form } = this.props;
    const { getFieldDecorator } = form;
    const result = [];
    let number = 0;
    const keys = form.getFieldValue('keys');
    for (const key in item) {
      const dataKey = `${key}_${index}`;
      number++;

      const label = typeof item[key] === 'function' ? item[key](index + 1) : item[key];

      let iconResult = '';
      if (
        (dataType === 'payments' && index === keys.length - 1 && type === 'form') ||
        (dataType === 'contactsInfo' && number === 4 && type === 'form')
      ) {
        iconResult = (
          <Icon
            className={classNames(styles.deleteButton, dataType)}
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        );
      }

      let initialValue = '';
      if (dataType === 'contactsInfo') {
        initialValue = initialValueDict[k] ? initialValueDict[k][dataKey] : '';
      } else if (dataType === 'payments') {
        initialValue = k[dataKey];
      }

      result.push(
        <Col span={24 / columns} key={dataKey}>
          <Form.Item {...this.formItemLayout} label={label} required key={key}>
            {getFieldDecorator(dataKey, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: `${label}不能为空`,
                },
              ],
            })(<Input placeholder={`请输入${label}`} />)}

            {iconResult}
          </Form.Item>
        </Col>,
      );
    }
    return result;
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { item, initData, type, dataType } = this.props;

    const initialValue = [];
    let keysInitialValue = [];
    if (initData) {
      if (dataType === 'contactsInfo') {
        let copyInitData = JSON.parse(initData);
        copyInitData = copyInitData.filter(v => Object.keys(v).length !== 0);
        if (copyInitData.length) {
          copyInitData = copyInitData.forEach((v, i) => {
            const obj = {};
            for (const k in v) {
              obj[`${k}_${i}`] = v[k];
            }
            initialValue.push(obj);
            keysInitialValue.push(i);
            id++;
          });
        }
      } else if (dataType === 'payments') {
        keysInitialValue = initData.split(',').map((v, i) => {
          return {
            [`number_${i}`]: v,
          };
        });
      }
    }

    getFieldDecorator('keys', { initialValue: keysInitialValue });

    const keys = getFieldValue('keys');
    let formItems =
      keys &&
      keys.map((k, index) => {
        return this.genInputGroup(k, index, initialValue);
      });

    formItems = <Row>{formItems}</Row>;

    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        {type === 'form' ? (
          <Fragment>
            <Form.Item {...this.formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> 添加
              </Button>
            </Form.Item>
            <Form.Item {...this.formItemLayoutWithOutLabel}>
              <Button type="primary" htmlType="submit" style={{ width: '60%' }}>
                提交
              </Button>
            </Form.Item>
          </Fragment>
        ) : (
          ''
        )}
      </Form>
    );
  }
}
QnDynamicForm.propTypes = {};
QnDynamicForm.defaultProps = {};
export default Form.create()(QnDynamicForm);
