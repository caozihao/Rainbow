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
            onClick={() => this.addTab('edit', { pageType: 'edit', contractId })}
          />
          <Icon
            type="search"
            title="查看核销记录"
            style={{ marginRight: '0.5rem' }}
            onClick={() => this.addTab('detail', { pageType: 'detail', contractId })}
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
      rowKey: item=>item.contractId,
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

  updateList = () => {
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
        this.updateList();
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

  onChange = (activeKey: string) => {
    console.log('activeKey ->', activeKey);
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
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
          tabItem = {
            title: '添加发票',
            content: <Invoice {...params} />,
            key: `invoice_${contractId}`,
          };
          break;
        case 'detail':
          tabItem = {
            title: '查看核销记录',
            content: <Record {...params} />,
            key: `detail_${contractId}`,
          };
          break;
        case 'edit':
          tabItem = {
            title: '编辑核销记录',
            content: <Record {...params} />,
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
      // <Card className="wrapper-right-content" title="核销管理">
      //   <QnListPage {...QnListPageProps} />
      // </Card>
      <Fragment>
        {/* <div style={{ marginBottom: 16 }}>
          <Button onClick={this.add}>ADD</Button>
        </div> */}
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
      </Fragment>
    );
  }
}

export default withRouter(WriteOff as any);
