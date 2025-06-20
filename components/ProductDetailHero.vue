<template>
  <div class="product-detail-hero">
    <h1>{{ product?.name || '商品详情' }}</h1>
    <p>{{ product?.description || '商品描述' }}</p>
  </div>
</template>

<script lang="ts" setup>
interface Product {
  name?: string;
  description?: string;
  [key: string]: any;
}

defineProps<{
  product?: Product;
}>();
</script>

<style scoped>
.product-detail-hero {
  padding: 20px;
  border: 1px solid #eee;
  margin-bottom: 20px;
}
</style>
