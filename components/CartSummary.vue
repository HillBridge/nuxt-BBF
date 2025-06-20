<template>
  <div class="cart-summary">
    <div class="summary-info">
      <h3>购物车</h3>
      <p>共 {{ itemCount }} 件商品</p>
      <p class="total-price">总计: ¥{{ totalPrice }}</p>
    </div>
    <div class="summary-actions">
      <JdButton @click="$emit('checkout')" type="primary">
        去结算
      </JdButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['checkout']);

// 临时数据
const itemCount = ref(0);
const totalPrice = ref('0.00');
</script>

<style scoped>
.cart-summary {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-top: 20px;
}

.summary-info h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  color: #e4393c;
  margin: 10px 0;
}

.summary-actions {
  margin-top: 15px;
}
</style>
