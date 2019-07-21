interface IConfig {
  MOCK_API: string;
  HOST_API: string;
  DEV_MODE: 'mock' | 'dev'; //mock 使用mock数据；dev 使用测试数据
}

const config: IConfig = {
  MOCK_API: '/mock',
  HOST_API: '/rcs',
  DEV_MODE: 'mock',
};

export default config;
