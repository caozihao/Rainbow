import { Effect } from 'dva';
import { Reducer } from 'redux';
import { requestApi } from '../utils/request';
import { message } from 'antd';

export const namespace = 'account';
export interface AccountModelState {
  accountList: Array<any>;
}

const initailState = {
  accountList: [],
};

export interface AccountModelType {
  namespace: string;
  state: AccountModelState;
  effects: {
    queryByName: Effect;
  };
  reducers: {
    save: Reducer<AccountModelState>;
  };
}

const AccountModel: AccountModelType = {
  namespace,
  state: initailState,
  effects: {
    *queryByName({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            accountList: body,
          },
        });
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
  },
  reducers: {
    save(state: any, { payload = {} }) {
      return { ...state, ...payload };
    },
  },
};

export default AccountModel;
