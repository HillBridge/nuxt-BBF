<template>
  <div class="error-illustration network-error">
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="#f5f5f5" stroke="#ff9500" stroke-width="2" />
      <path d="M30 60L90 60M60 30L60 90" stroke="#ff9500" stroke-width="2" stroke-dasharray="5,5" />
      <text x="60" y="85" text-anchor="middle" fill="#666" font-size="12">网络错误</text>
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
