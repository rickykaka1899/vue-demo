module.exports = {
  version: '1.0',
  development: {
    javaApi: 'http://localhost:7777', //开发环境java接口地址
  },
  test: {
    phpApi: 'https://xxx.xxxx.com', //测试环境php接口地址
    javaApi: 'https://xxx.xxxx.com', //测试环境java接口地址
  },
  prevProduction: {
    phpApi: 'https://xxx.xxxx.com', //预发布环境php接口地址
    javaApi: 'https://xxx.xxxx.com', //预发布环境java接口地址
  },
  production: {
    phpApi: 'https://xxx.xxxx.com', //生产环境php后端接口域名
    javaApi: 'https://xxx.xxxx.com', //生产环境java接口地址
  }
}
