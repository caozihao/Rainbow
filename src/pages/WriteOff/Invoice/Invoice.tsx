import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card } from 'antd';
import { QnListPage, QnFormModal } from '../../../utils/Qneen/index';
import withRouter from 'umi/withRouter';
import { ContractModelState } from '../../../models/contract';
import { genTableColumns } from '../../../utils/format/dataGen';
import tableListParams from './tableListParams';
import { getPageQuery, dealWithQueryParams, updateRoute } from '../../../utils/utils';

interface IConnectState extends ConnectState {
  contract: ContractModelState;
}

interface IProps extends ConnectProps, ContractModelState {
  dispatch: Dispatch;
}

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
class Invoice extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.queryList(getPageQuery());
    const myWindow: any = window;
    console.log('myWindow.g_app._store ->',myWindow.g_app._store);
    console.log('this.props ->',this.props);
  }

  componentDidUpdate() {}

  handlePageChange = (currentPage: number, pageSize: number) => {
    this.queryList({ pageSize, currentPage });
  };

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

  // handleClick = (e: Object): void => {};

  render() {
    const { tableDataList, tableDataPageTotal, tableDataPageNo } = this.props;
    const copyTableListParams = Object.assign({}, tableListParams);

    const QnListPageProps: object = {
      dataSource: tableDataList,
      columns: genTableColumns(copyTableListParams),
      title: '',
      col: 2,
      handlePageChange: this.handlePageChange,
      total: tableDataPageTotal,
      current: tableDataPageNo,
    };

    return (
      <Card className="wrapper-right-content" title="添加发票">
        <QnListPage {...QnListPageProps} />
      </Card>
    );
  }
}

export default withRouter(Invoice as React.ComponentClass<any>);
