<template>
  <button :class="buttonClasses" :type="htmlType" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script lang="ts" setup>
interface Props {
  type?: 'primary' | 'default' | 'text';
  htmlType?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  htmlType: 'button'
});

defineEmits(['click']);

const buttonClasses = computed(() => {
  return {
    'jd-button': true,
    [`jd-button--${props.type}`]: true
  };
});
</script>

<style scoped>
.jd-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.jd-button:hover {
  border-color: #e4393c;
  color: #e4393c;
}

.jd-button--primary {
  background: #e4393c;
  color: white;
  border-color: #e4393c;
}

.jd-button--primary:hover {
  background: #c81623;
  border-color: #c81623;
}

.jd-button--text {
  border: none;
  background: transparent;
  color: #666;
}

.jd-button--text:hover {
  color: #e4393c;
}
</style>
