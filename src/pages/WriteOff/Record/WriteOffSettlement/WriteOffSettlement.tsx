import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Icon, Button, Spin, message } from 'antd';
import withRouter from 'umi/withRouter';
import { QnListPage } from '@/utils/Qneen';
import { WriteOffModelState } from '@/models/writeOff';
import { genTableColumns } from '@/utils/format/dataGen';
import { ContractModelState } from '@/models/contract';
import tableListParams from '../writeOffRecordDataList.tsx';
import { IQueryParams, IContractDetail } from '../../writeoff.d';
import { getPageQuery } from '@/utils/utils';

import styles from '../../WriteOff.less';

interface IConnectState extends ConnectState {
  writeOff: WriteOffModelState;
  contract: ContractModelState;
}

interface IProps extends ConnectProps, WriteOffModelState {
  dispatch: Dispatch;
  relationToContractLoading: Boolean;
}

interface IState {}

@connect(({ writeOff, loading }: IConnectState) => {
  const { writeOffRecordDataList } = writeOff;
  return {
    // relationToContractLoading: loading.effects['invoice/relationToContract'],
    writeOffRecordDataList,
  };
})
class WriteOffSettlement extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  queryParams: IQueryParams = getPageQuery();

  componentDidMount() {
    this.querySettlementByContractId();
  }

  componentDidUpdate() {}

  querySettlementByContractId = () => {
    const { contractId } = this.queryParams;
    const { dispatch } = this.props;
    dispatch({
      type: 'writeOff/querySettlementByContractId',
      payload: {
        apiName: 'querySettlementByContractId',
        reqType: 'GET',
        placeholerData: {
          contractId,
        },
      },
      successCallback: () => {},
    });
  };

  genMiddleSectionToBeRelated = () => {
    return (
      <div className={styles.headLayout} style={{ margin: '1rem 0' }}>
        <h3>核销结算</h3>
      </div>
    );
  };

  render() {
    const {} = this.props;
    const { writeOffRecordDataList, relationToContractLoading } = this.props;
    const copyTableListParams = Object.assign({}, tableListParams);

    const QnListPagePropsToBeRelated: object = {
      dataSource: writeOffRecordDataList,
      columns: genTableColumns(copyTableListParams),
      hasPagination: false,
      middleSection: this.genMiddleSectionToBeRelated(),
      rowKey: (_, index) => index,
    };

    return (
      <Spin spinning={!!relationToContractLoading}>
        <QnListPage {...QnListPagePropsToBeRelated} />
      </Spin>
    );
  }
}

export default withRouter(WriteOffSettlement as React.ComponentClass<any>);
