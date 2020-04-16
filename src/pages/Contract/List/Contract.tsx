import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Button, message } from 'antd';
import withRouter from 'umi/withRouter';
import { QnListPage, QnFormModal } from '@/utils/Qneen/index';
import tableListParams from './tableListParams';
import { genTableColumns } from '@/utils/format/dataGen';
import tableFilterParams from './tableFilterParams';
import { ContractModelState } from '@/models/contract';
import { formDict } from './formParams';
import debounce from 'lodash/debounce';
import { AccountModelState } from '@/models/account';

import {
  getPageQuery,
  dealWithQueryParams,
  updateRoute,
  initializeFilterParams,
} from '@/utils/utils';
import Item from 'antd/lib/list/Item';

interface IConnectState extends ConnectState {
  contract: ContractModelState;
  account: AccountModelState;
}
interface IProps extends ConnectProps, ContractModelState, AccountModelState {
  dispatch: Dispatch;
}

interface IState {
  selectedRowKeys: Array<string>;
  ifShowFormLoading: boolean;
  contactsInfo: string;
  payments: string;
}

@connect(({ contract, account }: IConnectState) => {
  const { dataList, dataPageTotal, dataPageNo, dataPageSize, detail } = contract;
  const { accountList } = account;
  return {
    dataList,
    dataPageTotal,
    dataPageNo,
    dataPageSize,
    accountList,
    detail,
  };
})
class Contract extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      ifShowFormLoading: false,
      contactsInfo: '',
      payments: '',
    };
  }

  addAndUpdate = (values: object) => {
    const { contactsInfo, payments } = this.state;
    const copyValue = Object.assign({}, values);
    copyValue['contactsInfo'] = contactsInfo;
    copyValue['payments'] = payments;
    let api = 'contract/create';
    let apiName = 'create';
    let successMesage = '添加成功！';
    if (copyValue['contractId']) {
      api = 'contract/modify';
      apiName = 'modify';
      successMesage = '修改成功！';
    }

    const { dispatch } = this.props;
    this.setState({
      ifShowFormLoading: true,
    });

    const promise = new Promise(resolve => {
      dispatch({
        type: api,
        payload: {
          apiName,
          reqType: 'POST',
          bodyData: copyValue,
        },
        successCallback: () => {
          message.success(successMesage);
          this.queryList(getPageQuery());
          this.setState({
            ifShowFormLoading: false,
          });
          resolve();
        },
      });
    });

    return promise;
  };

  saveDynamicFormData = (dataType: any, formDict: object) => {
    console.log('formDict ->', formDict);
    const { keys } = formDict;
    let arr = [];
    if (dataType === 'contactsInfo') {
      for (let i = 0; i < keys.length; i++) {
        arr.push({
          connectName: formDict[`connectName_${keys[i]}`],
          connectWay: formDict[`connectWay_${keys[i]}`],
          email: formDict[`email_${keys[i]}`],
          position: formDict[`position_${keys[i]}`],
        });
      }
      const contactsInfo = JSON.stringify(arr);
      this.setState({
        contactsInfo,
      });
    } else if (dataType === 'payments') {
      for (let i = 0; i < keys.length; i++) {
        arr.push(formDict[`number_${i}`]);
      }
      const payments = arr.join(',');
      this.setState({
        payments,
      });
    }
  };

  QnFormModalProps = (type: string) => {
    const { ifShowFormLoading } = this.state;
    const { accountList } = this.props;
    // console.log('accountList ->', accountList);
    const modalOtherProps = {
      width: 800,
      rowsNumber: 2,
      rowSplitTitleDict: {
        0: '基础信息',
        6: '交易信息',
        12: '联系人信息',
        13: '添加每期合同',
        // 14: '上传合同',
      },
    };

    formDict.salesNo.onFocus = this.queryByName;
    formDict.salesNo.options = accountList.map((v, i) => {
      const { accountNo, name } = v;
      return { label: name, value: accountNo };
    });

    // totalAmount receivableNum  firstPayment  periodPayment

    const changeParamsByContractType = (dict, params, type) => {
      params.forEach(v => {
        dict[v].required = !type;
        dict[v].otherProps = {
          disabled: !!type,
        };
      });
    };

    formDict.type.onChange = (contractType: string) => {
      console.log('contractType ->', contractType);

      const params = ['totalAmount', 'receivableNum', 'periodPayment', 'firstPayment'];
      changeParamsByContractType(formDict, params, parseInt(contractType, 10));
      this.setState({
        contractType,
      });
    };

    // console.log('formDict.salesNo.options ->', formDict.salesNo.options);

    const commonParams = {
      formDict,
      handleOk: this.addAndUpdate,
      ifShowFormLoading,
      saveDynamicFormData: this.saveDynamicFormData,
    };

    let result = {};

    if (type === 'QnListPage') {
      result = { ...commonParams, modalOtherProps };
    } else if (type === 'QnFormModal') {
      result = { ...commonParams, ...modalOtherProps };
    }

    return result;
  };

  genOption = () => {
    return {
      name: 'option',
      title: '操作',
      render: (text, record) => {
        const { contractId } = record;
        const copyQnFormModalProps = Object.assign({}, this.QnFormModalProps('QnFormModal'));
        // console.log('copyQnFormModalProps ->', copyQnFormModalProps);
        const extraData = {
          buttonProps: {
            type: 'primary',
            title: '修改',
            size: 'small',
          },
          title: '修改合同',
          handleOk: this.addAndUpdate,
          handleTriggerClick: () => this.queryById(contractId),
          formInitialValueObj: this.props.detail,
          extraData: {
            contractId: this.props.detail.contractId,
          },
        };

        const extraDetailData = {
          buttonProps: {
            type: 'default',
            title: '查看',
            size: 'small',
            style: {
              marginRight: '10px',
            },
          },
          title: '查看合同',
          type: 'detail',
          handleTriggerClick: () => this.queryById(contractId),
          formInitialValueObj: this.props.detail,
        };

        return (
          <Fragment>
            <QnFormModal
              {...copyQnFormModalProps}
              {...extraDetailData}
              style={{ marginRight: '10px' }}
            ></QnFormModal>
            <QnFormModal {...copyQnFormModalProps} {...extraData}></QnFormModal>
          </Fragment>
        );
      },
    };
  };

  tableFilterParams = tableFilterParams;

  componentDidMount() {
    this.queryList(getPageQuery());
    this.tableFilterParams = initializeFilterParams(tableFilterParams);
  }

  componentDidUpdate() {}

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
      successCallback: () => {
        updateRoute(copyParams);
      },
    });
  };

  queryById = (contractId: string) => {
    console.log('queryById contractId ->', contractId);
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
      successCallback: () => {},
    });
  };

  queryByName = (accountName = '') => {
    // console.log('accountName ->', accountName);
    const { dispatch } = this.props;

    dispatch({
      type: 'account/queryByName',
      payload: {
        apiName: 'queryByName',
        reqType: 'GET',
        queryData: {
          accountName,
        },
      },
      successCallback: () => {},
    });
  };

  batchDelete = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    console.log('selectedRowKeys ->', selectedRowKeys);
    dispatch({
      type: 'contract/batchDelete',
      payload: {
        apiName: 'batchDelete',
        reqType: 'POST',
        bodyData: {
          contractIds: selectedRowKeys,
        },
      },
      successCallback: () => {
        message.success('删除成功!');
        this.queryList(getPageQuery());
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

  genMiddleSection = () => {
    return (
      <div style={{ marginBottom: '1rem' }}>
        {/* <Button style={{ marginRight: '1rem' }} type="primary">
          创建核销表
        </Button> */}
        <Button
          type="danger"
          disabled={!this.state.selectedRowKeys.length}
          onClick={this.batchDelete}
        >
          删除合同
        </Button>
      </div>
    );
  };

  // handleClick = (e: Object): void => {};

  render() {
    const { dataList, dataPageTotal, dataPageNo } = this.props;
    const copyTableListParams = Object.assign({}, tableListParams);
    copyTableListParams['option'] = this.genOption();

    const QnListPageProps: object = {
      dataSource: dataList,
      columns: genTableColumns(copyTableListParams),
      title: '合同',
      rowSelection: {
        onChange: (selectedRowKeys = [], selectedRows = []) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.setState({
            selectedRowKeys,
          });
        },
      },
      filterRules: this.tableFilterParams,
      col: 2,
      handlePageChange: this.handlePageChange,
      handleFilterChange: this.handleFilterChange,
      total: dataPageTotal,
      current: dataPageNo,
      hasAdder: true,
      adderType: 'modal',
      middleSection: this.genMiddleSection(),
      rowKey: item => item.contractId,
      ...this.QnFormModalProps('QnListPage'),
    };
    return (
      <Card className="wrapper-right-content" title="合同管理">
        <QnListPage {...QnListPageProps} />
      </Card>
    );
  }
}

export default withRouter(Contract as any);
