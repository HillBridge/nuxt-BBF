<template>
  <div class="error-illustration not-found-error">
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 背景圆圈 -->
      <circle cx="100" cy="100" r="80" fill="#f5f5f5" stroke="#e4393c" stroke-width="2" />

      <!-- 404文字 -->
      <text x="100" y="95" text-anchor="middle" fill="#e4393c" font-size="48" font-weight="bold">404</text>

      <!-- 装饰线条 -->
      <path d="M40 100L160 100" stroke="#e4393c" stroke-width="2" stroke-dasharray="5,5" opacity="0.5" />

      <!-- 底部提示文字 -->
      <text x="100" y="140" text-anchor="middle" fill="#666" font-size="14">页面未找到</text>
    </svg>
  </div>
</template>

<style scoped>
.error-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}
</style>
