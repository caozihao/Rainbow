import { Effect } from 'dva';
import { Reducer } from 'redux';
import { requestApi } from '../utils/request';

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
    createWriteOff: Effect;
    deleteByWriteOffId: Effect;
    exportByContractId: Effect;
    queryCommissionByContractId: Effect;
    querySettlementByContractId: Effect;
    queryWriteOffRecord: Effect;
    relationToContract: Effect;
    unRelationToContract: Effect;
    syncByCustomId: Effect;
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
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *deleteByWriteOffId({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *exportByContractId({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *queryCommissionByContractId({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!code) {
        yield put({
          type: 'save',
          payload: {
            dataList: body,
          },
        });
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *querySettlementByContractId({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!code) {
        yield put({
          type: 'save',
          payload: {
            dataList: body,
          },
        });
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *queryWriteOffRecord({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!code) {
        yield put({
          type: 'save',
          payload: {
            writeOffRecordDataList: body,
          },
        });
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *relationToContract({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *unRelationToContract({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!code) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *syncByCustomId({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
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
