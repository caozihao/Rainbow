import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Button, message } from 'antd';
import withRouter from 'umi/withRouter';
import { QnListPage } from '@/utils/Qneen';
import { InvoiceModelState } from '@/models/invoice';
import { ContractModelState } from '@/models/contract';
import { genTableColumns } from '@/utils/format/dataGen';
import tableListParams from '../invoiceRecordDataList';
import { getPageQuery } from '@/utils/utils';
import { IQueryParams, IContractDetail } from '../../writeoff.d';

interface IConnectState extends ConnectState {
  invoice: InvoiceModelState;
  contract: ContractModelState;
}

interface IProps extends ConnectProps, InvoiceModelState {
  dispatch: Dispatch;
  contractDetail: IContractDetail;
}

interface IState {
  defaultTabKey: string;
}

@connect(({ invoice, contract }: IConnectState) => {
  const { invoiceRecordDataList } = invoice;
  const { detail } = contract;
  return {
    invoiceRecordDataList,
    contractDetail: detail,
  };
})
class ToBeRelated extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      defaultTabKey: 'instalment',
    };
  }

  queryParams: IQueryParams = getPageQuery();

  componentDidMount() {}

  componentDidUpdate() {}

  exportByContractId = () => {
    const { contractId, tabType } = this.queryParams;
    const { dispatch } = this.props;
    dispatch({
      type: 'writeOff/exportByContractId',
      payload: {
        apiName: 'exportByContractId',
        reqType: 'GET',
        placeholerData: {
          contractId,
        },
        queryData: {
          type: tabType === 'stageWriteOff' ? 0 : 1,
        },
      },
      successCallback: () => {
        message.success('导出成功');
      },
    });
  };

  genMiddleSectionBeRelated = () => {
    const { pageType } = this.queryParams;
    return (
      <Fragment>
        <div className="headLayout" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
          <h3>发票记录</h3>
          {pageType === 'detail' ? <Button onClick={this.exportByContractId}>导出</Button> : ''}
        </div>
      </Fragment>
    );
  };

  getExtraData = () => {
    const { invoiceRecordDataList, contractDetail } = this.props;
    let result = invoiceRecordDataList;
    if (contractDetail && Object.keys(contractDetail).length) {
      const { firstPayment, receivableNum } = contractDetail;
      result = invoiceRecordDataList.map(v => {
        v.firstPayment = firstPayment;
        v.receivableNum = receivableNum;
        return v;
      });
    }
    return result;
  };

  render() {
    const copyTableListParams = Object.assign({}, tableListParams);
    const copyInvoiceRecordDataList = this.getExtraData();

    const QnListPagePropsBeRelated: object = {
      dataSource: copyInvoiceRecordDataList,
      columns: genTableColumns(copyTableListParams),
      hasPagination: false,
      rowSelection: null,
      total: copyInvoiceRecordDataList.length,
      // otherTableProps: {
      //   footer: (pageData: []) => {
      //     console.log('pageData ->', pageData);
      //     const amountData = [];
      //     pageData.forEach(v => {
      //       amountData.push(parseFloat(v.amount));
      //     });
      //     const number = amountData.reduce((total, num) => total + num, 0);
      //     return (
      //       <div>
      //         <h3>合计 | 发票金额 : {number} </h3>
      //       </div>
      //     );
      //   },
      // },
    };

    return (
      <div /* className={styles.ToBeRelated} */>
        {this.genMiddleSectionBeRelated()}
        <QnListPage {...QnListPagePropsBeRelated} />
      </div>
    );
  }
}

export default withRouter(ToBeRelated as React.ComponentClass<any>);
