import { Effect } from 'dva';
import { Reducer } from 'redux';
import { requestApi } from '../utils/request';
import { message } from 'antd';

export const namespace = 'receivable';

export interface ReceivableModelState {
  dataList: Array<any>;
  dataPageTotal: number;
  dataPageNo: number;
  dataPageSize: number;
}

const initailState = {
  dataList: [],
  dataPageTotal: 0,
  dataPageNo: 0,
  dataPageSize: 0,
};

export interface ReceivableModelType {
  namespace: string;
  state: ReceivableModelState;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    save: Reducer<ReceivableModelState>;
  };
}

const ReceivableModel: ReceivableModelType = {
  namespace,
  state: initailState,
  effects: {
    *queryCustomService({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            dataList: body,
          },
        });
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *queryCustomHw({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            dataList: body,
          },
        });
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *queryHwDetail({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            dataList: body,
          },
        });
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *queryHwSummary({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            dataList: body,
          },
        });
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *queryServiceDetail({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            dataList: body,
          },
        });
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *queryReceivableRecord({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            dataList: body,
          },
        });
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *queryServiceSummary({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            dataList: body,
          },
        });
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *updateCustomService({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!parseInt(code)) {
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *updateCustomHw({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
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

export default ReceivableModel;
