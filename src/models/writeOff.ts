import { Effect } from 'dva';
import { Reducer } from 'redux';
import { requestApi } from '../utils/request';
import { message } from 'antd';

export const namespace = 'writeOff';

export interface WriteOffModelState {
  dataList: Array<any>;
  writeOffRecordDataList: Array<any>;
  // dataPageTotal: number;
  // dataPageNo: number;
  // dataPageSize: number;
}

const initailState = {
  dataList: [],
  writeOffRecordDataList: [],
  // dataPageTotal: 0,
  // dataPageNo: 0,
  // dataPageSize: 0,
};

export interface WriteOffModelType {
  namespace: string;
  state: WriteOffModelState;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    save: Reducer<WriteOffModelState>;
  };
}

const WriteOffModel: WriteOffModelType = {
  namespace,
  state: initailState,
  effects: {
    *createWriteOff({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!parseInt(code)) {
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *deleteByWriteOffId({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!parseInt(code)) {
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *exportByContractId({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!parseInt(code)) {
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *queryCommissionByContractId({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const {
        code,
        errMsg,
        body: { dataList, actionPlan },
      } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            dataList,
            actionPlan,
          },
        });
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *querySettlementByContractId({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const {
        code,
        errMsg,
        body: { dataList, actionPlan },
      } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            dataList,
            actionPlan,
          },
        });
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *queryWriteOffRecord({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            writeOffRecordDataList: body,
          },
        });
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *relationToContract({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!parseInt(code)) {
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *unRelationToContract({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!parseInt(code)) {
        successCallback && successCallback();
      } else {
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *syncByCustomId({ payload, successCallback, failCallback }, { call, put }) {
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

export default WriteOffModel;
