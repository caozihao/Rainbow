import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Button, message, Icon } from 'antd';
import withRouter from 'umi/withRouter';
import { Link } from 'dva/router';
import { QnListPage, QnFormModal } from '@/utils/Qneen/index';
import tableListParams from './tableListParams';
import { genTableColumns } from '@/utils/format/dataGen';
import tableFilterParams from './tableFilterParams';
import { ContractModelState } from '@/models/contract';
import { WriteOffModelState, namespace } from '@/models/writeOff';
import {
  getPageQuery,
  dealWithQueryParams,
  updateRoute,
  initializeFilterParams,
} from '@/utils/utils';



interface IConnectState extends ConnectState {
  [namespace]: WriteOffModelState;
  contract: ContractModelState;
}
interface IProps extends ConnectProps, ContractModelState, WriteOffModelState {
  dispatch: Dispatch;
}

interface IState {
  selectedRowKeys: object;
  ifShowFormLoading: boolean;
}

@connect(({ contract }: IConnectState) => {
  const { dataList, dataPageTotal, dataPageNo, dataPageSize } = contract;
  return {
    dataList,
    dataPageTotal,
    dataPageNo,
    dataPageSize,
  };
})
class WriteOff extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      ifShowFormLoading: false,
    };
  }

  option = {
    name: 'option',
    title: '操作',
    render: (text, record) => {
      const { contractId } = record;
      return (
        <Fragment>
          <Link to={`/writeoff/invoice?contractId=${contractId}`} style={{ marginRight: '0.5rem' }}>
            {/* <Button style={{ marginRight: '1rem' }}>添加发票</Button> */}
            <Icon type="plus" title="添加发票" />
          </Link>
          <Link
            to={`/writeoff/record?type=edit&&contractId=${contractId}`}
            style={{ marginRight: '0.5rem' }}
          >
            {/* <Button type="primary">编辑核销记录</Button> */}
            <Icon type="edit" title="编辑核销记录" />
          </Link>
          <Link to={`/writeoff/record?type=detail&&contractId=${contractId}`}>
            {/* <Button style={{ marginRight: '1rem' }}>查看</Button> */}
            <Icon type="search" title="查看" />
          </Link>
        </Fragment>
      );
    },
  };

  tableFilterParams = tableFilterParams;

  componentDidMount() {
    this.queryList(getPageQuery());
    this.tableFilterParams = initializeFilterParams(tableFilterParams);
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

  // genMiddleSection = () => {
  //   return (
  //     <div style={{ marginBottom: '1rem' }}>
  //       <Link to="/writeoff/invoice">
  //         <Button style={{ marginRight: '1rem' }}>添加发票</Button>
  //       </Link>
  //       <Link to="/writeoff/record">
  //         <Button type="primary">编辑核销记录</Button>
  //       </Link>
  //     </div>
  //   );
  // };

  // handleClick = (e: Object): void => {};

  render() {
    const { dataList, dataPageTotal, dataPageNo } = this.props;
    const copyTableListParams = Object.assign({}, tableListParams);
    copyTableListParams['option'] = this.option;

    const QnListPageProps: object = {
      dataSource: dataList,
      columns: genTableColumns(copyTableListParams),
      title: '核销',
      // rowSelection: {
      //   onChange: (selectedRowKeys = [], selectedRows = []) => {
      //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      //     this.setState({
      //       selectedRowKeys,
      //     });
      //   },
      // },
      filterRules: this.tableFilterParams,
      col: 2,
      handlePageChange: this.handlePageChange,
      handleFilterChange: this.handleFilterChange,
      total: dataPageTotal,
      current: dataPageNo,
      // middleSection: this.genMiddleSection(),
      // ...this.QnFormModalProps('QnListPage'),
    };
    return (
      <Card className="wrapper-right-content" title="核销管理">
        <QnListPage {...QnListPageProps} />
      </Card>
    );
  }
}

export default withRouter(WriteOff as any);
