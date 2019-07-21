import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import { Card } from 'antd';
import withRouter from 'umi/withRouter';
import styles from './Contract.less';
import { QnListPage } from '../../utils/Qneen/index';
import tableListParams from './tableListParams';
import { genTableColumns } from '../../utils/format/dataGen';
import tableFilterParams from './tableFilterParams';
import testDataSource from '../../../mock/testData/Contract';

interface IConnectState extends ConnectState {
  login: {
    [profile: string]: object;
  };
}

interface IProps extends ConnectProps {
  dispatch: Dispatch;
}

interface IState {}

@connect(({ login }: IConnectState) => ({
  profile: login.profile,
}))
class Contract extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate() {}

  // handleClick = (e: Object): void => {};

  render() {
    console.log('testDataSource ->', testDataSource);
    const QnListPageProps: object = {
      dataSource: testDataSource,
      columns: genTableColumns(tableListParams),
      title: '合同',
      handleRowSelect: (selectedRowKeys: [], selectedRows: []) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      filterRules: tableFilterParams,
      col: 2,
      handlePageChange: () => {},
      total: testDataSource.length,
    };
    return (
      <Card className={styles.Contract} title="合同管理">
        <QnListPage {...QnListPageProps} />
      </Card>
    );
  }
}

export default withRouter(Contract as any);
