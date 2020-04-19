import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Button, message, Icon, Tabs } from 'antd';
import withRouter from 'umi/withRouter';
import router from 'umi/router';
import { Link } from 'dva/router';
import { genTableColumns } from '@/utils/format/dataGen';
import { QnListPage, QnFormModal, QnFilter, QnTable } from '@/utils/Qneen/index';
import tableFilterParamsByCustomer from './Customer/tableFilterParamsByCustomer';
import tableFilterParamsByStatistics from './Statistics/tableFilterParamsByStatistics';
import tableListParamsByDetail from './Statistics/tableListParamsByDetail';
import tableListParamsBySummary from './Statistics/tableListParamsBySummary';
import { ReceivableModelState } from '@/models/receivable';
import { IQueryParams } from '../receivable';
import contractTableListParams from './Customer/tableListParamsByContract';
import { getPageQuery, updateRoute, dealWithQueryParams } from '@/utils/utils';
import { ContractModelState } from '@/models/contract';
import debounce from 'lodash/debounce';
import ReceivablesView from './ReceivablesView/ReceivablesView';
import cloneDeep from 'lodash/cloneDeep';

const { TabPane } = Tabs;

interface IConnectState extends ConnectState {
  receivable: ReceivableModelState;
  contract: ContractModelState;
}
interface IProps extends ConnectProps, ReceivableModelState, ContractModelState {
  dispatch: Dispatch;
  [key: string]: any;
}

interface IState {
  pageType: string;
  tabType: string;
  panes: Array<any>;
  activePanesTabKey: string;
}

@connect(({ receivable, contract }: IConnectState) => {
  const { dataList } = receivable;
  const {
    dataList: contractDataList,
    dataPageTotal: contractDataPageTotal,
    dataPageNo: contractDataPageNo,
    dataPageSize: contractDataPageSize,
  } = contract;
  return {
    dataList,
    contractDataList,
    contractDataPageTotal,
    contractDataPageNo,
    contractDataPageSize,
  };
})
class Receivable extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      pageType: getPageQuery().pageType || 'customer',
      tabType: getPageQuery().tabType || 'HwStage',
      panes: [
        {
          title: '应收管理',
          content: this.genContentPane(),
          key: 'list',
        },
      ],
      activePanesTabKey: 'list',
    };
  }

  componentDidMount() {
    const { pageType } = getPageQuery();
    if (pageType === 'customer' || !pageType) {
      this.queryContractList();
    } else if (pageType === 'statistics') {
      this.queryList();
    }
  }

  updatePanes = () => {
    const { panes: originPanes } = this.state;
    const panes = originPanes.map(v => {
      if (v.key === 'list') {
        v.content = this.genContentPane();
      }
      return v;
    });
    this.setState({
      panes,
    });
  };

  componentDidUpdate() {}

  genContentPane = () => {
    const { dataList, contractDataList, contractDataPageTotal, contractDataPageNo } = this.props;

    let pageType = getPageQuery('pageType') || 'customer';
    let tabType = getPageQuery('tabType') || 'HwStage';
    if (this.state) {
      const { pageType: stateType, tabType: stateTabType } = this.state;
      pageType = stateType;
      tabType = stateTabType;
    }

    const { tableListParams, textNumber } = this.getDataByTabType();
    let QnTableProps = {};
    let QnFilterProps = {};
    if (pageType === 'customer' || !pageType) {
      const copyTableListParams = Object.assign({}, contractTableListParams);
      copyTableListParams['option'] = this.option;
      QnTableProps = {
        dataSource: contractDataList,
        columns: genTableColumns(copyTableListParams),
        handlePageChange: this.handleContractPageChange,
        total: contractDataPageTotal,
        current: contractDataPageNo,
        rowKey: item => item.contractId,
      };

      QnFilterProps = {
        handleChange: this.handleContractFilterChange,
        rules: tableFilterParamsByCustomer,
        col: 2,
      };
    } else if (pageType === 'statistics') {
      const dataSource = dataList.map((v, i) => {
        v.index = i + 1;
        return v;
      });

      let cloneDataSource = cloneDeep(dataSource);

      if (cloneDataSource.length > textNumber) {
        for (let i = 0; i < cloneDataSource.length - textNumber; i++) {
          cloneDataSource[i].nper = i + 1;
        }
      }

      QnTableProps = {
        dataSource: cloneDataSource,
        columns: genTableColumns(tableListParams),
        total: dataList.length,
        hasPagination: false,
        rowKey: (_, index) => index,
      };

      QnFilterProps = {
        handleChange: this.handleFilterChange,
        rules: tableFilterParamsByStatistics,
        col: 2,
      };
    }

    const genTabContent = <QnFilter {...QnFilterProps} />;

    const table = (
      <Fragment>
        <br />
        <QnTable {...QnTableProps} />
      </Fragment>
    );

    const genTabChildContentByStatistics = (
      <Fragment>
        <Button onClick={this.export} style={{ position: 'absolute', right: 0, zIndex: 99 }}>
          导出
        </Button>
        <Tabs activeKey={tabType} onChange={item => this.changeRoute(item, 'tabType')}>
          <TabPane tab="硬件明细" key="HwDetail">
            {table}
          </TabPane>
          <TabPane tab="硬件汇总" key="HwSummary">
            {table}
          </TabPane>
          <TabPane tab="服务明细" key="serviceDetail">
            {table}
          </TabPane>
          <TabPane tab="服务汇总" key="serviceSummary">
            {table}
          </TabPane>
          <TabPane tab="硬件+服务汇总" key="HwAndServiceSummary">
            {table}
          </TabPane>
        </Tabs>
      </Fragment>
    );

    return (
      <Card bordered={false}>
        <Tabs activeKey={pageType} onChange={item => this.changeRoute(item, 'pageType')}>
          <TabPane tab="客户应收" key="customer">
            <br />
            {genTabContent}
            {table}
          </TabPane>
          <TabPane tab="应收统计" key="statistics">
            <br />
            {genTabContent}
            {genTabChildContentByStatistics}
          </TabPane>
        </Tabs>
      </Card>
    );
  };

  option = {
    name: 'option',
    title: '操作',
    render: (text, record) => {
      const { contractId, type } = record;
      return (
        <Button onClick={() => this.onAddPanesTab('view', { contractId, contractType: type })}>
          查看
        </Button>
      );
    },
  };

  getDataByTabType = () => {
    let api = '';
    let tableListParams = {};
    let textNumber = 0;
    let exportApi = '';
    switch (this.state ? this.state.tabType : getPageQuery('tabType') || 'HwStage') {
      case 'HwDetail':
        api = 'queryHwDetail';
        tableListParams = tableListParamsByDetail;
        textNumber = 3;
        exportApi = 'exportHwDetail';
        break;
      case 'serviceDetail':
        api = 'queryServiceDetail';
        tableListParams = tableListParamsByDetail;
        textNumber = 3;
        exportApi = 'exportServiceDetail';
        break;
      case 'HwSummary':
        api = 'queryHwSummary';
        tableListParams = tableListParamsBySummary;
        textNumber = 6;
        exportApi = 'exportHwSummary';
        break;
      case 'serviceSummary':
        api = 'queryServiceSummary';
        tableListParams = tableListParamsBySummary;
        textNumber = 6;
        exportApi = 'exportServiceSummary';
        break;
      case 'HwAndServiceSummary':
        api = 'queryHWAndServiceSummary';
        tableListParams = tableListParamsBySummary;
        textNumber = 6;
        exportApi = 'exportHWAndServiceSummary';
        break;
      default:
        break;
    }
    return {
      api,
      tableListParams,
      textNumber,
      exportApi,
    };
  };

  changeRoute = (key = '', type = '') => {
    let param = {};
    if (type === 'pageType') {
      let tabType = '';
      if (key === 'customer') {
        tabType = 'HwStage';
      } else {
        tabType = 'HwDetail';
      }
      param = {
        pageType: key,
        tabType,
      };
      updateRoute({ ...param });
    } else {
      param = {
        tabType: key,
      };
      updateRoute({ ...param }, false);
    }

    this.props.dispatch({
      type: 'contract/save',
      payload: {
        dataList: [],
        dataPageTotal: 0,
        dataPageNo: 0,
        dataPageSize: 0,
      },
    });
    this.props.dispatch({
      type: 'receivable/save',
      payload: {
        dataList: [],
        dataPageTotal: 0,
        dataPageNo: 0,
        dataPageSize: 0,
      },
    });

    this.setState({ ...param }, () => {
      this.updatePanes();
      if (key === 'customer') {
        this.queryContractList();
      } else {
        this.queryList();
      }
    });
  };

  queryContractList = () => {
    const copyParams = dealWithQueryParams(getPageQuery());
    const { tabType, pageType, ...otherParams } = copyParams;
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/queryList',
      payload: {
        apiName: 'queryList',
        reqType: 'POST',
        bodyData: otherParams,
      },
      successCallback: (dataList: []) => {
        this.updatePanes();
      },
    });
  };

  queryList = () => {
    const copyParams = dealWithQueryParams(getPageQuery());
    const { tabType, pageType, ...otherParams } = copyParams;
    const { api } = this.getDataByTabType();
    const { dispatch } = this.props;
    dispatch({
      type: `receivable/${api}`,
      payload: {
        apiName: api,
        reqType: 'POST',
        bodyData: otherParams,
      },
      successCallback: () => {
        this.updatePanes();
      },
    });
  };

  queryContractListByDebounce = debounce(this.queryContractList, 1000);
  queryListByDebounce = debounce(this.queryList, 1000);

  handleContractPageChange = (currentPage: number, pageSize: number) => {
    updateRoute({ pageSize, currentPage }, false);
    this.queryContractListByDebounce();
  };

  handleContractFilterChange = (filterParams: object) => {
    updateRoute({ ...filterParams });
    this.queryContractListByDebounce();
  };

  handleFilterChange = (filterParams: object) => {
    updateRoute({ ...filterParams });
    this.queryListByDebounce();
  };

  onEditPanesTab = (targetKey: string, action: string) => {
    this[action](targetKey);
  };

  queryViewList = () => {
    const { dispatch } = this.props;
    const { contractType, contractId } = getPageQuery();
    let api = '';
    if (contractType === '0') {
      api = 'queryCustomHw';
    } else {
      api = 'queryCustomService';
    }
    dispatch({
      type: `receivable/${api}`,
      payload: {
        apiName: api,
        reqType: 'POST',
        placeholerData: {
          contractId,
        },
      },
      successCallback: () => {},
    });
  };

  export = () => {
    const { dispatch } = this.props;
    const { tabType, pageType, ...otherParams } = getPageQuery();
    const { exportApi } = this.getDataByTabType();
    dispatch({
      type: `receivable/${exportApi}`,
      payload: {
        apiName: exportApi,
        reqType: 'POST',
        bodyData: otherParams,
      },
      successCallback: () => {
        message.success('导出成功！');
      },
    });
  };

  onChangePanesTab = (activePanesTabKey: string) => {
    this.setState({ activePanesTabKey });
    let panelType = activePanesTabKey.split('_')[0];
    let contractId = activePanesTabKey.split('_')[1];
    let contractType = activePanesTabKey.split('_')[2];
    const { currentPage, pageSize, tabType, pageType } = getPageQuery();

    switch (panelType) {
      case 'list':
        updateRoute({ currentPage, pageSize, tabType, pageType });
        this.queryContractList();
        break;
      case 'view':
        updateRoute({ contractId, contractType });
        this.queryViewList();
        break;
      default:
        break;
    }
  };

  onAddPanesTab = (type: string, params: object) => {
    const { panes } = this.state;
    let tabItem = {};
    let { contractId, contractType } = params;
    let activePanesTabKey = `${type}_${contractId}_${contractType}`;
    if (!panes.filter(v => v.key === activePanesTabKey).length) {
      updateRoute(params);
      switch (type) {
        case 'view':
          tabItem = {
            title: '应收查看',
            content: <ReceivablesView {...params} queryViewList={this.queryViewList} />,
            key: `view_${contractId}_${contractType}`,
          };
          this.queryViewList();
          break;
        default:
          break;
      }
      panes.push(tabItem);
    }
    this.setState({ panes, activePanesTabKey });
  };

  remove = (targetKey: string) => {
    let { panes: oldPanes } = this.state;
    const panes = oldPanes.filter(pane => pane.key !== targetKey);
    let activePanesTabKey = '';
    if (panes.length) {
      activePanesTabKey = panes[0].key;
    }
    this.setState({ panes, activePanesTabKey });
  };

  render() {
    const { activePanesTabKey, panes } = this.state;
    return (
      <Tabs
        style={{ flex: 1 }}
        hideAdd
        onChange={this.onChangePanesTab}
        activeKey={activePanesTabKey}
        type="editable-card"
        onEdit={this.onEditPanesTab}
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

export default withRouter(Receivable as any);
