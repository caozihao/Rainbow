import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Tabs, Row, Col } from 'antd';
import withRouter from 'umi/withRouter';
import { InvoiceModelState } from '@/models/invoice';
import { ContractModelState } from '@/models/contract';
import { getPageQuery } from '@/utils/utils';
import BeRelated from './BeRelated/BeRelated';
import ToBeRelated from './ToBeRelated/ToBeRelated';
import { IContractDetail } from '../writeoff.d';
import styles from '../WriteOff.less';
interface IConnectState extends ConnectState {
  invoice: InvoiceModelState;
  contract: ContractModelState;
}

interface IProps extends ConnectProps, InvoiceModelState {
  dispatch: Dispatch;
  contractDetail: IContractDetail;
}

interface IState {}

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
    this.state = {};
  }

  componentDidMount() {
    this.queryById();
  }

  componentDidUpdate() {}

  queryByCustomIdAndEffectTime = () => {
    const { dispatch, contractDetail } = this.props;
    const { customId, effectiveDate } = contractDetail;
    console.log('contractDetail ->', contractDetail);
    dispatch({
      type: 'invoice/queryByCustomIdAndEffectTime',
      payload: {
        apiName: 'queryByCustomIdAndEffectTime',
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
        this.queryByCustomIdAndEffectTime();
      },
    });
  };

  render() {
    const { contractDetail } = this.props;
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

    return (
      <Card className="wrapper-right-content" title="添加发票">
        {contractDetail ? genContractInfo() : ''}
        <ToBeRelated />
        <BeRelated />
      </Card>
    );
  }
}

export default withRouter(Invoice as React.ComponentClass<any>);
