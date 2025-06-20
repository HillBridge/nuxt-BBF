<template>
  <div class="error-illustration auth-error">
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="#f5f5f5" stroke="#52c41a" stroke-width="2" />
      <path d="M45 45C45 40 49 35 55 35C61 35 65 40 65 45C65 50 61 55 55 55C49 55 45 50 45 45Z" fill="#52c41a" />
      <path d="M35 75C35 65 45 60 55 60C65 60 75 65 75 75" stroke="#52c41a" stroke-width="2" stroke-linecap="round" />
      <text x="60" y="85" text-anchor="middle" fill="#666" font-size="12">认证错误</text>
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
