<!-- pages/product/[id].vue -->
<template>
  <div class="product-page">
    <div v-if="error" class="product-error">
      <JdErrorBoundaryFallback :error="error">
        <template #custom-actions>
          <JdButton @click="goHome">
            去首页
          </JdButton>
          <JdButton @click="contactCustomerService">
            联系客服
          </JdButton>
        </template>
      </JdErrorBoundaryFallback>
    </div>

    <div v-else>
      <JdLogo />
      <!-- 被JdErrorBoundary包裹的组件 -->
      <CartManager />
      <!-- ProductDetailHero -->
      <ProductDetailHero :product="productData?.value || undefined" />
      <!-- ProductRecommendations -->
      <ProductRecommendations />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { throwJdError } from '~/utils/error';

const { id } = useRoute().params

// 定义产品数据类型
interface ProductData {
  available: boolean;
  category?: string;
  code?: number;
  [key: string]: any;
}

// 使用 ref 来存储数据和错误
const productData = ref<ProductData | null>(null)
const error = ref<any>(null)

// 获取数据
try {
  const { data } = await useSafeFetch<ProductData>(`/api/products/${id}`, {
    transform: (data: ProductData) => {
      if (data.code !== 200) {

        // 当http成功, 但是业务错误, 将后台的错误信息以ui错误的形式展示出来, 并提供重试, 返回首页, 联系客服, 反馈问题等操作
        // 相比于弹出框 可以更长久的展示错误信息, 并提供操作
        throwJdError({
          type: 'BUSINESS',
          code: 'PRODUCT_UNAVAILABLE',
          message: '该商品已下架',
          recoveryActions: ['home', 'similar', 'notify'],
          metadata: { productId: id }
        })
      }
      return data
    }
  })
  productData.value = data.value
} catch (err) {
  error.value = err
}

const useToast = () => ({
  show: (message: string) => {
    console.log('Toast:', message);
  }
});

const goHome = () => {
  navigateTo(`/`)
}

const contactCustomerService = async () => {
  try {
    // 打开客服聊天窗口
    useJdService().openCustomerChat()

    // 显示提示信息
    useToast().show('正在为您连接客服...')

    // 可以添加一些额外的逻辑，比如记录用户咨询行为
    console.log('用户联系客服，商品ID:', id)

  } catch (error) {
    // 如果客服系统不可用，显示备用方案
    useToast().show('客服暂时不可用，请稍后再试')
    console.error('联系客服失败:', error)
  }
}
</script>
