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
import { ReceivableModelState } from '@/models/receivable';

interface IConnectState extends ConnectState {
  receivable: ReceivableModelState;
}

interface IProps extends ConnectProps {
  dispatch: Dispatch;
  [key: string]: any;
}

interface IState {}

@connect(({ receivable }: IConnectState) => {
  const { dataList, actionPlan } = receivable;

  return {
    dataList,
    actionPlan,
  };
})
class ReceivablesView extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.queryList();
  }

  componentDidUpdate() {}

  getItemByQueryType = () => {
    const contractType = parseInt(getPageQuery('contractType'), 10);
    let contractName = '';
    let tableListParams = {};
    if (contractType === 0) {
      contractName = '硬件分期';
      tableListParams = tableListParamsByHwStage;
    } else {
      contractName = '服务费';
      tableListParams = tableListParamsByService;
    }

    return {
      contractName,
      tableListParams,
    };
  };

  genMiddleSection = () => {
    const { contractName } = this.getItemByQueryType();
    const { actionPlan } = this.props;
    return (
      <Fragment>
        <div className="headLayout" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
          <h3>{contractName}</h3>
          <div className="rightFlexArea">
            <Button>导出</Button>
            <Button type="primary">编辑手动核实到账</Button>
            <p>Action Plan：{actionPlan}</p>
          </div>
        </div>
      </Fragment>
    );
  };

  // handleClick = (e: Object): void => {};

  genTable = () => {
    const { dataList } = this.props;
    const dataSource = dataList.map((v, i) => {
      v.index = i + 1;
      return v;
    });
    const { tableListParams } = this.getItemByQueryType();
    const QnTableProps = {
      dataSource,
      columns: genTableColumns(tableListParams),
      total: dataList.length,
      hasPagination: false,
    };
    return <QnTable {...QnTableProps} />;
  };

  render() {
    return (
      <Card bordered={false}>
        {this.genMiddleSection()}
        {this.genTable()}
      </Card>
    );
  }
}

export default withRouter(ReceivablesView as React.ComponentClass<any>);
