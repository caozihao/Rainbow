import { Effect } from 'dva';
import { Reducer } from 'redux';
import { requestApi } from '../utils/request';
import { message } from 'antd';

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
    [key: string]: Effect;
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
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!parseInt(code, 10)) {
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *getContractFileById({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!parseInt(code)) {
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *modify({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!parseInt(code)) {
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *queryList({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });

      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
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
        successCallback && successCallback(dataList);
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *queryById({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            detail: body,
          },
        });
        successCallback && successCallback(body);
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *batchDelete({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
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

export default ContractModel;
