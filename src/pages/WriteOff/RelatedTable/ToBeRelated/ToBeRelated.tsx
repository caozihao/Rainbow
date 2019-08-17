import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Icon, Button, Spin, message } from 'antd';
import withRouter from 'umi/withRouter';
import { QnListPage } from '@/utils/Qneen';
import { WriteOffModelState } from '@/models/writeOff';
import { genTableColumns } from '@/utils/format/dataGen';
import { ContractModelState } from '@/models/contract';
import tableListParams from '../queryWriteOffRecordListParams';
import { getPageQuery } from '@/utils/utils';
import { IContractDetail, IQueryParams } from '../../writeoff.d';
interface IConnectState extends ConnectState {
  writeOff: WriteOffModelState;
  contract: ContractModelState;
}

interface IProps extends ConnectProps, WriteOffModelState {
  dispatch: Dispatch;
  relationToContractLoading: Boolean;
  contractDetail: IContractDetail;
  settlementId: string;
  writeOffType: string;
  queryWriteOffRecord: Function;
}

interface IState {
  selectedRowKeys: Array<any>;
}

@connect(({ writeOff, loading, contract }: IConnectState) => {
  const { toBeRelatedDataList } = writeOff;
  const { detail } = contract;
  return {
    relationToContractLoading: loading.effects['writeOff/relationToContract'],
    toBeRelatedDataList,
    contractDetail: detail,
  };
})
class ToBeRelated extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  queryParams: IQueryParams = getPageQuery();

  componentDidMount() {}

  componentDidUpdate() {}

  relationToContract = () => {
    const { dispatch, settlementId, writeOffType,queryWriteOffRecord } = this.props;
    const { selectedRowKeys } = this.state;
    const { contractId } = this.queryParams;

    dispatch({
      type: 'writeOff/relationToContract',
      payload: {
        apiName: 'relationToContract',
        reqType: 'POST',
        bodyData: {
          contractId,
          writeOffIds: selectedRowKeys,
          settlementId,
          // writeOffType,
        },
      },
      successCallback: () => {
        this.setState({
          selectedRowKeys: [],
        });
        queryWriteOffRecord();
        message.success('关联成功');
      },
    });
  };

  syncByCustomId = () => {
    const { dispatch, contractDetail } = this.props;
    const { customId } = contractDetail;
    dispatch({
      type: 'writeOff/syncByCustomId',
      payload: {
        apiName: 'syncByCustomId',
        reqType: 'GET',
        placeholerData: {
          customId,
        },
      },
      successCallback: () => {
        message.success('同步成功！');
      },
    });
  };

  genMiddleSectionToBeRelated = () => {
    const { selectedRowKeys } = this.state;
    return (
      <div className="headLayout" style={{ margin: '0.5rem 0' }}>
        <h3>
          待关联的核销记录
          <a onClick={this.syncByCustomId}>
            <Icon type="sync" style={{ marginLeft: '0.5rem' }} />
          </a>
        </h3>
        <div>
          <Button
            disabled={!selectedRowKeys.length}
            onClick={this.relationToContract}
            style={{ marginRight: '1rem' }}
            type="primary"
          >
            关联到合同
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const { toBeRelatedDataList, relationToContractLoading } = this.props;
    const copyTableListParams = Object.assign({}, tableListParams);
    const { selectedRowKeys } = this.state;

    const QnListPagePropsToBeRelated: object = {
      dataSource: toBeRelatedDataList,
      columns: genTableColumns(copyTableListParams),
      title: '',
      hasPagination: false,
      rowKey: item => item.writeOffId,
      rowSelection: {
        selectedRowKeys,
        onChange: (selectedRowKeys = [], selectedRows = []) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.setState({
            selectedRowKeys,
          });
        },
      },
      total: toBeRelatedDataList.length,
      middleSection: this.genMiddleSectionToBeRelated(),
    };

    return (
      <Spin spinning={!!relationToContractLoading}>
        <QnListPage {...QnListPagePropsToBeRelated} />
      </Spin>
    );
  }
}

export default withRouter(ToBeRelated as React.ComponentClass<any>);
