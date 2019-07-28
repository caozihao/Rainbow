import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Icon, Button, Spin, message } from 'antd';
import withRouter from 'umi/withRouter';
import { QnListPage } from '@/utils/Qneen/index';
import { InvoiceModelState } from '@/models/invoice';
import { genTableColumns } from '@/utils/format/dataGen';
import { ContractModelState } from '@/models/contract';
import tableListParams from '../tableListParams';
import { getPageQuery } from '@/utils/utils';
import { IContractDetail,IQueryParams } from '../../writeoff.d';
import styles from '../../WriteOff.less';

interface IConnectState extends ConnectState {
  invoice: InvoiceModelState;
  contract: ContractModelState;
}

interface IProps extends ConnectProps, InvoiceModelState {
  dispatch: Dispatch;
  relationToContractLoading: Boolean;
  contractDetail: IContractDetail;
}

interface IState {
  selectedRowKeys: Array<any>;
}

@connect(({ invoice, loading, contract }: IConnectState) => {
  const { dataList } = invoice;
  const { detail } = contract;
  return {
    relationToContractLoading: loading.effects['invoice/relationToContract'],
    dataList,
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

  relationToContract = (type: string) => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    const { contractId } = this.queryParams;
    dispatch({
      type: 'invoice/relationToContract',
      payload: {
        apiName: 'relationToContract',
        reqType: 'POST',
        bodyData: {
          contractId,
          invoiceIds: selectedRowKeys,
          type,
        },
      },
      successCallback: () => {
        this.setState({
          selectedRowKeys: [],
        });
        message.success('添加成功');
      },
    });
  };

  syncByCustomId = () => {
    const { dispatch, contractDetail } = this.props;
    const { customId } = contractDetail;
    dispatch({
      type: 'invoice/syncByCustomId',
      payload: {
        apiName: 'syncByCustomId',
        reqType: 'POST',
        placeholerData: {
          customId,
        },
      },
      successCallback: () => {
        message.success('刷新成功');
      },
    });
  };

  genMiddleSectionToBeRelated = () => {
    const { selectedRowKeys } = this.state;
    return (
      <Fragment>
        <div className={styles.headLayout}>
          <h3>
            待关联的发票信息
            <a onClick={this.syncByCustomId}>
              <Icon type="sync" style={{ marginLeft: '0.5rem' }} />
            </a>
          </h3>
          <div>
            <Button
              disabled={!selectedRowKeys.length}
              onClick={() => this.relationToContract('0')}
              style={{ marginRight: '1rem' }}
              type="primary"
            >
              添加到分期
            </Button>
            <Button disabled={!selectedRowKeys.length} onClick={() => this.relationToContract('1')}>
              添加到服务费
            </Button>
          </div>
        </div>
        <br />
      </Fragment>
    );
  };

  render() {
    const { dataList, relationToContractLoading } = this.props;
    const { selectedRowKeys } = this.state;
    const copyTableListParams = Object.assign({}, tableListParams);

    console.log('selectedRowKeys ->', selectedRowKeys);
    const QnListPagePropsToBeRelated: object = {
      dataSource: dataList,
      columns: genTableColumns(copyTableListParams),
      title: '',
      rowSelection: {
        selectedRowKeys,
        onChange: (selectedRowKeys = [], selectedRows = []) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.setState({
            selectedRowKeys,
          });
        },
      },
      col: 2,
      total: dataList.length,
      hasPagination: false,
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
