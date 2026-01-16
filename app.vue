<template>
  <NuxtErrorBoundary @error="handleError">
    <NuxtPage />
    <template #error="{ error }">
      <div class="error-container">
        <h1>Something went wrong!</h1>
        <pre>{{ error.message }}</pre>
        <p v-if="error.statusCode === 404">
          <NuxtLink to="/">Go to home</NuxtLink>
        </p>
        <p v-if="error.statusCode === 401">
          <NuxtLink to="/login">Go to login</NuxtLink>
        </p>
        <p v-if="error.statusCode === 500">
          <NuxtLink to="/">Go to home</NuxtLink>
        </p>
        <p v-if="isNetworkError(error)">
          <NuxtLink to="/">Go to home</NuxtLink>
        </p>
        <p v-else>
          <NuxtLink to="/">Go to home</NuxtLink>
        </p>
      </div>
    </template>
  </NuxtErrorBoundary>
  <!-- 全局消息弹出框 -->
  <JdMessageBox :type="messageBoxState.type" :title="messageBoxState.title" :message="messageBoxState.message"
    :visible="messageBoxState.visible" :close-on-click-overlay="messageBoxState.closeOnClickOverlay"
    @update:visible="handleMessageBoxVisibleChange" @close="handleMessageBoxClose" />

  <!-- 断网通知组件 -->
  <NetworkOfflineNotification />
</template>

<script setup>
// 组件级别错误处理(关键性组件, 如登录页面, 注册页面, 首页等)

// 一、对错误进行分类处理(前端错误处理)
// 1. 404 错误
// 2. 401 错误
// 3. 500 错误
// 4. 网络错误
// 5. 其他错误
// 二、根据错误分类, 给用户展示对应的ui提示组件以及后续可操作指示(用户体验)
// 1. 404 错误: 跳转到404页面
// 2. 401 错误: 跳转到登录页面
// 3. 500 错误: 跳转到500页面
// 4. 网络错误: 跳转到网络错误页面
// 5. 其他错误: 跳转到其他错误页面

// 三、上报错误, 调后台接口(开发人员根据错误信息, 进行bug修复)
// 上报信息: 出错的页面, 时间, 具体的用户操作, 涉及请求接口的参数, 涉及请求接口的返回值, 涉及请求接口的错误信息等

const handleError = (error) => {
  console.error("Global error:", error);
};

// 消息弹出框管理
const { state: messageBoxState, handleClose } = useMessageBox();

const handleMessageBoxVisibleChange = (visible) => {
  if (!visible) {
    handleClose();
  }
};

const handleMessageBoxClose = () => {
  handleClose();
};
</script>
