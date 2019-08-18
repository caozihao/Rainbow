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
  type: string;
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
      type: this.queryParams.type || 'customer',
      tabType: this.queryParams.tabType || 'HwStage',
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
    const { type, tabType, ...otherParamns } = getPageQuery();
    if (type === 'customer' || !type) {
      this.queryContractList(otherParamns);
    } else if (type === 'statistics') {
      this.queryList(otherParamns);
    }
  }

  updatePanes = () => {
    const { panes: originPanes } = this.state;
    console.log('originPanes ->', originPanes);
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

    let type = getPageQuery('type') || 'customer';
    let tabType = getPageQuery('tabType') || 'HwStage';
    if (this.state) {
      const { type: stateType, tabType: stateTabType } = this.state;
      type = stateType;
      tabType = stateTabType;
    }

    const { tableListParams, middleButtonArea } = this.getDataByTabType();
    // console.log('tableListParams ->', tableListParams);

    let QnTableProps = {};
    let QnFilterProps = {};

    if (type === 'customer' || !type) {
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
    } else if (type === 'statistics') {
      const dataSource = dataList.map((v, i) => {
        v.index = i + 1;
        return v;
      });

      // console.log('tableListParams ->', tableListParams);
      // console.log('dataSource ->', dataSource);

      QnTableProps = {
        dataSource,
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

    // console.log('type ->', type);
    // console.log('tabType ->', tabType);
    // console.log('QnTableProps ->', QnTableProps);

    const genTabContent = <QnFilter {...QnFilterProps} />;

    const table = (
      <Fragment>
        <br />
        <QnTable {...QnTableProps} />
      </Fragment>
    );

    const genTabChildContentByStatistics = (
      <Fragment>
        {middleButtonArea}
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
        <Tabs activeKey={type} onChange={item => this.changeRoute(item, 'type')}>
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

  queryParams: IQueryParams = getPageQuery();

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
    switch (this.state ? this.state.tabType : getPageQuery('tabType') || 'HwStage') {
      case 'HwDetail':
        api = 'queryHwDetail';
        tableListParams = tableListParamsByDetail;
        break;
      case 'serviceDetail':
        api = 'queryServiceDetail';
        tableListParams = tableListParamsByDetail;
        break;
      case 'HwSummary':
        api = 'queryHwSummary';
        tableListParams = tableListParamsBySummary;
        break;
      case 'serviceSummary':
        api = 'queryServiceSummary';
        tableListParams = tableListParamsBySummary;
        break;
      case 'HwAndServiceSummary':
        api = 'queryHWAndServiceSummary';
        tableListParams = tableListParamsBySummary;
        break;
      default:
        break;
    }
    return {
      api,
      tableListParams,
    };
  };

  changeRoute = (key = '', type = '') => {
    let param = {};
    if (type === 'type') {
      let tabType = '';
      if (key === 'customer') {
        tabType = 'HwStage';
      } else {
        tabType = 'HwDetail';
      }
      param = {
        type: key,
        tabType,
      };
    } else {
      param = {
        tabType: key,
      };
    }

    this.setState({ ...param }, () => {
      const { type, tabType } = this.state;
      let routeUrl = `/receivable/list?type=${type}&&tabType=${tabType}`;
      router.push(routeUrl);
      this.updatePanes();

      const { type: typeKey, tabType: tabTypeKey, ...otherParamns } = getPageQuery();
      if (key === 'customer') {
        this.queryContractList(otherParamns);
      } else {
        this.queryList(otherParamns);
      }
    });
  };

  genMiddleSection = () => {
    return (
      <Fragment>
        <div className="headLayout" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
          {/* <h3>发票记录</h3> */}
          <Button onClick={() => {}}>导出</Button>
        </div>
      </Fragment>
    );
  };

  queryContractList = (params: object) => {
    // console.log('params ->', params);
    const copyParams = dealWithQueryParams(params);
    const { tabType, type, pageType, ...otherParams } = copyParams;
    const { dispatch } = this.props;
    // console.log('copyParams ->', copyParams);
    dispatch({
      type: 'contract/queryList',
      payload: {
        apiName: 'queryList',
        reqType: 'POST',
        bodyData: {
          ...otherParams,
        },
      },
      successCallback: (dataList: []) => {
        this.updatePanes();
        // updateRoute(copyParams);
      },
    });
  };

  queryList = (params: object) => {
    const { api } = this.getDataByTabType();
    const { dispatch } = this.props;
    // console.log('api ->', api);
    // console.log('params ->', params);
    dispatch({
      type: `receivable/${api}`,
      payload: {
        apiName: api,
        reqType: 'POST',
        bodyData: params,
      },
      successCallback: () => {
        this.updatePanes();
        // updateRoute(copyParams);
      },
    });
  };

  queryContractListByDebounce = debounce(this.queryContractList, 1000);
  queryListByDebounce = debounce(this.queryList, 1000);

  handleContractPageChange = (currentPage: number, pageSize: number) => {
    this.queryContractListByDebounce({ pageSize, currentPage });
  };

  handleContractFilterChange = (filterParams: object) => {
    this.queryContractListByDebounce({ ...filterParams });
  };

  handleFilterChange = (filterParams: object) => {
    this.queryListByDebounce({ ...filterParams });
  };

  onEditPanesTab = (targetKey: string, action: string) => {
    console.log('targetKey ->', targetKey);
    console.log('action ->', action);
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
    console.log('contractId ->', contractId);
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

  onChangePanesTab = (activePanesTabKey: string) => {
    this.setState({ activePanesTabKey });
    let panelType = activePanesTabKey.split('_')[0];
    let contractId = activePanesTabKey.split('_')[1];
    let contractType = activePanesTabKey.split('_')[2];
    console.log('activeKey ->', activePanesTabKey);
    console.log('contractId ->', contractId);
    const { currentPage, pageSize, tabType, type } = getPageQuery();

    switch (panelType) {
      case 'list':
        updateRoute({ currentPage, pageSize, tabType, type });
        this.queryContractList(getPageQuery());
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
    console.log('type ->', type);
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
            content: <ReceivablesView {...params} />,
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
    console.log('panes ->', panes);
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
