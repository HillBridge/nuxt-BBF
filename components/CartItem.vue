<template>
  <div class="cart-item">
    <div class="item-info">
      <h4>{{ item.name || '商品名称' }}</h4>
      <p>{{ item.price || '¥0.00' }}</p>
    </div>
    <div class="item-actions">
      <button @click="updateQuantity(-1)">-</button>
      <span>{{ item.quantity || 1 }}</span>
      <button @click="updateQuantity(1)">+</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface CartItem {
  id: string;
  name?: string;
  price?: string;
  quantity?: number;
  [key: string]: any;
}

const props = defineProps<{
  item: CartItem;
}>();

const emit = defineEmits(['quantity-change']);

const updateQuantity = (delta: number) => {
  const newQuantity = (props.item.quantity || 1) + delta;
  if (newQuantity > 0) {
    emit('quantity-change', props.item.id, newQuantity);
  }
};
</script>

<style scoped>
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #eee;
  margin-bottom: 10px;
  border-radius: 4px;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-actions button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.item-actions button:hover {
  background: #f5f5f5;
}
</style>
