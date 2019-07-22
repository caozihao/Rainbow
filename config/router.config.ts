const router: object = [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/contract' },
      {
        path: '/contract',
        name: 'contract',
        // authority: ['admin', 'user'],
        // component: './Contract/Contract',
        icon: 'folder',
        hideChildrenInMenu: true,
        routes: [
          { path: '/contract', redirect: '/contract/list' },
          {
            path: '/contract/list',
            name: 'list',
            component: './Contract/List/Contract',
          },
          // {
          //   path: '/contract/detail',
          //   name: 'detail',
          //   component: './Contract/Detail',
          //   // hideInMenu: true,
          // },
        ],
      },
      {
        path: '/writeoff',
        name: 'writeoff',
        // authority: ['admin', 'user'],
        // component: './Contract/Contract',
        icon: 'line-chart',
        hideChildrenInMenu: true,
        routes: [
          { path: '/writeoff', redirect: '/writeoff/list' },
          {
            path: '/writeoff/list',
            name: 'list',
            component: './WriteOff/List/WriteOff',
          },
          {
            // 添加 /writeoff/record?type=add
            // 编辑 /writeoff/record?type=detail&&id=1
            path: '/writeoff/record',
            name: 'record',
            component: './WriteOff/Record/Record',
          },
          {
            path: '/writeoff/invoice',
            name: 'invoice',
            component: './WriteOff/Invoice/Invoice',
          },
        ],
      },
      {
        path: '/receivable',
        name: 'receivable',
        // authority: ['admin', 'user'],
        component: './Receivable/Receivable',
        icon: 'pay-circle',
      },
      {
        path: '/setting',
        name: 'setting',
        // authority: ['admin', 'user'],
        component: './setting/Setting',
        icon: 'setting',
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];

export default router;
