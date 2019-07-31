import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Button, message, Icon, Tabs } from 'antd';
import withRouter from 'umi/withRouter';
import router from 'umi/router';
import { Link } from 'dva/router';
import { genTableColumns } from '@/utils/format/dataGen';
import { QnListPage, QnFormModal, QnFilter } from '@/utils/Qneen/index';
import tableFilterParamsByCustomer from './Customer/tableFilterParamsByCustomer';
import tableListParamsByHwStage from './Customer/tableListParamsByHwStage';
import tableListParamsByService from './Customer/tableListParamsByService';
import tableFilterParamsByStatistics from './Statistics/tableFilterParamsByStatistics';
import tableListParamsByDetail from './Statistics/tableListParamsByDetail';
import tableListParamsBySummary from './Statistics/tableListParamsBySummary';
import { ReceivableModelState } from '@/models/receivable';
import { IQueryParams } from '../receivable';
import { getPageQuery, updateRoute } from '@/utils/utils';
import styles from '../../WriteOff/WriteOff.less';

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
    switch (this.state.tabType) {
      case 'HwStage':
        api = 'queryCustomHw';
        tableListParams = tableListParamsByHwStage;
        break;
      case 'service':
        api = 'queryCustomCommission';
        tableListParams = tableListParamsByService;
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
    };
  };

  changeRoute = (key = '') => {
    let routeUrl = '';
    if (key === 'customer') {
      routeUrl = '/receivable/list?type=customer&&tabType=HwStage';
    } else if (key === 'statistics') {
      routeUrl = '/receivable/list?type=statistics&&tabType=HwDetail';
    }
    this.setState({ type: key }, () => {
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
        <div className={styles.headLayout} style={{ marginBottom: '1rem' }}>
          <h3>发票记录</h3>
          <Button onClick={() => {}}>导出</Button>
        </div>
      </Fragment>
    );
  };

  render() {
    const { dataList } = this.props;
    const { type } = this.state;
    const { tableListParams } = this.getDataByTabType();
    const { tableFilterParams } = this.getDataByPageType();

    const QnListPageProps: object = {
      dataSource: dataList,
      columns: genTableColumns(tableListParams),
      filterRules: tableFilterParams,
      total: dataList.length,
      hasPagination: false,
      col: 2,
      rowSelection: null,
      middleSection: this.genMiddleSection(),
    };

    console.log('tableFilterParams ->', tableFilterParams);

    const QnFilterProps = {
      handleChange: () => {},
      rules: tableFilterParams,
      col: 2,
    };

    const genTabContent = <QnFilter {...QnFilterProps} />;
    return (
      <Card className="wrapper-right-content" title="应收管理">
        <Tabs activeKey={type} onChange={this.changeRoute}>
          <TabPane tab="客户应收" key="customer">
            {/* <QnListPage {...QnListPageProps} /> */}
            {genTabContent}
          </TabPane>
          <TabPane tab="应收统计" key="statistics">
            {/* <QnListPage {...QnListPageProps} /> */}
            {genTabContent}
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default withRouter(Receivable as any);
