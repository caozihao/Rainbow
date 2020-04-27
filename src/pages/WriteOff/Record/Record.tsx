import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Tabs, Row, Col } from 'antd';
import withRouter from 'umi/withRouter';
import { InvoiceModelState } from '@/models/invoice';
import { ContractModelState } from '@/models/contract';
import { getPageQuery, updateRoute } from '@/utils/utils';
import InvoiceRecord from './InvoiceRecord/InvoiceRecord';
import { WriteOffModelState } from '@/models/writeOff';
import { IQueryParams, IContractDetail } from '../writeoff.d';
import WriteOffSettlement from './WriteOffSettlement/WriteOffSettlement';

const { TabPane } = Tabs;

interface IConnectState extends ConnectState {
  writeOff: WriteOffModelState;
  contract: ContractModelState;
}

interface IProps extends ConnectProps, InvoiceModelState {
  dispatch: Dispatch;
  contractDetail: IContractDetail;
  queryDataByContractId: Function;
  queryRelatedInvoice: Function;
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
      tabType: getPageQuery()['tabType'] || 'stageWriteOff',
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  changeTab = (tabType: string) => {
    const newQueryParams = Object.assign(getPageQuery(), { tabType });

    if (tabType === 'stageWriteOff') {
      this.props.queryRelatedInvoice();
    }
    this.setState(
      {
        tabType,
      },
      () => {
        this.props.queryDataByContractId(tabType);
        updateRoute(newQueryParams);
      },
    );
  };

  render() {
    const { contractDetail, dataList } = this.props;
    const { tabType } = this.state;
    const genContractInfo = () => {
      const {
        customId,
        contractNo,
        effectiveDate,
        customName,
        firstPayment,
        balance,
        receivableNum,
      } = contractDetail;
      return (
        <Fragment>
          <Row>
            <Col span={6}>客户编号：{customId}</Col>
            <Col span={6}>合同编号：{contractNo}</Col>
            <Col span={6}>生效时间：{effectiveDate}</Col>
            <Col span={6}>客户名称：{customName}</Col>
          </Row>
          <Row>
            <Col span={6}>首付款：{firstPayment}</Col>
            {/* <Col span={6}>余额：{0}</Col> */}
            <Col span={6}>期数：{receivableNum}</Col>
          </Row>
          <br />
        </Fragment>
      );
    };

    // const pageTitle = getPageQuery().type === 'edit' ? '编辑' : '查看';

    // const dataSource =

    const { contractType } = getPageQuery();

    const WriteOffSettlementProps = {
      dataSource: dataList,
      queryDataByContractId: this.props.queryDataByContractId,
    };
    return (
      <Card className="wrapper-right-content" title="" bordered={false}>
        <Fragment>
          {contractDetail ? genContractInfo() : ''}

          <Tabs activeKey={tabType} onChange={this.changeTab}>
            {contractType === '0' ? (
              <TabPane tab="分期核销" key="stageWriteOff">
                <InvoiceRecord />
                <WriteOffSettlement {...WriteOffSettlementProps} />
              </TabPane>
            ) : (
              <TabPane tab="服务费核销" key="serviceWriteOff">
                <WriteOffSettlement {...WriteOffSettlementProps} />
              </TabPane>
            )}
          </Tabs>
        </Fragment>
      </Card>
    );
  }
}

export default withRouter(Record as React.ComponentClass<any>);
