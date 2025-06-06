// file: nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  // 1. 模块配置
  modules: ["nuxt-security"],

  // 2. 运行时配置 (密钥管理)
  runtimeConfig: {
    // 这些密钥只在服务端可用
    // 真实项目中，这些值应该来自 .env 文件
    luciaAuthPassword: "a-very-strong-password-for-lucia-encryption",
    mockBackendUrl: "http://localhost:8080", // 真实后端的地址

    // public 下的变量会暴露给客户端
    public: {},
  },

  // 3. nuxt-security 高级配置
  security: {
    // 强制重定向到 HTTPS
    https: { redirect: true },

    // 启用 CSRF 防护 (对所有 POST/PUT/DELETE 请求生效)
    // nuxt-security 会自动处理 cookie 和 header 的验证
    csrf: true,

    // 配置安全头
    headers: {
      contentSecurityPolicy: {
        // 一个相对严格的CSP策略
        "base-uri": ["'self'"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'self'"],
        "img-src": ["'self'", "data:"],
        // 生产中目标是移除 'unsafe-inline'
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
      },
      crossOriginEmbedderPolicy: "require-corp",
    },
  },

  // 4. Nitro 配置 (用于开发时的代理，避免CORS问题)
  nitro: {
    // 这个代理只在服务端 fetch 时生效，对浏览器是透明的
    // 注意: 这个代理和BFF转发是两回事。这个是为了方便BFF调用后端。
    // 你也可以不配置这个，直接在BFF里用完整的URL。
    // routeRules: {
    //   "/api/**": {
    //     proxy: {
    //       to: `${
    //         process.env.NUXT_MOCK_BACKEND_URL || "http://localhost:8080"
    //       }/api/**`,
    //     },
    //   },
    // },
  },
});
