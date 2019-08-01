interface IConfig {
  MOCK_API: string;
  HOST_API: string;
  DEV_MODE: 'mock' | 'dev'; //mock 使用mock数据；dev 使用测试数据
}

const config: IConfig = {
  MOCK_API: '/mock/rcs',
  HOST_API: 'http://47.244.9.156:10023/rcs',
  DEV_MODE: 'dev',
};

export default config;
