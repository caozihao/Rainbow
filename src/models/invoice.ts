import { Effect } from 'dva';
import { Reducer } from 'redux';
import { requestApi } from '../utils/request';

export const namespace = 'invoice';
export interface InvoiceModelState {
  dataList: Array<any>;
}

const initailState = {
  dataList: [],
};

export interface InvoiceModelType {
  namespace: string;
  state: InvoiceModelState;
  effects: {
    relationToContract: Effect;
    syncByCustomId: Effect;
    queryByCustomIdAndEffactTime: Effect;
  };
  reducers: {
    save: Reducer<InvoiceModelState>;
  };
}

const InvoiceModel: InvoiceModelType = {
  namespace,
  state: initailState,
  effects: {
    *queryByCustomIdAndEffactTime({ payload, successCallback, failCallback }, { call, put }) {
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
    *relationToContract({ payload, successCallback, failCallback }, { call, put }) {
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
      console.log('queryList data ->', data);
      const { code, errMsg, body } = data;
      if (!code) {
        const { totalSize, currentPage, pageSize, dataList } = body;
        // yield put({
        //   type: 'save',
        //   payload: {
        //     dataList: dataList,
        //     dataPageTotal: parseInt(totalSize, 10),
        //     dataPageNo: parseInt(currentPage, 10),
        //     dataPageSize: parseInt(pageSize, 10),
        //   },
        // });
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
