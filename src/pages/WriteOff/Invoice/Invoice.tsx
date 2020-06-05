import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Tabs, Row, Col, message } from 'antd';
import withRouter from 'umi/withRouter';
import { InvoiceModelState } from '@/models/invoice';
import { ContractModelState } from '@/models/contract';
import { getPageQuery } from '@/utils/utils';
import BeRelated from './BeRelated/BeRelated';
import ToBeRelated from './ToBeRelated/ToBeRelated';
import QnFormModal from '@/utils/Qneen/QnFormModal/QnFormModal';
import { formDict } from './formParams';
import { IContractDetail } from '../writeoff.d';
import { formatMoment } from '@/utils/format/dataFormatter';

interface IConnectState extends ConnectState {
  invoice: InvoiceModelState;
  contract: ContractModelState;
}

interface IProps extends ConnectProps, InvoiceModelState {
  dispatch: Dispatch;
  contractDetail: IContractDetail;
  queryInvoice: Function;
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

  componentDidMount() {}

  componentDidUpdate() {}

  createData = (params: any) => {
    const { contractDetail, queryInvoice } = this.props;
    const { customId, customName } = contractDetail;
    params.billingDate = formatMoment(params.billingDate, 'YYYYMMDD');
    params.customId = customId;
    params.customName = customName;
    const { dispatch } = this.props;
    dispatch({
      type: `invoice/create`,
      payload: {
        apiName: 'create',
        reqType: 'POST',
        bodyData: params,
      },
      successCallback: () => {
        message.success('录入成功');
        queryInvoice();
      },
    });
  };

  render() {
    const { contractDetail, queryInvoice } = this.props;

    const QnFormModalProps = {
      buttonProps: {
        type: 'default',
        title: '录入',
      },
      formDict,
      title: '录入发票信息',
      handleOk: this.createData,
      // extraData,
      // formInitialValueObj,
    };

    const genContractInfo = () => {
      const { customId, contractNo, effectiveDate, customName } = contractDetail;
      return (
        <Fragment>
          {/* <h3>合同信息</h3> */}
          {/* <Row>
            <Col span={6}>客户编号：{customId}</Col>
            <Col span={6}>合同编号：{contractNo}</Col>
            <Col span={6}>生效时间：{effectiveDate}</Col>
            <Col span={6}>客户名称：{customName}</Col>
          </Row> */}
          <div className="headLayout">
            <span>客户编号：{customId}</span>
            <span>合同编号：{contractNo}</span>
            <span>生效时间：{effectiveDate}</span>
            <span>客户名称：{customName}</span>
          </div>
          <br />
          <QnFormModal {...QnFormModalProps} />
        </Fragment>
      );
    };

    return (
      <Card className="wrapper-right-content" title="" bordered={false}>
        {contractDetail ? genContractInfo() : ''}
        <ToBeRelated queryInvoice={queryInvoice} />
        <BeRelated queryInvoice={queryInvoice} />
      </Card>
    );
  }
}

export default withRouter(Invoice as React.ComponentClass<any>);
