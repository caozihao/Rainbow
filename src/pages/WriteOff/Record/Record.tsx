import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import {} from 'antd';
import withRouter from 'umi/withRouter';
// import { RecordModelState, namespace } from '../../../../models/Record';
//import styles from './Record.less';

interface IConnectState extends ConnectState {
  //  [namespace]: RecordModelState;
}

interface IProps extends ConnectProps {
  dispatch: Dispatch;
}

interface IState {}

@connect(({  }: IConnectState) => ({}))
class Record extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate() {}

  // handleClick = (e: Object): void => {};

  render() {
    return <div /* className={styles.Record} */>内容</div>;
  }
}

export default withRouter(Record as React.ComponentClass<any>);
