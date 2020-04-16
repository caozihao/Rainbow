/* eslint-disable lines-between-class-members */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Upload, Button, Icon } from 'antd';
// import './QnUpload.less';

class QnUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  render() {
    this.uploadProps = {
      name: 'file',
      // action: service.upload,
      data: {
        // userId,
        // token,
      },
      multiple: true,
      onChange: info => {
        let { fileList } = info;
        fileList = fileList.slice(-10);
        // 给每个文件拼出下载链接
        fileList = fileList.map(() => {
        });
      },
    };
    return (
      <Upload className="QnUpload" {...this.uploadProps}>
        <Button>
          <Icon type="upload" /> Click to Upload
        </Button>
      </Upload>
    );
  }
}
QnUpload.propTypes = {};
QnUpload.defaultProps = {};
export default QnUpload;
