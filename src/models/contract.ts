import { Effect } from 'dva';
import { Reducer } from 'redux';
import { requestApi } from '../utils/request';

export const namespace = 'contract';
export interface ContractModelState {
  tableDataList: object;
  tableDataPageTotal: number;
  tableDataPageNo: number;
  tableDataPageSize: number;
}

const initailState = {
  tableDataList: [],
  tableDataPageTotal: 0,
  tableDataPageNo: 0,
  tableDataPageSize: 0,
};

export interface ContractModelType {
  namespace: string;
  state: ContractModelState;
  effects: {
    create: Effect;
    getContractFileById: Effect;
    modify: Effect;
    queryList: Effect;
  };
  reducers: {
    save: Reducer;
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
            tableDataList: dataList,
            tableDataPageTotal: parseInt(totalSize, 10),
            tableDataPageNo: parseInt(currentPage, 10),
            tableDataPageSize: parseInt(pageSize, 10),
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
