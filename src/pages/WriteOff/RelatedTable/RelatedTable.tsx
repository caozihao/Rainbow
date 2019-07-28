import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectProps, ConnectState } from '@/models/connect';
import {} from 'antd';
import withRouter from 'umi/withRouter';
import BeRelated from './BeRelated/BeRelated';
import ToBeRelated from './ToBeRelated/ToBeRelated';
import { ContractModelState } from '@/models/contract';
import { getPageQuery } from '@/utils/utils';
import { IQueryParams, IContractDetail } from '../writeoff';

interface IConnectState extends ConnectState {
  contract: ContractModelState;
}

interface IProps extends ConnectProps {
  dispatch: Dispatch;
  contractDetail: IContractDetail;
  writeOffType: number;
  settlementId: string;
}

interface IState {}

@connect(({ contract }: IConnectState) => {
  const { detail } = contract;
  return {
    contractDetail: detail,
  };
})
class ReletedTable extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  queryParams: IQueryParams = getPageQuery();

  componentDidMount() {
    this.queryWriteOffRecord();
  }

  componentDidUpdate() {}

  queryWriteOffRecord = () => {
    const { dispatch, contractDetail, writeOffType, settlementId } = this.props;
    const { contractId, customId, effectDate } = contractDetail;
    dispatch({
      type: 'writeOff/queryWriteOffRecord',
      payload: {
        apiName: 'queryWriteOffRecord',
        reqType: 'POST',
        bodyData: {
          contractId,
          customId,
          effectDate,
          settlementId,
          writeOffType,
        },
      },
      successCallback: () => {},
    });
  };

  // handleClick = (e: Object): void => {};

  render() {
    const { writeOffType, settlementId } = this.props;
    const ToBeRelatedProps = {
      settlementId,
      writeOffType,
    };
    return (
      <div /* className={styles.ReletedTable} */>
        <ToBeRelated {...ToBeRelatedProps} />
        <BeRelated {...ToBeRelatedProps}/>
      </div>
    );
  }
}

export default withRouter(ReletedTable as React.ComponentClass<any>);
