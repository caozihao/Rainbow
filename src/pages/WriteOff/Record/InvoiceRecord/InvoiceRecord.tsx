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

  componentDidMount() {}

  componentDidUpdate() {}

  exportWriteOff = () => {
    const { contractId } = getPageQuery();
    const { dispatch } = this.props;
    dispatch({
      type: 'writeOff/exportWriteOff',
      payload: {
        apiName: 'exportWriteOff',
        reqType: 'GET',
        placeholerData: {
          contractId,
        },
      },
      successCallback: () => {
        message.success('导出成功！');
      },
    });
  };

  genMiddleSectionBeRelated = () => {
    const { pageType } = getPageQuery();
    return (
      <Fragment>
        <div className="headLayout" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
          <h3>发票记录</h3>
          {pageType === 'detail' ? <Button onClick={this.exportWriteOff}>导出</Button> : ''}
        </div>
      </Fragment>
    );
  };

  render() {
    const copyTableListParams = Object.assign({}, tableListParams);
    const copyInvoiceRecordDataList = this.props.invoiceRecordDataList;

    const QnListPagePropsBeRelated: object = {
      dataSource: copyInvoiceRecordDataList,
      columns: genTableColumns(copyTableListParams),
      hasPagination: false,
      rowSelection: null,
      total: copyInvoiceRecordDataList.length,
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
