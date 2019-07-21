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

import { getPageQuery, dealWithQueryParams, updateRoute } from '../../utils/utils';

interface IConnectState extends ConnectState {
  [namespace]: ContractModelState;
}
interface IProps extends ConnectProps {
  dispatch: Dispatch;
}

interface IProps extends ContractModelState {}

interface IState {}

@connect(({ contract }: IConnectState) => {
  const { tableDataList, tableDataPageTotal, tableDataPageNo, tableDataPageSize } = contract;
  return {
    tableDataList,
    tableDataPageTotal,
    tableDataPageNo,
    tableDataPageSize,
  };
})
class Contract extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.queryList(getPageQuery());
  }

  componentDidUpdate() {}

  queryList = (params: object) => {
    const copyParams = dealWithQueryParams(params);
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/queryList',
      payload: {
        apiName: 'queryList',
        reqType: 'POST',
        bodyData: copyParams,
      },
      successCallback: () => {
        updateRoute(copyParams);
      },
    });
  };

  handlePageChange = (currentPage: number, pageSize: number) => {
    this.queryList({ pageSize, currentPage });
  };

  handleFilterChange = (filterParams: object) => {
    this.queryList({ ...filterParams });
  };

  // handleClick = (e: Object): void => {};

  render() {
    const { tableDataList, tableDataPageTotal, tableDataPageNo } = this.props;

    // console.log('this.props ->', this.props);

    const QnListPageProps: object = {
      dataSource: tableDataList,
      columns: genTableColumns(tableListParams),
      title: '合同',
      handleRowSelect: (selectedRowKeys: [], selectedRows: []) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      filterRules: tableFilterParams,
      col: 2,
      handlePageChange: this.handlePageChange,
      handleFilterChange: this.handleFilterChange,
      total: tableDataPageTotal,
      current: tableDataPageNo,
    };
    return (
      <Card className={styles.Contract} title="合同管理">
        <QnListPage {...QnListPageProps} />
      </Card>
    );
  }
}

export default withRouter(Contract as any);
