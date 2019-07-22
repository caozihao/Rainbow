import { Effect } from 'dva';
import { Reducer } from 'redux';
import { requestApi } from '../utils/request';

export const namespace = 'writeOff';

export interface WriteOffModelState {
  // tableDataList: object;
  // tableDataPageTotal: number;
  // tableDataPageNo: number;
  // tableDataPageSize: number;
}

const initailState = {
  // tableDataList: [],
  // tableDataPageTotal: 0,
  // tableDataPageNo: 0,
  // tableDataPageSize: 0,
};

export interface WriteOffModelType {
  namespace: string;
  state: WriteOffModelState;
  effects: {
    deleteByWriteOffId: Effect;
    deleteCommissionByWriteOffId: Effect;
    exportByContractId: Effect;
    exportCommissionByContractId: Effect;
    queryByContractId: Effect;
    queryCommissionByContractId: Effect;
    update: Effect;
    updateCommission: Effect;
  };
  reducers: {
    save: Reducer;
  };
}

const WriteOffModel: WriteOffModelType = {
  namespace,
  state: initailState,
  effects: {
    *deleteByWriteOffId({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *deleteCommissionByWriteOffId({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *exportByContractId({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *exportCommissionByContractId({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *queryByContractId({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *queryCommissionByContractId({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *update({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *updateCommission({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
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

export default WriteOffModel;
