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
import tableListParamsByHwStage from './Customer/tableListParamsByHwStage';
import tableListParamsByService from './Customer/tableListParamsByService';
import tableFilterParamsByStatistics from './Statistics/tableFilterParamsByStatistics';
import tableListParamsByDetail from './Statistics/tableListParamsByDetail';
import tableListParamsBySummary from './Statistics/tableListParamsBySummary';
import { ReceivableModelState } from '@/models/receivable';
import { IQueryParams } from '../receivable';
import contractTableListParams from './Customer/tableListParamsByContract';
import { getPageQuery, updateRoute, dealWithQueryParams } from '@/utils/utils';
import { ContractModelState } from '@/models/contract';
import debounce from 'lodash/debounce';

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
      type: this.queryParams.type,
      tabType: this.queryParams.tabType,
    };
  }

  componentDidMount() {
    this.queryContractList(getPageQuery());
  }

  componentDidUpdate() {}

  queryParams: IQueryParams = getPageQuery();

  option = {
    name: 'option',
    title: '操作',
    render: (text, record) => {
      return <Button>查看</Button>;
    },
  };

  getDataByTabType = () => {
    let api = '';
    let tableListParams = {};
    let middleButtonArea = (
      <div className="rightFlexArea">
        <Button className="">导出</Button>
      </div>
    );
    switch (this.state.tabType) {
      case 'HwStage':
        api = 'queryCustomHw';
        tableListParams = tableListParamsByHwStage;
        middleButtonArea = (
          <div className="rightFlexArea">
            <Button>导出</Button>
            <Button type="primary">编辑手动核实到账</Button>
            <p>Action Plan：服务结清</p>
          </div>
        );
        break;
      case 'service':
        api = 'queryCustomCommission';
        tableListParams = tableListParamsByService;
        middleButtonArea = (
          <div className="rightFlexArea">
            <Button type="primary">编辑手动核实到账</Button>
            <p>Action Plan：服务结清</p>
          </div>
        );
        break;
      case 'HwDetail':
        api = 'queryHwDetail';
        tableListParams = tableListParamsByDetail;
        break;
      case 'HwSummary':
        api = 'queryHwSummary';
        tableListParams = tableListParamsBySummary;
        break;
      case 'serviceDetail':
        api = 'queryServiceDetail';
        tableListParams = tableListParamsByDetail;
        break;
      case 'serviceSummary':
        api = 'queryServiceSummary';
        tableListParams = tableListParamsBySummary;
        break;
      default:
        break;
    }
    return {
      api,
      tableListParams,
      middleButtonArea,
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
    console.log('params ->', params);
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
        updateRoute(copyParams);
      },
    });
  };

  queryList = (params: object) => {
    const { api } = this.getDataByTabType();
    const { dispatch } = this.props;
    console.log('api ->', api);
    dispatch({
      type: `receivable/${api}`,
      payload: {
        apiName: api,
        reqType: 'POST',
        bodyData: params,
      },
      successCallback: () => {
        updateRoute(params);
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

  render() {
    const { dataList, contractDataList, contractDataPageTotal, contractDataPageNo } = this.props;
    const { type, tabType } = this.state;
    const { tableListParams, middleButtonArea } = this.getDataByTabType();

    let QnTableProps = {};
    let QnFilterProps = {};

    if (type === 'customer') {
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
      QnTableProps = {
        dataSource: dataList,
        columns: genTableColumns(tableListParams),
        total: dataList.length,
        hasPagination: false,
      };

      QnFilterProps = {
        handleChange: this.handleFilterChange,
        rules: tableFilterParamsByStatistics,
        col: 2,
      };
    }

    const genTabContent = <QnFilter {...QnFilterProps} />;

    const table = <QnTable {...QnTableProps} />;

    // const genTabChildContentByCustomer = (
    //   <Fragment>
    //     {middleButtonArea}
    //     <Tabs activeKey={tabType} onChange={item => this.changeRoute(item, 'tabType')}>
    //       <TabPane tab="硬件分期" key="HwStage">
    //         {table}
    //       </TabPane>
    //       <TabPane tab="服务费" key="service">
    //         {table}
    //       </TabPane>
    //     </Tabs>
    //   </Fragment>
    // );

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
        </Tabs>
      </Fragment>
    );

    return (
      <Card className="wrapper-right-content" title="应收管理">
        <Tabs activeKey={type} onChange={item => this.changeRoute(item, 'type')}>
          <TabPane tab="客户应收" key="customer">
            {genTabContent}
            {table}
          </TabPane>
          <TabPane tab="应收统计" key="statistics">
            {genTabContent}
            {genTabChildContentByStatistics}
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default withRouter(Receivable as any);
