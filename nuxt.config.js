// file: nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  // 1. 模块配置
  // modules: ["nuxt-security"],

  // 2. 运行时配置 (密钥管理)
  runtimeConfig: {
    // 后端API地址
    backendUrl: process.env.BACKEND_URL,

    // Cookie安全配置
    authCookie: {
      name: "__Secure-auth",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },

    // public 下的变量会暴露给客户端
    public: {
      backendUrl: process.env.BACKEND_URL,
    },
  },

  ssr: true,

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
    preset: "node-server",
    headers: {
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  },
  routeRules: {
    "/profile": { hybrid: true },
  },
});
