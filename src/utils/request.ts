/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import api from '../serviceApi';
import { getPageQuery } from '@/utils/utils';

/**
 * 通用请求Api方法
 * @param apiName(String)：调用的api名称
 * @param reqType(String)：请求的类型：GET | POST | PUT | DELETE
 * @param placeholerData(Object)：放在占位符上的数据
 * @param queryData(Object)：放在url上的数据
 * @param bodyData(Object)：放在body里的数据
 */

interface IReq {
  method: string;
  params?: object;
  data?: string;
}

interface IRequestApiParams {
  apiName: string;
  reqType: string;
  placeholerData?: object;
  queryData?: object;
  bodyData?: object;
  namespace: string;
}

export function requestApi({
  apiName,
  reqType,
  placeholerData,
  queryData,
  bodyData,
  namespace,
}: IRequestApiParams) {
  // const method = reqType.toLowerCase();
  let url = api[namespace][apiName];
  const req: IReq = { method: reqType };

  let params = [];
  if (placeholerData) {
    params = Object.keys(placeholerData);
    for (let i = 0; i < params.length; i += 1) {
      url = url.replace(`:${params[i]}`, placeholerData[params[i]]);
    }
  }

  if (queryData && Object.keys(queryData).length) {
    // url = `${url}?${stringify(queryData)}`;
    req.params = queryData;
  }

  if (bodyData) {
    req.data = JSON.stringify(bodyData);
  }
  console.log('url ->', url);
  return request(url, req);
}

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  console.log('response ->', response);
  if (response && response.status) {
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});

request.interceptors.response.use(response => {
  // console.log(response);
  const disposition = response.headers && response.headers.get('content-disposition');
  if (disposition) {
    // const fileName = disposition.split('=')[1];
    const { tabType = 'HwDetail', contractType } = getPageQuery();
    let fileName = '统计数据';
    if (contractType === '0') {
      fileName = '硬件分期';
    } else if (contractType === '1') {
      fileName = '服务费';
    } else if (tabType === 'HwDetail') {
      fileName = '硬件明细';
    } else if (tabType === 'serviceDetail') {
      fileName = '服务明细';
    } else if (tabType === 'HwSummary') {
      fileName = '硬件汇总';
    } else if (tabType === 'serviceSummary') {
      fileName = '服务汇总';
    } else if (tabType === 'HwAndServiceSummary') {
      fileName = '硬件+服务汇总';
    }

    response
      .clone()
      .blob()
      .then(blob => {
        // const filename = `test.xlsx`;
        const eleLink = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        eleLink.href = url;
        eleLink.download = decodeURIComponent(fileName);
        eleLink.click();
        window.URL.revokeObjectURL(url);
      });
  }
  return response;
});

export default request;
