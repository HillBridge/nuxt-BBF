<template>
  <div class="test-error-page">
    <h1>错误捕获测试页面</h1>

    <JdErrorBoundary :context="{ component: 'TestErrorPage' }">
      <div class="test-section">
        <h2>测试异步错误捕获</h2>
        <JdButton @click="testAsyncError" type="primary">
          触发异步错误
        </JdButton>
        <JdButton @click="testNetworkError" type="default">
          触发网络错误
        </JdButton>
        <JdButton @click="testBusinessError" type="default">
          触发业务错误
        </JdButton>
      </div>

      <div class="test-section">
        <h2>测试组件渲染错误</h2>
        <JdButton @click="showRenderError = true" type="primary">
          显示渲染错误
        </JdButton>

        <div v-if="showRenderError">
          <!-- 这里会触发渲染错误 -->
          <div>{{ (errorTrigger as any).someProperty }}</div>
        </div>
      </div>
    </JdErrorBoundary>
  </div>
</template>

<script lang="ts" setup>
import { throwJdError } from '~/utils/error';

const showRenderError = ref(false);

// 创建一个会导致运行时错误的变量
const errorTrigger = ref(null);

const testAsyncError = async () => {
  // 模拟异步操作中的错误
  setTimeout(() => {
    throwJdError({
      type: 'SYSTEM',
      code: 'TEST_ASYNC_ERROR',
      message: '测试异步错误',
      userImpact: '这是一个测试异步错误',
      recoveryActions: ['retry', 'home'],
      metadata: { test: true }
    });
  }, 100);
};

const testNetworkError = async () => {
  throwJdError({
    type: 'NETWORK',
    code: 'NETWORK_TIMEOUT',
    message: '网络连接超时',
    userImpact: '请检查网络连接后重试',
    recoveryActions: ['retry', 'contact'],
    metadata: { endpoint: '/api/test' }
  });
};

const testBusinessError = async () => {
  throwJdError({
    type: 'BUSINESS',
    code: 'INSUFFICIENT_BALANCE',
    message: '余额不足',
    userImpact: '您的账户余额不足以完成此操作',
    recoveryActions: ['recharge', 'contact'],
    metadata: { required: 100, current: 50 }
  });
};
</script>

<style scoped>
.test-error-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.test-section h2 {
  margin-bottom: 15px;
  color: #333;
}

.test-section .jd-button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
