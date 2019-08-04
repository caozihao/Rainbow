/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
import React, { Component, Fragment } from 'react';
import propTypes from 'prop-types';
import { Form, Input, Icon, Button, Row, Col, message } from 'antd';

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
        // console.log('Received values of form: ', values);
        message.success('保存成功')
      }
    });
  };

  genInputGroup = (data, index) => {
    // console.log('data ->', data);
    const { item } = this.props;
    const { getFieldDecorator } = this.props.form;
    const result = [];
    let number = 0;
    for (const key in item) {
      number++;
      result.push(
        <Col span={12}>
          <Form.Item {...this.formItemLayout} label={item[key]} required key={key}>
            {getFieldDecorator(`${key}_${index}`, {
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
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(data)}
              />
            ) : null}
          </Form.Item>
        </Col>,
      );
    }
    return result;
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    getFieldDecorator('keys', { initialValue: [] });

    const keys = getFieldValue('keys');

    let formItems = keys.map((data, index) => {
      return this.genInputGroup(data, index);
    });

    formItems = <Row>{formItems}</Row>;

    const { item } = this.props;

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
