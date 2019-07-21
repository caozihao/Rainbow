/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import { parse } from 'qs';
import router from 'umi/router';
import moment from 'moment';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path: string): boolean {
  return reg.test(path);
}

export function isAntDesignPro(): boolean {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntDesignProOrDev(): boolean {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function initializeFilterParams(tableFilterParams: Array<any>) {
  const queryParam = getPageQuery();
  return tableFilterParams.map(v => {
    const { name, tag } = v;
    const value = queryParam[name];
    if (value) {
      v.initValue = value;
    } else if (tag === 'RangePicker') {
      let dateArr = name.split(',');
      const startDateValue = queryParam[dateArr[0]];
      const endDateValue = queryParam[dateArr[1]];
      if (startDateValue && endDateValue) {
        v.initValue = [moment(parseInt(startDateValue, 10)), moment(parseInt(endDateValue, 10))];
      }
    }
    return v;
  });
}

interface IQueryParams {
  pageSize?: number;
  currentPage?: number;
}

export function dealWithQueryParams(params: IQueryParams) {
  let copyParams = Object.assign({}, params);
  const { pageSize, currentPage } = copyParams;
  if (!pageSize) {
    copyParams.pageSize = 10;
  }
  if (!currentPage) {
    copyParams.currentPage = 1;
  }
  return copyParams;
}

export function updateRoute(params: object) {
  router.push({
    pathname: location ? location.pathname : '',
    query: { ...params },
  });
}
