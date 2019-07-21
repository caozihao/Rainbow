import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card } from 'antd';
import withRouter from 'umi/withRouter';
import styles from './Contract.less';
import { QnListPage } from '../../utils/Qneen/index';
import tableListParams from './tableListParams';
import { genTableColumns } from '../../utils/format/dataGen';
import tableFilterParams from './tableFilterParams';
import { ContractModelState, namespace } from '../../models/contract';

interface IConnectState extends ConnectState {
  [namespace]: ContractModelState;
}

interface IProps extends ConnectProps {
  dispatch: Dispatch;
  [namespace]: ContractModelState;
}

interface IState {}

@connect(({ contract }: IConnectState) => {
  return {
    contract,
  };
})
class Contract extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.queryList();
  }

  componentDidUpdate() {}

  queryList = (params = {}) => {
    params['pageSize'] = 10;
    params['currentPage'] = 1;

    const { dispatch } = this.props;
    dispatch({
      type: 'contract/queryList',
      payload: {
        apiName: 'queryList',
        reqType: 'POST',
        bodyData: params,
      },
      successCallback: data => {},
      failCallback: err => {},
    });
  };

  // handleClick = (e: Object): void => {};

  render() {
    const { tableDataList, tableDataPageTotal } = this.props[namespace];

    console.log('tableDataList ->', tableDataList);

    const QnListPageProps: object = {
      dataSource: tableDataList,
      columns: genTableColumns(tableListParams),
      title: '合同',
      handleRowSelect: (selectedRowKeys: [], selectedRows: []) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      filterRules: tableFilterParams,
      col: 2,
      handlePageChange: () => {},
      total: tableDataPageTotal,
    };
    return (
      <Card className={styles.Contract} title="合同管理">
        <QnListPage {...QnListPageProps} />
      </Card>
    );
  }
}

export default withRouter(Contract as any);
