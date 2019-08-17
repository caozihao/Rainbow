import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card, Icon, Button, Tabs, Row, Col, Spin, message } from 'antd';
import withRouter from 'umi/withRouter';
import { QnListPage, QnFormModal } from '@/utils/Qneen';
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
  unRelationToContractLoading: boolean;
  settlementId: string;
  writeOffType: string;
  queryWriteOffRecord: Function;
}

interface IState {
  selectedRowKeys: Array<any>;
}

@connect(({ writeOff, loading }: IConnectState) => {
  const { beRelatedDataList } = writeOff;
  return {
    unRelationToContractLoading: loading.effects['writeOff/unRelationToContract'],
    beRelatedDataList,
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

  genMiddleSectionBeRelated = () => {
    const { selectedRowKeys } = this.state;
    return (
      <div className="headLayout" style={{ margin: '0.5rem 0' }}>
        <h3>已关联的发票信息</h3>
        <Button
          onClick={this.unRelationToContract}
          disabled={!selectedRowKeys.length}
          type="danger"
        >
          取消合同关联
        </Button>
      </div>
    );
  };

  unRelationToContract = () => {
    const { dispatch, settlementId, writeOffType,queryWriteOffRecord } = this.props;
    const { selectedRowKeys } = this.state;
    const { contractId } = this.queryParams;
    dispatch({
      type: 'writeOff/unRelationToContract',
      payload: {
        apiName: 'unRelationToContract',
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
        message.success('取消关联成功');
      },
    });
  };

  render() {
    const { beRelatedDataList, unRelationToContractLoading } = this.props;
    const { selectedRowKeys } = this.state;
    const copyTableListParams = Object.assign({}, tableListParams);

    const QnListPagePropsBeRelated: object = {
      dataSource: beRelatedDataList,
      columns: genTableColumns(copyTableListParams),
      title: '已关联的核销记录',
      rowSelection: {
        selectedRowKeys,
        onChange: (selectedRowKeys = [], selectedRows = []) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.setState({
            selectedRowKeys,
          });
        },
      },
      total: beRelatedDataList.length,
      rowKey: item => item.writeOffId,
      middleSection: this.genMiddleSectionBeRelated(),
      hasPagination: false,
    };

    return (
      <Spin spinning={!!unRelationToContractLoading}>
        <QnListPage {...QnListPagePropsBeRelated} />
      </Spin>
    );
  }
}

export default withRouter(ToBeRelated as React.ComponentClass<any>);
