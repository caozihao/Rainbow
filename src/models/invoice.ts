import { Effect } from 'dva';
import { Reducer } from 'redux';
import { requestApi } from '../utils/request';
import { message } from 'antd';

export const namespace = 'invoice';
export interface InvoiceModelState {
  dataList: Array<any>;
  toBeRelatedDataList: Array<any>;
  beRelatedDataList: Array<any>;
  invoiceRecordDataList: Array<any>;
}

const initailState = {
  dataList: [],
  invoiceRecordDataList: [],
  toBeRelatedDataList: [],
  beRelatedDataList: [],
};

export interface InvoiceModelType {
  namespace: string;
  state: InvoiceModelState;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    save: Reducer<InvoiceModelState>;
  };
}

const InvoiceModel: InvoiceModelType = {
  namespace,
  state: initailState,
  effects: {
    *queryInvoice({ payload, successCallback, failCallback }, { call, put }) {
      const data = yield call(requestApi, { ...payload, namespace });
      const { code, errMsg, body } = data;

      if (!parseInt(code)) {
        let beRelatedDataList = body.filter(v => !!v.contractId);
        let toBeRelatedDataList = body.filter(v => !v.contractId);
        yield put({
          type: 'save',
          payload: {
            dataList: body,
            beRelatedDataList,
            toBeRelatedDataList,
          },
        });
        successCallback && successCallback();
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
        message.error(errMsg);
        failCallback && failCallback(errMsg);
      }
    },
    *syncByCustomId({ payload, successCallback, failCallback }, { call, put }) {
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

export default InvoiceModel;
