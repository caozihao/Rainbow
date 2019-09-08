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
          // {
          //   // 查看 /writeoff/record?type=detail
          //   // 编辑 /writeoff/record?type=edit&&id=1
          //   path: '/writeoff/record',
          //   name: 'record',
          //   component: './WriteOff/Record/Record',
          // },
          // {
          //   path: '/writeoff/invoice',
          //   name: 'invoice',
          //   component: './WriteOff/Invoice/Invoice',
          // },
        ],
      },
      {
        path: '/receivable',
        name: 'receivable',
        // authority: ['admin', 'user'],
        // component: './Receivable/Receivable',
        icon: 'pay-circle',
        hideChildrenInMenu: true,
        routes: [
          { path: '/receivable', redirect: '/receivable/list?type=customer&&tabType=HwStage' },
          // type=customer  客户应收
          // tabType=HwStage  硬件分期
          // tabType=service  服务费

          // type=statistics  应收统计
          // tabType=HwDetail  硬件明细
          // tabType=HwSummary  硬件汇总
          // tabType=serviceDetail  服务明细
          // tabType=serviceSummary  服务汇总
          {
            path: '/receivable/list',
            name: 'list',
            component: './Receivable/List/Receivable',
          },
        ],
      },
      {
        path: '/setting',
        name: 'setting',
        // authority: ['admin', 'user'],
        component: './Setting/Setting',
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
