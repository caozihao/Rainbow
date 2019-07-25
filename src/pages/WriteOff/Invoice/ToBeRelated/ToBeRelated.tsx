import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Icon, Button, Spin, message } from 'antd';
import withRouter from 'umi/withRouter';
import { QnListPage } from '@/utils/Qneen/index';
import { InvoiceModelState } from '@/models/invoice';
import { genTableColumns } from '@/utils/format/dataGen';
import styles from './../Invoice.less';
import tableListParams from '../tableListParams';
import { getPageQuery } from '@/utils/utils';

interface IConnectState extends ConnectState {
  invoice: InvoiceModelState;
}

interface IProps extends ConnectProps, InvoiceModelState {
  dispatch: Dispatch;
  relationToContractLoading: Boolean;
}

interface IState {
  selectedRowKeys: Array<any>;
  defaultTabKey: string;
}

@connect(({ invoice, loading }: IConnectState) => {
  const { dataList } = invoice;
  return {
    relationToContractLoading: loading.effects['invoice/relationToContract'],
    dataList,
  };
})
class ToBeRelated extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      defaultTabKey: 'instalment',
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  relationToContract = (type: string) => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    const contractId = getPageQuery('contractId');
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

  genMiddleSectionToBeRelated = () => {
    const { selectedRowKeys } = this.state;
    return (
      <Fragment>
        <div className={styles.headLayout}>
          <h3>
            待关联的发票信息{' '}
            <a
              onClick={() => {
                alert('刷新');
              }}
              href="javascript:void(0)"
            >
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
