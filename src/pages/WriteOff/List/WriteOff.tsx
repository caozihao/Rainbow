/* eslint-disable react/sort-comp */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Button, message, Icon, Tabs, Upload, Spin } from 'antd';
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
  uploading: boolean;
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
      uploading: false,
    };
  }

  option = {
    name: 'option',
    title: '操作',
    render: (text, record) => {
      const { contractId, type: contractType } = record;
      let tabType = contractType === '0' ? 'stageWriteOff' : 'serviceWriteOff';
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
              this.addTab('edit', {
                pageType: 'edit',
                contractId,
                tabType,
                contractType,
              })
            }
          />
          <Icon
            type="search"
            title="查看核销记录"
            style={{ marginRight: '0.5rem' }}
            onClick={() =>
              this.addTab('detail', {
                pageType: 'detail',
                contractId,
                tabType,
                contractType,
              })
            }
          />
          <Icon
            type="download"
            title="导出停服通知涵"
            style={{ marginRight: '0.5rem' }}
            onClick={() => this.exportStopNotify(record.contractId)}
          />
        </Fragment>
      );
    },
  };

  genMiddleSection = () => {
    const that = this;
    const uploadProps = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      action: '/rcs/invoice/importInvoice',
      withCredentials: true,
      headers: {
        // 'Content-Disposition': 'attachment; filename="your-name.mp3"',
      },
      data: {},
      onChange(info: any) {
        const { status } = info.file;
        if (status === 'uploading') {
          that.setState({
            uploading: true,
          });
        }
        if (status === 'done') {
          if (parseInt(info.file.response.code)) {
            message.error(`${info.file.name}上传失败: ${info.file.response.message}`);
            that.setState({
              uploading: false,
            });
            return;
          }
          message.success(`${info.file.name}上传成功`);

          that.setState({
            uploading: false,
          });
        } else if (status === 'error') {
          message.error(`${info.file.name}上传失败`);
        }
      },
    };
    return (
      <div>
        <h3>导入发票</h3>
        <div>
          <Upload {...uploadProps}>
            <Button>
              <Icon type="upload" /> 上传
            </Button>
          </Upload>
        </div>
        <br />
      </div>
    );
  };

  getQnListPageProps = () => {
    const { dataList, dataPageTotal, dataPageNo } = this.props;
    const copyTableListParams = Object.assign({}, tableListParams);
    copyTableListParams['option'] = this.option;

    const QnListPageProps: object = {
      dataSource: dataList,
      columns: genTableColumns(copyTableListParams),
      title: '核销',
      rowSelection: null,
      // rowSelection: {
      //   onChange: (selectedRowKeys = [], selectedRows = []) => {
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
      middleSection: this.genMiddleSection(),
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

  exportStopNotify = (contractId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'writeOff/exportStopNotify',
      payload: {
        apiName: 'exportStopNotify',
        reqType: 'GET',
        placeholerData: {
          contractId,
        },
      },
      successCallback: () => {
        message.success('导出成功!');
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

    dispatch({
      type: 'invoice/queryInvoice',
      payload: {
        apiName: 'queryInvoice',
        reqType: 'POST',
        bodyData: {
          customId,
          contractId,
          // effectiveDate: effectiveDate ? formatDate(effectiveDate, false) : '',
        },
      },
      successCallback: () => {},
    });
  };

  queryById = (callback = () => {}) => {
    const contractId = getPageQuery('contractId');
    const { dispatch } = this.props;
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

  queryDataByContractId = () => {
    const { contractId, tabType } = getPageQuery();
    const { dispatch } = this.props;

    let api =
      tabType === 'stageWriteOff' ? 'querySettlementByContractId' : 'queryCommissionByContractId';

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
    let contractType = activeKey.split('_')[2];
    const { tabType } = getPageQuery();
    updateRoute({ contractId, tabType, contractType, pageType: type });
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
    this[action](targetKey);
  };

  addTab = (type: string, params: object) => {
    const { panes } = this.state;
    let tabItem = {};
    let { contractId, contractType } = params;
    let activeKey = `${type}_${contractId}_${contractType}`;
    if (!panes.filter(v => v.key === activeKey).length) {
      updateRoute(params);
      switch (type) {
        case 'invoice':
          tabItem = {
            title: '添加发票',
            content: <Invoice {...params} queryInvoice={this.queryInvoice} />,
            key: `invoice_${contractId}_${contractType}`,
          };
          this.queryById(this.queryInvoice);
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
            key: `detail_${contractId}_${contractType}`,
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
            key: `edit_${contractId}_${contractType}`,
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
    const { activeKey, panes, uploading } = this.state;

    return (
      <Spin spinning={uploading}>
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
      </Spin>
    );
  }
}

export default withRouter(WriteOff as any);
