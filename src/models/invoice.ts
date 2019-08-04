import { Effect } from 'dva';
import { Reducer } from 'redux';
import { requestApi } from '../utils/request';

export const namespace = 'invoice';
export interface InvoiceModelState {
  dataList: Array<any>;
  invoiceRecordDataList: Array<any>;
}

const initailState = {
  dataList: [],
  invoiceRecordDataList: [],
};

export interface InvoiceModelType {
  namespace: string;
  state: InvoiceModelState;
  effects: {
    relationToContract: Effect;
    unRelationToContract: Effect;
    syncByCustomId: Effect;
    queryByCustomIdAndEffectTime: Effect;
    queryRelatedInvoice: Effect;
  };
  reducers: {
    save: Reducer<InvoiceModelState>;
  };
}

const InvoiceModel: InvoiceModelType = {
  namespace,
  state: initailState,
  effects: {
    *queryByCustomIdAndEffectTime({ payload, successCallback, failCallback }, { call, put }) {
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
        failCallback && failCallback(errMsg);
      }
    },
    *relationToContract({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!parseInt(code)) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *unRelationToContract({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg } = data;
      if (!parseInt(code)) {
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *queryRelatedInvoice({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
        yield put({
          type: 'save',
          payload: {
            invoiceRecordDataList: body,
          },
        });
        successCallback && successCallback();
      } else {
        failCallback && failCallback(errMsg);
      }
    },
    *syncByCustomId({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;
      if (!parseInt(code)) {
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

export default InvoiceModel;
