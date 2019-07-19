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
            component: './Contract/Contract',
            icon: 'folder',
          },
          {
            path: '/contract/detail',
            name: 'detail',
            component: './Contract/Detail',
            // hideInMenu: true,
          },
        ],
      },

      {
        path: '/verification',
        name: 'verification',
        // authority: ['admin', 'user'],
        component: './Verification/Verification',
        icon: 'folder',
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
