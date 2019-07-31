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

### clone项目到本地

```
git clone https://github.com/caozihao/Rainbow.git
```

### 构建项目

定位到项目下面
```
yarn // 安装依赖包
yarn start //本地开发
yarn run build  // 编译代码，过程可能会有些慢，请耐心等待
```

**执行 yarn run build  命令会将代码编译，放到/dist 目录下，将/dist 目录下的所有代码拷贝到服务器根目录即可**

### 技术说明

项目使用 antd-pro + umi + typescript
