import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Button, Card, message } from 'antd';
import withRouter from 'umi/withRouter';
import { QnTable } from '@/utils/Qneen/index';
import { genTableColumns } from '@/utils/format/dataGen';
import { getPageQuery, updateRoute } from '@/utils/utils';
import tableListParamsByHwStage from './tableListParamsByHwStage';
import tableListParamsByService from './tableListParamsByService';
import { ReceivableModelState } from '@/models/receivable';
import { QnFormModal } from '@/utils/Qneen/index';
import { formDict } from './formParams';
import { cloneDeep } from 'lodash';

interface IConnectState extends ConnectState {
  receivable: ReceivableModelState;
}

interface IProps extends ConnectProps {
  dispatch: Dispatch;
  queryViewList: Function;
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
    let updateFormDataApi = '';
    let copyFormDict = Object.assign({}, formDict);
    if (contractType === 0) {
      contractName = '硬件分期 - 实际到账';
      tableListParams = tableListParamsByHwStage;
      updateFormDataApi = 'updateCustomHw';
      delete copyFormDict.day1_5;
      delete copyFormDict.day6_30;
    } else {
      contractName = '服务费 - 实际到账';
      tableListParams = tableListParamsByService;
      updateFormDataApi = 'updateCustomService';
      delete copyFormDict.day1_30;
    }

    return {
      contractName,
      tableListParams,
      updateFormDataApi,
      formDict: copyFormDict,
    };
  };

  updateFormData = (params: object) => {
    const { updateFormDataApi } = this.getItemByQueryType();
    const { dispatch, queryViewList } = this.props;
    for (let key in params) {
      if (key !== 'contractId') {
        params[key] = parseFloat(params[key]);
      }
    }
    dispatch({
      type: `receivable/${updateFormDataApi}`,
      payload: {
        apiName: updateFormDataApi,
        reqType: 'POST',
        bodyData: params,
      },
      successCallback: () => {
        message.success('编辑成功');
        queryViewList();
      },
    });
  };

  export = () => {
    const { contractType, contractId } = getPageQuery();
    const { dispatch } = this.props;

    let api = parseInt(contractType, 10) === 0 ? 'exportCustomHw' : 'exportCustomService';

    dispatch({
      type: `receivable/${api}`,
      payload: {
        apiName: api,
        reqType: 'GET',
        placeholerData: {
          contractId,
        },
      },
      successCallback: () => {
        message.success('导出成功！');
      },
    });
  };

  genMiddleSection = () => {
    const { contractName, formDict } = this.getItemByQueryType();
    const { dataList } = this.props;
    const contractId = getPageQuery('contractId');
    const { actionPlan } = this.props;
    const manualData = dataList.filter(v => v.nper === '手动核实到账')[0];

    let extraData = {
      contractId,
    };
    let title = '添加手动核实到账';
    let formInitialValueObj = {};
    if (manualData) {
      if (manualData.id) {
        extraData.id = manualData.id;
        title = '编辑手动核实到账';
        formInitialValueObj = manualData;
      }
    }

    const QnFormModalProps = {
      buttonProps: {
        type: 'primary',
        title,
      },
      formDict,
      title,
      handleOk: this.updateFormData,
      extraData,
      formInitialValueObj,
    };

    return (
      <Fragment>
        <div className="headLayout" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
          <h3>{contractName}</h3>
          <div className="rightFlexArea">
            <Button onClick={this.export}>导出</Button>
            <QnFormModal {...QnFormModalProps} />
            <p>Action Plan：{actionPlan}</p>
          </div>
        </div>
      </Fragment>
    );
  };

  // handleClick = (e: Object): void => {};

  genActualReceiptTable = () => {
    const { dataList } = this.props;
    const filterData = cloneDeep(dataList).map(v => {
      for (let key in v) {
        if (key === 'receivablePayment' || key === 'actualPayment' || key === 'unOverdueAmount') {
          v[key] = v[key] === 0 ? undefined : v[key];
        } else {
          v[key] = undefined;
        }
      }
      return v;
    });

    const dataSource = filterData.map((v, i) => {
      v.index = i + 1;
      return v;
    });
    const { tableListParams } = this.getItemByQueryType();
    const QnTableProps = {
      dataSource,
      columns: genTableColumns(tableListParams),
      total: filterData.length,
      hasPagination: false,
      rowKey: (_, index) => index,
    };
    return <QnTable {...QnTableProps} />;
  };

  genOverdueTable = () => {
    const { dataList } = this.props;
    const filterData = cloneDeep(dataList).map(v => {
      for (let key in v) {
        if (key === 'receivablePayment' || key === 'actualPayment' || key === 'unOverdueAmount') {
          v[key] = undefined;
        } else {
          v[key] = v[key] === 0 ? undefined : v[key];
        }
      }
      return v;
    });
    const dataSource = filterData.map((v, i) => {
      v.index = i + 1;
      return v;
    });
    const { tableListParams } = this.getItemByQueryType();
    const QnTableProps = {
      dataSource,
      columns: genTableColumns(tableListParams),
      total: filterData.length,
      hasPagination: false,
      rowKey: (_, index) => index,
    };
    return <QnTable {...QnTableProps} />;
  };

  render() {
    const contractType = parseInt(getPageQuery('contractType'), 10);

    return (
      <Card bordered={false}>
        {this.genMiddleSection()}
        {this.genActualReceiptTable()}
        <h3 style={{ marginTop: 10 }}> {contractType === 0 ? '硬件分期' : '服务费'} - 逾期</h3>
        {this.genOverdueTable()}
      </Card>
    );
  }
}

export default withRouter(ReceivablesView as React.ComponentClass<any>);
