import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Icon, Button, Tabs, Row, Col, Spin, message } from 'antd';
import { QnListPage, QnFormModal } from '@/utils/Qneen/index';
import withRouter from 'umi/withRouter';
import { InvoiceModelState } from '@/models/invoice';
import { genTableColumns } from '@/utils/format/dataGen';
import tableListParams from '../tableListParams';
import { getPageQuery } from '@/utils/utils';
import { IQueryParams } from '../../writeoff.d';

const { TabPane } = Tabs;

interface IConnectState extends ConnectState {
  invoice: InvoiceModelState;
}

interface IProps extends ConnectProps, InvoiceModelState {
  dispatch: Dispatch;
  unRelationToContractLoading: boolean;
  queryInvoice: Function;
}

interface IState {
  selectedRowKeys: Array<any>;
  defaultTabKey: string;
  beRelatedDataList: Array<any>;
}

@connect(({ invoice, loading }: IConnectState) => {
  const { dataList, beRelatedDataList } = invoice;
  return {
    unRelationToContractLoading: loading.effects['invoice/unRelationToContract'],
    dataList,
    beRelatedDataList,
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
    const { selectedRowKeys } = this.state;
    return (
      <Fragment>
        <br />
        <div className="headLayout">
          <h3>已关联的发票信息</h3>
          <Button
            onClick={this.unRelationToContract}
            disabled={!selectedRowKeys.length}
            // className="oboveArea"
            type="danger"
          >
            删除
          </Button>
        </div>
        <br />
      </Fragment>
    );
  };

  unRelationToContract = () => {
    const { dispatch, queryInvoice } = this.props;
    const { selectedRowKeys } = this.state;
    const { contractId } = getPageQuery();
    dispatch({
      type: 'invoice/unRelationToContract',
      payload: {
        apiName: 'unRelationToContract',
        reqType: 'POST',
        bodyData: {
          contractId,
          invoiceIds: selectedRowKeys,
        },
      },
      successCallback: () => {
        this.setState({
          selectedRowKeys: [],
        });
        queryInvoice();
        message.success('删除成功');
      },
    });
  };

  changeTab = (key: string) => {
    console.log('key ->', key);
  };

  render() {
    const { beRelatedDataList, unRelationToContractLoading } = this.props;
    const { defaultTabKey, selectedRowKeys } = this.state;
    const copyTableListParams = Object.assign({}, tableListParams);

    const QnListPagePropsBeRelated: object = {
      dataSource: beRelatedDataList,
      columns: genTableColumns(copyTableListParams),
      title: '已关联的发票信息',
      rowSelection: {
        selectedRowKeys,
        onChange: (selectedRowKeys = [], selectedRows = []) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.setState({
            selectedRowKeys,
          });
        },
      },
      col: 2,
      total: beRelatedDataList.length,
      hasPagination: false,
    };

    return (
      <Spin spinning={!!unRelationToContractLoading}>
        {this.genMiddleSectionBeRelated()}
        <QnListPage {...QnListPagePropsBeRelated} />
        {/* <Tabs defaultActiveKey={defaultTabKey} onChange={this.changeTab}>
          <TabPane tab="分期" key="instalment">
            <QnListPage {...QnListPagePropsBeRelated} />
          </TabPane>
          <TabPane tab="服务费" key="serviceFee">
            <QnListPage {...QnListPagePropsBeRelated} />
          </TabPane>
        </Tabs> */}
      </Spin>
    );
  }
}

export default withRouter(ToBeRelated as React.ComponentClass<any>);
