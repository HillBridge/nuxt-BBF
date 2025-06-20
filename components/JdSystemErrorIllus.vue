<template>
  <div class="error-illustration system-error">
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="#f5f5f5" stroke="#e4393c" stroke-width="2" />
      <path d="M45 45L75 75M75 45L45 75" stroke="#e4393c" stroke-width="3" stroke-linecap="round" />
      <text x="60" y="85" text-anchor="middle" fill="#666" font-size="12">系统错误</text>
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
