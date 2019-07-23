import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Icon, Button, Tabs, Row, Col } from 'antd';
import { QnListPage, QnFormModal } from '@/utils/Qneen/index';
import withRouter from 'umi/withRouter';
import { InvoiceModelState } from '@/models/invoice';
import { ContractModelState } from '@/models/contract';

import { genTableColumns } from '@/utils/format/dataGen';
import tableListParams from './tableListParams';
import { getPageQuery, dealWithQueryParams, updateRoute } from '@/utils/utils';
import styles from './Invoice.less';

const { TabPane } = Tabs;
interface IConnectState extends ConnectState {
  invoice: InvoiceModelState;
  contract: ContractModelState;
}

interface IProps extends ConnectProps, InvoiceModelState, ContractModelState {
  dispatch: Dispatch;
  contractDetail: Array<object>;
}

interface IState {
  selectedRowKeysToBeRelated: Array<any>;
  selectedRowKeysBeRelate: Array<any>;
  defaultTabKey: string;
}

@connect(({ invoice, contract }: IConnectState) => {
  const { dataList } = invoice;
  const { detail } = contract;
  return {
    dataList,
    contractDetail: detail,
  };
})
class Invoice extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedRowKeysToBeRelated: [],
      selectedRowKeysBeRelate: [],
      defaultTabKey: 'instalment',
    };
  }

  componentDidMount() {
    this.queryById();
  }

  componentDidUpdate() {}

  genMiddleSectionToBeRelated = () => {
    return (
      <Fragment>
        <div className={styles.headLayout}>
          <h3>
            待关联的发票信息{' '}
            <a
              onClick={() => {
                alert('刷新');
              }}
              href="javascript:void(0)"
            >
              <Icon type="sync" style={{ marginLeft: '0.5rem' }} />
            </a>
          </h3>
          <div>
            <Button style={{ marginRight: '1rem' }} type="primary">
              添加到分期
            </Button>
            <Button>添加到服务费</Button>
          </div>
        </div>
        <br />
      </Fragment>
    );
  };

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

  queryByCustomIdAndEffactTime = () => {
    const { dispatch, contractDetail } = this.props;
    const { customId, effectiveDate } = contractDetail;
    console.log('contractDetail ->', contractDetail);
    dispatch({
      type: 'invoice/queryByCustomIdAndEffactTime',
      payload: {
        apiName: 'queryByCustomIdAndEffactTime',
        reqType: 'GET',
        queryData: {
          customId,
          effectiveDate,
        },
      },

      successCallback: () => {},
    });
  };

  queryById = () => {
    const contractId = getPageQuery('contractId');
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/queryById',
      payload: {
        apiName: 'queryById',
        reqType: 'GET',
        placeholerData: {
          contractId,
        },
      },
      successCallback: () => {
        this.queryByCustomIdAndEffactTime();
      },
    });
  };

  // handleClick = (e: Object): void => {};

  changeTab = (key: string) => {
    console.log('key ->', key);
  };

  render() {
    const { dataList, contractDetail } = this.props;
    const { defaultTabKey } = this.state;

    const copyTableListParams = Object.assign({}, tableListParams);

    const QnListPagePropsToBeRelated: object = {
      dataSource: dataList,
      columns: genTableColumns(copyTableListParams),
      title: '',
      rowSelection: {
        onChange: (selectedRowKeysToBeRelated = [], selectedRows = []) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeysToBeRelated}`,
            'selectedRows: ',
            selectedRows,
          );
          this.setState({
            selectedRowKeysToBeRelated,
          });
        },
      },
      col: 2,
      total: dataList.length,
      hasPagination: false,
      middleSection: this.genMiddleSectionToBeRelated(),
    };

    const QnListPagePropsBeRelated: object = {
      dataSource: dataList,
      columns: genTableColumns(copyTableListParams),
      title: '已关联的发票信息',
      rowSelection: {
        onChange: (selectedRowKeysBeRelate = [], selectedRows = []) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeysBeRelate}`,
            'selectedRows: ',
            selectedRows,
          );
          this.setState({
            selectedRowKeysBeRelate,
          });
        },
      },
      col: 2,
      total: dataList.length,
      hasPagination: false,
    };

    const beRelatedTab = (
      <Fragment>
        {this.genMiddleSectionBeRelated()}
        <Tabs defaultActiveKey={defaultTabKey} onChange={this.changeTab}>
          <TabPane tab="分期" key="instalment">
            <QnListPage {...QnListPagePropsBeRelated} />
          </TabPane>
          <TabPane tab="服务费" key="serviceFee">
            <QnListPage {...QnListPagePropsBeRelated} />
          </TabPane>
        </Tabs>
      </Fragment>
    );

    const genContractInfo = () => {
      const { customId, contractNo, effectiveDate, customName } = this.props.contractDetail;
      return (
        <Fragment>
          <h3>合同信息</h3>
          {/* <Row>
            <Col span={6}>客户编号：{customId}</Col>
            <Col span={6}>合同编号：{contractNo}</Col>
            <Col span={6}>生效时间：{effectiveDate}</Col>
            <Col span={6}>客户名称：{customName}</Col>
          </Row> */}
          <div className={styles.headLayout}>
            <span>客户编号：{customId}</span>
            <span>合同编号：{contractNo}</span>
            <span>生效时间：{effectiveDate}</span>
            <span>客户名称：{customName}</span>
          </div>
          <br />
        </Fragment>
      );
    };

    return (
      <Card className="wrapper-right-content" title="添加发票">
        {contractDetail ? genContractInfo() : ''}
        <QnListPage {...QnListPagePropsToBeRelated} />
        {beRelatedTab}
      </Card>
    );
  }
}

export default withRouter(Invoice as React.ComponentClass<any>);
