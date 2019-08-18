import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Button, message, Icon, Tabs } from 'antd';
import withRouter from 'umi/withRouter';
import isEqual from 'lodash/isEqual';
import { Link } from 'dva/router';
import { QnListPage, QnFormModal } from '@/utils/Qneen/index';
import tableListParams from './tableListParams';
import { genTableColumns } from '@/utils/format/dataGen';
import tableFilterParams from './tableFilterParams';
import { ContractModelState } from '@/models/contract';
import { WriteOffModelState, namespace } from '@/models/writeOff';
import debounce from 'lodash/debounce';
import Invoice from '../Invoice/Invoice';
import Record from '../Record/Record';
import { formatDate } from '@/utils/format/dataFormatter';

import {
  getPageQuery,
  dealWithQueryParams,
  updateRoute,
  initializeFilterParams,
} from '@/utils/utils';
const { TabPane } = Tabs;
interface IConnectState extends ConnectState {
  [namespace]: WriteOffModelState;
  contract: ContractModelState;
}
interface IProps extends ConnectProps, ContractModelState, WriteOffModelState {
  dispatch: Dispatch;
  [key: string]: any;
}

interface IState {
  selectedRowKeys: object;
  ifShowFormLoading: boolean;
  panes: Array<any>;
  activeKey: string;
  dataList: Array<any>;
}

@connect(({ contract }: IConnectState) => {
  const { dataList, dataPageTotal, dataPageNo, dataPageSize } = contract;
  const { detail } = contract;
  return {
    dataList,
    dataPageTotal,
    dataPageNo,
    dataPageSize,
    contractDetail: detail,
  };
})
class WriteOff extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      ifShowFormLoading: false,
      dataList: [],
      panes: [
        {
          title: '核销管理',
          content: (
            <Card bordered={false}>
              <QnListPage {...this.getQnListPageProps()} />
            </Card>
          ),
          key: 'list',
        },
      ],
      activeKey: 'list',
    };
  }

  option = {
    name: 'option',
    title: '操作',
    render: (text, record) => {
      const { contractId } = record;
      return (
        <Fragment>
          <Icon
            type="plus"
            title="添加发票"
            onClick={() => this.addTab('invoice', { contractId })}
            style={{ marginRight: '0.5rem' }}
          />

          <Icon
            type="edit"
            title="编辑核销记录"
            style={{ marginRight: '0.5rem' }}
            onClick={() =>
              this.addTab('edit', { pageType: 'edit', contractId, tabType: 'stageWriteOff' })
            }
          />
          <Icon
            type="search"
            title="查看核销记录"
            style={{ marginRight: '0.5rem' }}
            onClick={() =>
              this.addTab('detail', { pageType: 'detail', contractId, tabType: 'stageWriteOff' })
            }
          />
        </Fragment>
      );
    },
  };

  getQnListPageProps = () => {
    const { dataList, dataPageTotal, dataPageNo } = this.props;
    // console.log('dataList ->', dataList);
    const copyTableListParams = Object.assign({}, tableListParams);
    copyTableListParams['option'] = this.option;

    const QnListPageProps: object = {
      dataSource: dataList,
      columns: genTableColumns(copyTableListParams),
      title: '核销',
      rowSelection: null,
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
      rowKey: item => item.contractId,
      // middleSection: this.genMiddleSection(),
      // ...this.QnFormModalProps('QnListPage'),
    };
    return QnListPageProps;
  };

  tableFilterParams = tableFilterParams;

  componentDidMount() {
    this.queryList(getPageQuery());
    this.tableFilterParams = initializeFilterParams(tableFilterParams);
  }

  componentDidUpdate(prevProps: IProps) {}

  updatePanes = () => {
    const { panes } = this.state;
    const newPanes = panes.map(v => {
      if (v.key === 'list') {
        v.content = (
          <Card bordered={false}>
            <QnListPage {...this.getQnListPageProps()} />
          </Card>
        );
      }
      return v;
    });
    this.setState({
      panes: newPanes,
    });
  };

  queryList = (params: object) => {
    console.log('params ->', params);
    const copyParams = dealWithQueryParams(params);
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/queryList',
      payload: {
        apiName: 'queryList',
        reqType: 'POST',
        bodyData: copyParams,
      },
      successCallback: (dataList: []) => {
        this.updatePanes();
        updateRoute(copyParams);
      },
    });
  };

  queryListByDebounce = debounce(this.queryList, 1000);

  handlePageChange = (currentPage: number, pageSize: number) => {
    this.queryListByDebounce({ pageSize, currentPage });
  };

  handleFilterChange = (filterParams: object) => {
    this.queryListByDebounce({ ...filterParams });
  };

  queryInvoice = () => {
    const { dispatch, contractDetail } = this.props;
    const { customId, effectiveDate } = contractDetail;
    const contractId = getPageQuery('contractId');
    console.log('contractDetail ->', contractDetail);

    dispatch({
      type: 'invoice/queryInvoice',
      payload: {
        apiName: 'queryInvoice',
        reqType: 'POST',
        bodyData: {
          customId,
          contractId,
          effectiveDate: effectiveDate ? formatDate(effectiveDate, false) : '',
        },
      },
      successCallback: () => {},
    });
  };

  queryById = (callback = () => {}) => {
    const contractId = getPageQuery('contractId');
    const { dispatch } = this.props;
    console.log('queryById...');
    dispatch({
      type: 'contract/queryById',
      payload: {
        apiName: 'queryById',
        reqType: 'GET',
        placeholerData: {
          contractId,
        },
      },
      successCallback: () => {
        callback();
      },
    });
  };

  queryDataByContractId = (type = 'stageWriteOff') => {
    const contractId = getPageQuery('contractId');
    const { dispatch } = this.props;

    let api =
      type === 'stageWriteOff' ? 'querySettlementByContractId' : 'queryCommissionByContractId';

    console.log('api ->', api);
    dispatch({
      type: `writeOff/${api}`,
      payload: {
        apiName: api,
        reqType: 'GET',
        placeholerData: {
          contractId,
        },
      },
      successCallback: () => {},
    });
  };

  queryRelatedInvoice = () => {
    const contractId = getPageQuery('contractId');
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

  onChange = (activeKey: string) => {
    this.setState({ activeKey });
    let contractId = activeKey.split('_')[1];
    let type = activeKey.split('_')[0];
    console.log('activeKey ->', activeKey);
    console.log('contractId ->', contractId);
    console.log('type ->', type);
    const tabType = getPageQuery('tabType');
    updateRoute({ contractId, tabType }, true);
    switch (type) {
      case 'list':
        this.queryList(getPageQuery());
        break;
      case 'invoice':
        this.queryById(this.queryInvoice);
        break;
      case 'detail':
        this.queryById();
        if (tabType === 'stageWriteOff') {
          this.queryRelatedInvoice();
        }
        this.queryDataByContractId();
        break;
      case 'edit':
        this.queryById();
        if (tabType === 'stageWriteOff') {
          this.queryRelatedInvoice();
        }
        this.queryDataByContractId();
        break;
      default:
        break;
    }
  };

  onEdit = (targetKey: string, action: string) => {
    console.log('targetKey ->', targetKey);
    console.log('action ->', action);
    this[action](targetKey);
  };

  addTab = (type: string, params: object) => {
    console.log('type ->', type);
    const { panes } = this.state;
    let tabItem = {};
    let { contractId } = params;
    let activeKey = `${type}_${contractId}`;
    if (!panes.filter(v => v.key === activeKey).length) {
      updateRoute(params);
      switch (type) {
        case 'invoice':
          this.queryById();
          tabItem = {
            title: '添加发票',
            content: <Invoice {...params} queryInvoice={this.queryInvoice} />,
            key: `invoice_${contractId}`,
          };
          break;
        case 'detail':
          this.queryById();
          this.queryDataByContractId();
          this.queryRelatedInvoice();
          tabItem = {
            title: '查看核销记录',
            content: (
              <Record
                {...params}
                queryDataByContractId={this.queryDataByContractId}
                queryRelatedInvoice={this.queryRelatedInvoice}
              />
            ),
            key: `detail_${contractId}`,
          };
          break;
        case 'edit':
          this.queryById();
          this.queryDataByContractId();
          this.queryRelatedInvoice();
          tabItem = {
            title: '编辑核销记录',
            content: (
              <Record
                {...params}
                queryDataByContractId={this.queryDataByContractId}
                queryRelatedInvoice={this.queryRelatedInvoice}
              />
            ),
            key: `edit_${contractId}`,
          };
          break;
        default:
          break;
      }
      panes.push(tabItem);
    }
    this.setState({ panes, activeKey });
  };

  remove = (targetKey: string) => {
    let { panes: oldPanes } = this.state;
    const panes = oldPanes.filter(pane => pane.key !== targetKey);
    let activeKey = '';
    if (panes.length) {
      activeKey = panes[0].key;
    }
    this.setState({ panes, activeKey });
  };

  render() {
    const { activeKey, panes } = this.state;

    return (
      <Tabs
        style={{ flex: 1 }}
        hideAdd
        onChange={this.onChange}
        activeKey={activeKey}
        type="editable-card"
        onEdit={this.onEdit}
        className="display-tab"
      >
        {panes.map(pane => (
          <TabPane tab={pane.title} key={pane.key}>
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

export default withRouter(WriteOff as any);
