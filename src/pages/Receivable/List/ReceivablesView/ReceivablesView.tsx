import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Button, Card } from 'antd';
import withRouter from 'umi/withRouter';
import { QnTable } from '@/utils/Qneen/index';
import { genTableColumns } from '@/utils/format/dataGen';
import { getPageQuery, updateRoute } from '@/utils/utils';
import tableListParamsByHwStage from './tableListParamsByHwStage';
import tableListParamsByService from './tableListParamsByService';

interface ReceivablesViewModelState {}

interface IConnectState extends ConnectState {}

interface IProps extends ConnectProps, ReceivablesViewModelState {
  dispatch: Dispatch;
}

interface IState {}

@connect(({  }: IConnectState) => ({}))
class ReceivablesView extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.queryList();
  }

  componentDidUpdate() {}

  queryList = (params: object) => {
    const { api } = this.getItemByQueryType();
    const { dispatch } = this.props;
    const { contractId } = getPageQuery('contractType');
    dispatch({
      type: `receivable/${api}`,
      payload: {
        apiName: api,
        reqType: 'GET',
        placeHolderData: {
          contractId,
        },
      },
      successCallback: () => {},
    });
  };

  getItemByQueryType = () => {
    const contractType = parseInt(getPageQuery('contractType'), 10);
    let contractName = '';
    let tableListParams = {};
    let api = '';
    if (contractType === 0) {
      contractName = '硬件分期';
      tableListParams = tableListParamsByHwStage;
      api = 'receivable/queryCustomHw';
    } else {
      contractName = '服务费';
      tableListParams = tableListParamsByService;
      api = 'receivable/queryCustomService';
    }

    return {
      contractName,
      tableListParams,
      api,
    };
  };

  genMiddleSection = () => {
    const { contractName } = this.getItemByQueryType();
    return (
      <Fragment>
        <div className="headLayout" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
          <h3>{contractName}</h3>
          <div className="rightFlexArea">
            <Button type="primary">编辑手动核实到账</Button>
            <p>Action Plan：服务结清</p>
          </div>
        </div>
      </Fragment>
    );
  };

  // handleClick = (e: Object): void => {};

  genTable = () => {
    // const QnTableProps = {
    //   dataSource: dataList,
    //   columns: genTableColumns(tableListParams),
    //   total: dataList.length,
    //   hasPagination: false,
    // };
    // return <QnTable {...QnTableProps} />;
  };

  render() {
    const genTable = this.genTable();
    return (
      <Card bordered={false}>
        {this.genMiddleSection()}
        表单
        {/* <QnTable {...QnTableProps} /> */}
      </Card>
    );
  }
}

export default withRouter(ReceivablesView as React.ComponentClass<any>);
