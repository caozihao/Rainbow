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
import { getPageQuery, updateRoute } from '@/utils/utils';

const { TabPane } = Tabs;

interface IConnectState extends ConnectState {
  receivable: ReceivableModelState;
}
interface IProps extends ConnectProps, ReceivableModelState {
  dispatch: Dispatch;
}

interface IState {
  type: string;
  tabType: string;
}

@connect(({ receivable }: IConnectState) => {
  const { dataList } = receivable;
  return {
    dataList,
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
    this.queryList(getPageQuery());
  }

  componentDidUpdate() {}

  queryParams: IQueryParams = getPageQuery();

  getDataByPageType = () => {
    let tableFilterParams: Array<any> = [];
    switch (this.state.type) {
      case 'customer':
        tableFilterParams = tableFilterParamsByCustomer;
        break;
      case 'statistics':
        tableFilterParams = tableFilterParamsByStatistics;
        break;
      default:
        break;
    }
    return {
      tableFilterParams,
    };
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

  queryList = (params: object) => {
    const { api } = this.getDataByTabType();
    const { dispatch } = this.props;
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

  genMiddleSection = () => {
    return (
      <Fragment>
        <div className="headLayout" style={{ marginBottom: '1rem' }}>
          {/* <h3>发票记录</h3> */}
          <Button onClick={() => {}}>导出</Button>
        </div>
      </Fragment>
    );
  };

  render() {
    const { dataList } = this.props;
    const { type, tabType } = this.state;
    const { tableListParams, middleButtonArea } = this.getDataByTabType();
    const { tableFilterParams } = this.getDataByPageType();

    const QnTableProps: object = {
      dataSource: dataList,
      columns: genTableColumns(tableListParams),
      total: dataList.length,
      hasPagination: false,
      rowSelection: null,
    };

    const QnFilterProps = {
      handleChange: () => {},
      rules: tableFilterParams,
      col: 2,
    };

    const genTabContent = <QnFilter {...QnFilterProps} />;

    const table = <QnTable {...QnTableProps} />;

    const genTabChildContentByCustomer = (
      <Fragment>
        {middleButtonArea}
        <Tabs activeKey={tabType} onChange={item => this.changeRoute(item, 'tabType')}>
          <TabPane tab="硬件分期" key="HwStage">
            {table}
          </TabPane>
          <TabPane tab="服务费" key="service">
            {table}
          </TabPane>
        </Tabs>
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
        </Tabs>
      </Fragment>
    );

    return (
      <Card className="wrapper-right-content" title="应收管理">
        <Tabs activeKey={type} onChange={item => this.changeRoute(item, 'type')}>
          <TabPane tab="客户应收" key="customer">
            {genTabContent}
            {genTabChildContentByCustomer}
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
