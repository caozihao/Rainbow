# RICHO 报表管理系统

### 安装环境

- 先安装 node，去官网下载 https://nodejs.org/en/
- 再安装 yarn
  ```
    npm install yarn -g
  ```
- 更换国内源

  ```
    yarn config set registry https://registry.npm.taobao.org/
    yarn config set puppeteer_download_host https://npm.taobao.org/mirrors
  ```

### 构建项目

```
yarn
yarn run build  // 过程可能会很慢，请耐心等待
```

执行该命令会将代码编译，放到/dist 目录下，将/dist 目录下的所有代码拷贝到服务器对应的地址即可

### 技术说明

项目使用 antd-pro + umi + typescript
