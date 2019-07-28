import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Tabs } from 'antd';
import withRouter from 'umi/withRouter';
import { InvoiceModelState } from '@/models/invoice';
import { ContractModelState } from '@/models/contract';
import { getPageQuery, updateRoute } from '@/utils/utils';
import InvoiceRecord from './InvoiceRecord/InvoiceRecord';
import { WriteOffModelState } from '@/models/writeOff';
import { IQueryParams, IContractDetail } from '../writeoff.d';
import WriteOffSettlement from './WriteOffSettlement/WriteOffSettlement';
import styles from '../WriteOff.less';

const { TabPane } = Tabs;

interface IConnectState extends ConnectState {
  writeOff: WriteOffModelState;
  contract: ContractModelState;
}

interface IProps extends ConnectProps, InvoiceModelState {
  dispatch: Dispatch;
  contractDetail: IContractDetail;
}

interface IState {
  tabType: string;
}

@connect(({ writeOff, contract }: IConnectState) => {
  const { dataList } = writeOff;
  const { detail } = contract;
  return {
    dataList,
    contractDetail: detail,
  };
})
class Record extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      tabType: this.queryParams['tabType'] || 'stageWriteOff',
    };
  }

  queryParams: IQueryParams = getPageQuery();

  componentDidMount() {
    this.queryById();
    this.queryDataByContractId();
  }

  componentDidUpdate() {}

  queryById = () => {
    const { contractId } = this.queryParams;
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
      successCallback: () => {},
    });
  };

  queryDataByContractId = (type = 'stageWriteOff') => {
    const { contractId } = this.queryParams;
    const { dispatch } = this.props;

    let api =
      type === 'stageWriteOff' ? 'querySettlementByContractId' : 'queryCommissionByContractId';

    dispatch({
      type: `writeOff/${api}`,
      payload: {
        apiName: api,
        reqType: 'GET',
        placeholerData: {
          contractId,
        },
      },
      successCallback: () => {},
    });
  };

  changeTab = (tabType: string) => {
    console.log('tabType ->', tabType);
    const newQueryParams = Object.assign(this.queryParams, { tabType });
    this.setState(
      {
        tabType,
      },
      () => {
        this.queryDataByContractId(tabType);
        updateRoute(newQueryParams);
      },
    );
  };

  render() {
    const { contractDetail, dataList } = this.props;
    const { tabType } = this.state;
    const genContractInfo = () => {
      const { customId, contractNo, effectiveDate, customName } = contractDetail;
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

    const pageTitle = this.queryParams.type === 'edit' ? '编辑' : '查看';
    const headTitle = tabType === 'stageWriteOff' ? '核销结算' : '服务费核销结算';
    // const dataSource =

    const WriteOffSettlementProps = {
      dataSource: dataList,
      headTitle,
    };

    return (
      <Card className="wrapper-right-content" title={pageTitle}>
        {contractDetail ? genContractInfo() : ''}

        <Tabs activeKey={tabType} onChange={this.changeTab}>
          <TabPane tab="分期核销" key="stageWriteOff">
            <InvoiceRecord />
            <WriteOffSettlement {...WriteOffSettlementProps} />
          </TabPane>
          <TabPane tab="服务费核销" key="serviceWriteOff">
            <WriteOffSettlement {...WriteOffSettlementProps} />
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default withRouter(Record as React.ComponentClass<any>);
