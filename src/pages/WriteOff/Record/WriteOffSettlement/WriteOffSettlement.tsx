import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Icon, Button, Spin, message } from 'antd';
import withRouter from 'umi/withRouter';
import { QnListPage, QnModal } from '@/utils/Qneen';
import { WriteOffModelState } from '@/models/writeOff';
import { genTableColumns } from '@/utils/format/dataGen';
import { ContractModelState } from '@/models/contract';
import tableListParams from '../tableListParams.tsx';
import { IQueryParams, IContractDetail } from '../../writeoff.d';
import { getPageQuery } from '@/utils/utils';
import RelatedTable from '../../RelatedTable/RelatedTable';

import styles from '../../WriteOff.less';

interface IConnectState extends ConnectState {
  writeOff: WriteOffModelState;
  contract: ContractModelState;
}

interface IProps extends ConnectProps, WriteOffModelState {
  dispatch: Dispatch;
  relationToContractLoading: Boolean;
  dataSource: Array<any>;
  headTitle: string;
}

interface IState {}

@connect(({ writeOff, loading }: IConnectState) => {
  return {
    // relationToContractLoading: loading.effects['invoice/relationToContract'],
  };
})
class WriteOffSettlement extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  queryParams: IQueryParams = getPageQuery();

  tableListParams = (() => {
    const QnModalProps = {
      title: '核销记录',
      triggerType: 'a',
      triggerTitle: <Icon type="plus" style={{ marginRight: '0.5rem' }} />,
      width: 800,
      otherProps: {
        footer: null,
      },
    };
    const copyTableListParams = Object.assign(tableListParams, {
      control: {
        name: 'control',
        title: '',
        render: (text, record) => {
          const { settlementId } = record;
          const RelatedTableProps = {
            writeOffType: 0,
            settlementId,
          };
          return (
            <Fragment>
              <a href="javascript:void(0)">
                <QnModal {...QnModalProps}>
                  <RelatedTable {...RelatedTableProps} />
                </QnModal>
              </a>
              <a
                href="javascript:void(0)"
                onClick={() => this.unRelationToContract(RelatedTableProps)}
              >
                <Icon type="minus" />
              </a>
            </Fragment>
          );
        },
      },
    });

    return copyTableListParams;
  })();

  componentDidMount() {}

  componentDidUpdate() {}

  unRelationToContract = ({ settlementId = '', writeOffType = 0 }) => {
    const { dispatch } = this.props;
    const { contractId } = this.queryParams;
    dispatch({
      type: 'writeOff/unRelationToContract',
      payload: {
        apiName: 'unRelationToContract',
        reqType: 'POST',
        bodyData: {
          contractId,
          WriteOffIds: [],
          settlementId,
          writeOffType,
        },
      },
      successCallback: () => {
        this.setState({
          selectedRowKeys: [],
        });
        message.success('取消关联成功');
      },
    });
  };

  exportByContractId = () => {
    const { contractId, tabType } = this.queryParams;
    const { dispatch } = this.props;
    dispatch({
      type: 'writeOff/exportByContractId',
      payload: {
        apiName: 'exportByContractId',
        reqType: 'GET',
        placeholerData: {
          contractId,
        },
        queryData:{
          type: tabType === 'stageWriteOff' ? 0 : 1,
        }
      },
      successCallback: () => {
        message.success('导出成功')
      },
    });
  };

  genMiddleSectionToBeRelated = (headTitle = '') => {
    const { type } = this.queryParams;
    return (
      <div className={styles.headLayout} style={{ marginBottom: '1rem' }}>
        <h3>{headTitle}</h3>
        {type === 'detail' ? <Button onClick={this.exportByContractId}>导出</Button> : ''}
      </div>
    );
  };

  render() {
    const { dataSource, headTitle, relationToContractLoading } = this.props;
    const { type } = this.queryParams;

    const QnListPagePropsToBeRelated: object = {
      dataSource,
      columns: type === 'detail' ? genTableColumns(this.tableListParams) : tableListParams,
      hasPagination: false,
      middleSection: this.genMiddleSectionToBeRelated(headTitle),
      total: dataSource.length,
      rowKey: (_, index) => index,
      rowSelection: null,
    };

    return (
      <Spin spinning={!!relationToContractLoading}>
        <QnListPage {...QnListPagePropsToBeRelated} />
      </Spin>
    );
  }
}

export default withRouter(WriteOffSettlement as React.ComponentClass<any>);
