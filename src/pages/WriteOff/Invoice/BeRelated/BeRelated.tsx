import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Icon, Button, Tabs, Row, Col } from 'antd';
import { QnListPage, QnFormModal } from '@/utils/Qneen/index';
import withRouter from 'umi/withRouter';
import { InvoiceModelState } from '@/models/invoice';
import { genTableColumns } from '@/utils/format/dataGen';
import tableListParams from '../tableListParams';
import styles from './../Invoice.less';

const { TabPane } = Tabs;

interface IConnectState extends ConnectState {
  invoice: InvoiceModelState;
}

interface IProps extends ConnectProps, InvoiceModelState {
  dispatch: Dispatch;
}

interface IState {
  selectedRowKeys: Array<any>;
  defaultTabKey: string;
}

@connect(({ invoice }: IConnectState) => {
  const { dataList } = invoice;
  return {
    dataList,
  };
})
class ToBeRelated extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      defaultTabKey: 'instalment',
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  genMiddleSectionBeRelated = () => {
    return (
      <Fragment>
        <br />
        <div className={styles.headLayout}>
          <h3>已关联的发票信息</h3>
          <Button style={{ marginRight: '1rem' }} type="danger">
            删除
          </Button>
        </div>
      </Fragment>
    );
  };

  changeTab = (key: string) => {
    console.log('key ->', key);
  };

  render() {
    const { dataList } = this.props;
    const { defaultTabKey } = this.state;
    const copyTableListParams = Object.assign({}, tableListParams);

    const QnListPagePropsBeRelated: object = {
      dataSource: dataList,
      columns: genTableColumns(copyTableListParams),
      title: '已关联的发票信息',
      rowSelection: {
        onChange: (selectedRowKeys = [], selectedRows = []) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.setState({
            selectedRowKeys,
          });
        },
      },
      col: 2,
      total: dataList.length,
      hasPagination: false,
    };

    return (
      <div /* className={styles.ToBeRelated} */>
        {this.genMiddleSectionBeRelated()}
        <Tabs defaultActiveKey={defaultTabKey} onChange={this.changeTab}>
          <TabPane tab="分期" key="instalment">
            <QnListPage {...QnListPagePropsBeRelated} />
          </TabPane>
          <TabPane tab="服务费" key="serviceFee">
            <QnListPage {...QnListPagePropsBeRelated} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default withRouter(ToBeRelated as React.ComponentClass<any>);
