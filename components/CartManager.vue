<!-- components/CartManager.vue -->
<template>
  <JdErrorBoundary :context="{ component: 'CartManager' }">
    <div class="cart-container">
      <CartItem v-for="item in cartItems" :key="item.id" :item="item" @quantity-change="handleQuantityChange" />

      <CartSummary @checkout="handleCheckout" />
    </div>

    <template #fallback="{ error }">
      <div class="cart-error">
        <h3>购物车加载失败</h3>
        <p>{{ error.userImpact }}</p>

        <div class="emergency-actions">
          <JdButton @click="useLocalCart">
            使用本地缓存继续结算
          </JdButton>
          <JdButton @click="clearCartAndRetry">
            清空购物车重试
          </JdButton>
        </div>
      </div>
    </template>
  </JdErrorBoundary>
</template>

<script lang="ts" setup>
import { throwJdError } from '~/utils/error';

// 创建临时的购物车 store
const cartStore = {
  cartItems: ref<Array<{ id: string;[key: string]: any }>>([]),
  loadStatus: ref('idle'),
  updateQuantity: async (itemId: string, quantity: number) => {
    // 临时实现
    console.log('Update quantity:', itemId, quantity)
  },
  validateCheckout: async () => {
    // 临时实现
    console.log('Validate checkout')
  },
  forceLocalMode: () => {
    // 临时实现
    console.log('Force local mode')
  },
  clear: async () => {
    // 临时实现
    console.log('Clear cart')
  },
  load: async () => {
    // 临时实现
    console.log('Load cart')
  }
}

const { cartItems, loadStatus } = toRefs(cartStore)

const refreshCart = async () => {
  await cartStore.load()
}

const handleQuantityChange = async (itemId: string, quantity: number) => {
  try {
    await cartStore.updateQuantity(itemId, quantity)
  } catch (error: any) {
    throwJdError({
      type: 'BUSINESS',
      code: 'STOCK_LIMIT',
      message: '库存不足',
      userImpact: `该商品最多购买${error.maxQuantity}件`,
      recoveryActions: ['retry', 'viewSimilar'],
      metadata: { sku: itemId }
    })
  }
}

const handleCheckout = async () => {
  try {
    await cartStore.validateCheckout()
    navigateTo('/checkout')
  } catch (error: any) {
    if (error.code === 'INVALID_ITEMS') {
      throwJdError({
        type: 'BUSINESS',
        code: 'CHECKOUT_INVALID',
        message: '包含无效商品',
        userImpact: '以下商品无法购买: ' + error.invalidItems.join(','),
        recoveryActions: ['removeInvalid', 'retry'],
        metadata: { invalidItems: error.invalidItems }
      })
    }
    throw error
  }
}

const useLocalCart = () => {
  cartStore.forceLocalMode()
  navigateTo('/checkout?local=true')
}

const clearCartAndRetry = async () => {
  await cartStore.clear()
  await cartStore.load()
}
</script>
