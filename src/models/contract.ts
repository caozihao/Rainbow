import { Effect } from 'dva';
import { Reducer } from 'redux';
import { requestApi } from '../utils/request';

export interface ContractModelState {
  tableData: object;
}

export interface ContractModelType {
  namespace: 'contract';
  state: ContractModelState;
  effects: {
    create: Effect;
    getContractFileById: Effect;
    modify: Effect;
    queryList: Effect;
  };
  reducers: {};
}

const ContractModel: ContractModelType = {
  namespace: 'contract',

  state: {
    tableData: [],
  },

  effects: {
    *create({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, payload);
      const { code, message } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(message);
      }
    },
    *getContractFileById({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, payload);
      const { code, message } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(message);
      }
    },
    *modify({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, payload);
      const { code, message } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(message);
      }
    },
    *queryList({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, payload);
      const { code, message } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(message);
      }
    },
  },
  reducers: {},
};

export default ContractModel;
