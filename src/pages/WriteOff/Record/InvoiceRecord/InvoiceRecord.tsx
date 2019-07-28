import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import withRouter from 'umi/withRouter';
import { QnListPage } from '@/utils/Qneen';
import { InvoiceModelState } from '@/models/invoice';
import { ContractModelState } from '@/models/contract';
import { genTableColumns } from '@/utils/format/dataGen';
import tableListParams from '../invoiceRecordDataList';
import styles from '../../WriteOff.less';
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

  componentDidMount() {
    this.queryRelatedInvoice();
  }

  componentDidUpdate() {}

  queryRelatedInvoice = () => {
    const { contractId } = this.queryParams;
    const { dispatch } = this.props;
    dispatch({
      type: 'invoice/queryRelatedInvoice',
      payload: {
        apiName: 'queryRelatedInvoice',
        reqType: 'GET',
        queryData: {
          contractId,
        },
      },
      successCallback: () => {},
    });
  };

  genMiddleSectionBeRelated = () => {
    return (
      <Fragment>
        <div className={styles.headLayout} style={{ marginBottom: '1rem' }}>
          <h3>发票记录</h3>
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
