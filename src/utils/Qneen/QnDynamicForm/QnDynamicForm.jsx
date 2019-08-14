/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
import React, { Component, Fragment } from 'react';
import propTypes, { object } from 'prop-types';
import { Form, Input, Icon, Button, Row, Col, message } from 'antd';
import styles from './QnDynamicForm.less';

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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log('this.props ', this.props);
        this.props.saveDynamicFormData(values);
        message.success('保存成功');
      }
    });
  };

  genInputGroup = (k, index) => {
    const { item } = this.props;
    const { getFieldDecorator } = this.props.form;
    const result = [];
    let number = 0;
    for (const key in item) {
      number++;
      result.push(
        <Col span={12} key={`${k}_${key}`}>
          <Form.Item {...this.formItemLayout} label={item[key]} required key={key}>
            {getFieldDecorator(`${key}_${k}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: `${item[key]}不能为空`,
                },
              ],
            })(<Input placeholder={`请输入${item[key]}`} />)}
            {number === 4 ? (
              <Fragment>
                <Icon
                  className={styles.deleteButton}
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                />
              </Fragment>
            ) : null}
          </Form.Item>
        </Col>,
      );
    }
    return result;
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { item, initData } = this.props;
    console.log('initData ->', initData);
    const initialValue = [];
    if (initData) {
      let copyInitData = JSON.parse(initData);
      copyInitData = copyInitData.filter(v => Object.keys(v).length !== 0);
      if (copyInitData.length) {
        copyInitData = copyInitData.forEach((v, i) => {
          const obj = {};
          for (const k in v) {
            obj[`${k}_${i}`] = v[k];
          }
          initialValue.push(obj);
        });
      }
    }
    getFieldDecorator('keys', { initialValue });

    const keys = getFieldValue('keys');
    console.log('initialValue ->', initialValue);
    console.log('keys ->', keys);

    let formItems = keys.map((k, index) => {
      return this.genInputGroup(k, index);
    });

    formItems = <Row>{formItems}</Row>;

    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        <Form.Item {...this.formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加联系人
          </Button>
        </Form.Item>
        <Form.Item {...this.formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit" style={{ width: '60%' }}>
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
QnDynamicForm.propTypes = {};
QnDynamicForm.defaultProps = {};
export default Form.create()(QnDynamicForm);
