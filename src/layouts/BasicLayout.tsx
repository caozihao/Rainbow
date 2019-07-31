/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import React, { PureComponent, useEffect, Fragment } from 'react';
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState, Dispatch } from '@/models/connect';
import { isAntDesignPro } from '@/utils/utils';
import logo from '../assets/logo.png';
import styles from './BasicLayout.less';
import router from 'umi/router';
import Title from 'antd/lib/typography/Title';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
  dispatch: Dispatch;
  history: any;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const footerRender: BasicLayoutProps['footerRender'] = (_, defaultDom) => {
  if (!isAntDesignPro()) {
    return defaultDom;
  }
  return (
    <>
      {defaultDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

class BasicLayout extends PureComponent<BasicLayoutProps> {
  componentDidMount() {
    const { history } = this.props;
    // console.log('BasicLayout this.props->', this.props);
    // console.log('BasicLayout history->', history);

    history.listen(({ search }: any) => {
      const { action, goBack } = history;
      if (action === 'POP' && !search) {
        // 如下路由："writeoff/list?currentPage=1&pageSize=10"，url上带参数的路由在浏览器回退的时候，路由会变成 "writeoff/list"，并不是我们想得到的路由，需要再往前回退一页，所以goBack(-2)
        goBack(-2);
      }
    });
  }

  /**
   * constructor
   */

  useEffect = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/getSetting',
      });
    }
  };

  /**
   * init variables
   */
  handleMenuCollapse = (payload: boolean): void => {
    const { dispatch } = this.props;
    dispatch &&
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
  };

  render() {
    const { children, settings } = this.props;
    console.log('settings ->', settings);
    return (
      <Fragment>
        <span className={styles.version}>报表管理系统 v0.1</span>
        <ProLayout
          {...settings}
          className={styles.BasicLayout}
          logo={<img src={logo} style={{ height: 50 }} />}
          navTheme="light"
          onCollapse={this.handleMenuCollapse}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl) {
              return defaultDom;
            }
            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          breadcrumbRender={(routers = []) => [
            {
              path: '/',
              breadcrumbName: formatMessage({
                id: 'menu.home',
                defaultMessage: 'Home',
              }),
            },
            ...routers,
          ]}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          // headerRender={data => {
          //   console.log('data ->', data);
          //   return "123";
          // }}
          footerRender={footerRender}
          menuDataRender={menuDataRender}
          formatMessage={formatMessage}
          rightContentRender={rightProps => <RightContent {...rightProps} />}
          {...this.props}
          title=""
        >
          {children}
        </ProLayout>
      </Fragment>
    );
  }
}

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
