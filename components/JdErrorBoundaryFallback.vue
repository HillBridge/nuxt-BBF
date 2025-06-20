<template>
  <div class="jd-error-fallback">
    <div class="error-content">
      <h3>{{ error.message }}</h3>
      <p v-if="error.userImpact">{{ error.userImpact }}</p>

      <div class="error-actions">
        <slot name="custom-actions">
          <JdButton @click="$emit('retry')" type="primary">
            重试
          </JdButton>
          <JdButton @click="goHome">
            返回首页
          </JdButton>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { JdError } from '~/types/error';

defineProps<{
  error: JdError;
}>();

defineEmits(['retry']);

const goHome = () => {
  navigateTo('/');
};
</script>

<style scoped>
.jd-error-fallback {
  padding: 20px;
  text-align: center;
}

.error-content h3 {
  color: #e4393c;
  margin-bottom: 10px;
}

.error-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
