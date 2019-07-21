interface IConfig {
  MOCK_API: string;
  HOST_API: string;
}

const config: IConfig = {
  MOCK_API: '/mock',
  HOST_API: '/rcs',
};

export default config;
