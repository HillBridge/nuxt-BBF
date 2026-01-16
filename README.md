## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## mark up

```bash
1. backend文件夹下模拟真实后台提供的接口 express书写, token通过jwt生成, 最主要是下发到BFF层通过的是http接口, 而不是cookie-session的方式
---> cookie-session的方式可能存在的问题:
   1>如果有跨端的项目, 除了浏览器也为app或者小程序提供接口的时候, token是无法在app或小程序之间使用cookie-session方式的, 因为不是浏览器
   2>针对于服务器集群或者分布式部署的这种情况, cookie-session的兼容方案的难度会大大增加
   3>服务端的压力要比纯纯http下发token的方式要大
--->解决方案
   直接以http的方式下发token,另外可以在客户端和服务端之间加一层BFF, 一方面做真实后端的风控, 二可以以cookie方式下发, 三是可以在中间做数据转换
2. nuxt server文件夹是在客户端和真实服务端中间加的一层, 主要用途是token的转发, 通过cookie特性进行维护, 也可以做数据的转换以及风控
3. nuxt服务端架构加载流程
  middleware中间件(每次都加载)-->plugins(浏览器刷新加载)-->page(调接口)--->useApiFetch(封装useFetch,并将code非200的业务错误统一返回)--->server(BFF层调真实后端接口并返回)-->page api callback(拿到请求回调,业务错误统一弹出框展示)
  *** 所有的客户端接口都过一遍server(BFF层), 获取真实后端的token, 由BFF层将token以cookie的方式下发给客户端, 这样客户端在后续的http请求中浏览器会自动将cookie里的token放在请求头中, BFF层解析cookie中的token并转发给真实后端, BFF层下发的token可以加密加盐处理, cookie的设置也要更安全.
  如: httpOnly: true防止XSS攻击, secure: true为必须https请求,sameSite: lax方式为CSRF跨站请求伪造
  细节: 可以在设置token过期时间时, 在cookie里多赛一个is_logged_in属性, 用来BFF层每次接受到客户端请求时验证token是否存在, 不存在直接跳转登录页面以及不向真实后端发送任何请求, 可在server里的middleware中添加全局api的中间件拦截
4. BFF层监听cookie中is_logged_in是否存在, 不存在要在BFF层将http状态设置为401, 这样客户端请求api的钩子函数中onResponse可以监听到401后可以重定向到登录页面, 必须有, 非常重要.(接口层面监听401)
5. middleware中的auth.global.ts中间件也有对401的监听情况, 与第四点监听的点完全不一样, 第四点监听是接口层面, 而这里监听的是浏览器页面刷新层面, 两者都要考虑, 才能给用户在任何一种情况下都有良好的用户体验.(页面刷新加载层面401)
6. 业务错误处理(http接口层面)
   1>在封装的useFetch里统一拦截status为200但code为非200的接口请求, 向外抛出错误, 会被useFetch拦截并且塞进error中
   2>在页面中调用useFetch,监听error, 当报错时以弹出框的方式将错误展示给用户
7. 全局的错误处理(系统错误,404路径错误,其他错误)
   1>在根目录下增加error.vue文件, nuxt在报错时会将错误注入到error中,并自动展示这个文件内容
   2>404, 访问路径不存在时, statusCode为404时展示对应的友好提示和操作
   3>系统错误, statusCode为500时展示对应的友好提示和操作
8. 边缘case断网情况
   1>封装NetworkOfflineNotification组件并且在app.vue中初始化
   2>useNetworkStatus中在注册时会自动监听online和offline的事件,根据状态实时展示对应的信息提示框
```
