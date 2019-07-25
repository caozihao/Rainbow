import { Effect } from 'dva';
import { Reducer } from 'redux';
import { requestApi } from '../utils/request';

export const namespace = 'contract';
export interface ContractModelState {
  dataList: Array<any>;
  dataPageTotal: number;
  dataPageNo: number;
  dataPageSize: number;
  detail: object;
}

const initailState = {
  dataList: [],
  dataPageTotal: 0,
  dataPageNo: 0,
  dataPageSize: 0,
  detail: {},
};

export interface ContractModelType {
  namespace: string;
  state: ContractModelState;
  effects: {
    create: Effect;
    getContractFileById: Effect;
    modify: Effect;
    queryList: Effect;
    queryById: Effect;
  };
  reducers: {
    save: Reducer<ContractModelState>;
  };
}

const ContractModel: ContractModelType = {
  namespace,
  state: initailState,
  effects: {
    *create({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *getContractFileById({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *modify({ payload, successCallback, failCallback }, { call, put }) {
      const { data } = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *queryList({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      console.log('queryList data ->', data);
      const { code, errMsg, body } = data;
      if (!code) {
        const { totalSize, currentPage, pageSize, dataList } = body;
        yield put({
          type: 'save',
          payload: {
            dataList: dataList,
            dataPageTotal: parseInt(totalSize, 10),
            dataPageNo: parseInt(currentPage, 10),
            dataPageSize: parseInt(pageSize, 10),
          },
        });
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *queryById({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!code) {
        yield put({
          type: 'save',
          payload: {
            detail: body,
          },
        });
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

export default ContractModel;
