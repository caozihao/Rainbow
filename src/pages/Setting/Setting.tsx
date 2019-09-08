import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Row, Col, Form, Upload, Icon, Button, Input } from 'antd';
import withRouter from 'umi/withRouter';
import styles from './Setting.less';

interface IConnectState extends ConnectState {
  login: {
    [profile: string]: object;
  };
}

interface IProps extends ConnectProps {
  dispatch: Dispatch;
}

interface IState {}

@connect(({ login }: IConnectState) => ({
  profile: login.profile,
}))
class Setting extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: false,
      ifModifyPassword: false,
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  // handleClick = (e: Object): void => {};

  render() {
    const { ifModifyPassword } = this.state;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const data = [
      {
        key: 'headPortrait',
        title: '上传头像',
        value: (
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            // beforeUpload={beforeUpload}
            // onChange={this.handleChange}
          >
            {uploadButton}
          </Upload>
        ),
      },
      {
        key: 'accountNo',
        title: '员工号',
        value: '000001',
      },
      {
        key: 'name',
        title: '姓名',
        value: '张三',
      },
      {
        key: 'department',
        title: '所属部门',
        value: '业务拓展科',
      },
      {
        key: 'district',
        title: '所属地区',
        value: '东南地区',
      },
      {
        key: 'team',
        title: '所属团队',
        value: 'CFRKD',
      },
      {
        key: 'position',
        title: '职位',
        value: '经理',
      },
      {
        key: 'id',
        title: '联系方式',
        value: '13000000000',
      },
      {
        key: 'password',
        title: '密码',
        value: (
          <div className={styles.passwordArea}>
            <div>
              *********** &nbsp; &nbsp;
              <Button onClick={() => this.setState({ ifModifyPassword: true })}>修改</Button>
            </div>
            {ifModifyPassword ? (
              <Fragment>
                <div>
                  <Input style={{ width: 200 }} placeholder="新密码" />
                </div>
                <div>
                  <Input style={{ width: 200 }} placeholder="再一次输入密码" />
                </div>
                <div>
                  <Button type="primary" onClick={() => this.setState({ ifModifyPassword: false })}>
                    保存
                  </Button>
                </div>
              </Fragment>
            ) : (
              ''
            )}
          </div>
        ),
      },
    ];
    return (
      <Card className="wrapper-right-content" title="" bordered={false}>
        <div className={styles.container}>
          {data.map(v => {
            const { key, title, value } = v;
            return (
              <Row key={key}>
                <Col span={4}>
                  <b>{title} </b>:{' '}
                </Col>
                <Col span={18}>{value}</Col>
              </Row>
            );
          })}
        </div>
      </Card>
    );
  }
}

export default withRouter(Setting as any);
