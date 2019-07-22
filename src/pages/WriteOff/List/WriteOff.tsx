import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Button, message } from 'antd';
import withRouter from 'umi/withRouter';
import { Link } from 'dva/router';
import { QnListPage, QnFormModal } from '../../../utils/Qneen/index';
import tableListParams from './tableListParams';
import { genTableColumns } from '../../../utils/format/dataGen';
import tableFilterParams from './tableFilterParams';
import { ContractModelState } from '../../../models/contract';
import { WriteOffModelState, namespace } from '../../../models/writeOff';
import { formDict, formInitialValueObj } from './formParams';
import {
  getPageQuery,
  dealWithQueryParams,
  updateRoute,
  initializeFilterParams,
} from '../../../utils/utils';
import { formatMoment } from '../../../utils/format/dataFormatter';

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
  const { tableDataList, tableDataPageTotal, tableDataPageNo, tableDataPageSize } = contract;
  return {
    tableDataList,
    tableDataPageTotal,
    tableDataPageNo,
    tableDataPageSize,
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

  addAndUpdate = (values: object) => {
    console.log('values ->', values);
    const copyValue = Object.assign({}, values);
    copyValue['effectiveDate'] = formatMoment(copyValue['effectiveDate']);

    let api = 'writeOff/create';
    let successMesage = '添加成功！';
    if (copyValue['_id']) {
      api = 'writeOff/modify';
      successMesage = '修改成功！';
    }

    const { dispatch } = this.props;
    this.setState({
      ifShowFormLoading: true,
    });

    const promise = new Promise(resolve => {
      dispatch({
        type: api,
        payload: {
          apiName: 'create',
          reqType: 'POST',
          bodyData: values,
        },
        successCallback: () => {
          message.success(successMesage);
          resolve();
        },
      });
    });

    return promise;
  };

  QnFormModalProps = (type: string) => {
    const { ifShowFormLoading } = this.state;
    const modalOtherProps = {
      width: 800,
      rowsNumber: 2,
      rowSplitTitleDict: {
        0: '基础信息',
        8: '交易信息',
        14: '上传合同',
      },
    };

    const commonParams = {
      formDict,
      formInitialValueObj,
      handleTriggerClick: () => {},
      handleOk: this.addAndUpdate,
      ifShowFormLoading,
    };

    let result = {};

    if (type === 'QnListPage') {
      result = { ...commonParams, modalOtherProps };
    } else {
      result = { ...commonParams, ...modalOtherProps };
    }
    return result;
  };

  option = {
    name: 'option',
    title: '操作',
    render: (text, record) => {
      const copyQnFormModalProps = Object.assign({}, this.QnFormModalProps('QnFormModal'));
      copyQnFormModalProps['buttonProps'] = {
        type: 'primary',
        title: '修改',
      };
      copyQnFormModalProps['title'] = '修改合同';
      return (
        <Fragment>
          <Button style={{ marginRight: '10px' }}>查看</Button>
          <QnFormModal {...copyQnFormModalProps}>
            <Button type="primary">修改</Button>
          </QnFormModal>
        </Fragment>
      );
    },
  };

  tableFilterParams = tableFilterParams;

  componentDidMount() {
    this.queryList(getPageQuery());
    this.tableFilterParams = initializeFilterParams(tableFilterParams);
    console.log(' this.tableFilterParams ->', this.tableFilterParams);
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

  genMiddleSection = () => {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/writeoff/invoice">
          <Button style={{ marginRight: '1rem' }}>添加发票</Button>
        </Link>
        <Link to="/writeoff/record">
          <Button type="primary">编辑核销记录</Button>
        </Link>
      </div>
    );
  };

  // handleClick = (e: Object): void => {};

  render() {
    const { tableDataList, tableDataPageTotal, tableDataPageNo } = this.props;
    const copyTableListParams = Object.assign({}, tableListParams);
    copyTableListParams['option'] = this.option;
    console.log('this.props ->', this.props);

    const QnListPageProps: object = {
      dataSource: tableDataList,
      columns: genTableColumns(copyTableListParams),
      title: '合同',
      rowSelection: {
        onChange: (selectedRowKeys = [], selectedRows = []) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.setState({
            selectedRowKeys,
          });
        },
      },
      filterRules: this.tableFilterParams,
      col: 2,
      handlePageChange: this.handlePageChange,
      handleFilterChange: this.handleFilterChange,
      total: tableDataPageTotal,
      current: tableDataPageNo,
      middleSection: this.genMiddleSection(),
      ...this.QnFormModalProps('QnListPage'),
    };
    return (
      <Card className="wrapper-right-content" title="合同管理">
        <QnListPage {...QnListPageProps} />
      </Card>
    );
  }
}

export default withRouter(WriteOff as any);
