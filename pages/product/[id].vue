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
import type { JdError } from '~/types/error';
import { createJdError, isJdError } from '~/utils/error';

const { id } = useRoute().params

// 定义产品数据类型
interface ProductData {
  available: boolean;
  category?: string;
  code?: number;
  [key: string]: any;
}


// 获取数据
// 注意：useApiFetch 会自动检测业务错误（code !== 200）并显示错误弹出框
// 如果需要禁用自动弹出框，可以设置 showErrorModal: false
const { data: productData, error: fetchError } = await useApiFetch<ProductData>(`/api/products`, {
  method: 'GET',
  params: {
    id: id
  },
  transform: (data: ProductData) => {
    // 业务错误已由 useApiFetch 的 onResponse 处理并显示弹出框
    // 这里只需要返回数据即可
    return data
  }
})

// 将 FetchError 转换为 JdError（仅用于网络错误，业务错误已通过弹出框处理）
const error = computed<JdError | null>(() => {
  if (!fetchError.value) return null;

  if (isJdError(fetchError.value)) {
    return fetchError.value;
  }

  // 将 FetchError 转换为 JdError
  return createJdError({
    type: 'NETWORK',
    code: `HTTP_${fetchError.value.statusCode || 500}`,
    message: fetchError.value.message || '网络请求失败',
    severity: (fetchError.value.statusCode || 500) >= 500 ? 'HIGH' : 'MEDIUM',
    isRetryable: (fetchError.value.statusCode || 500) >= 500,
    metadata: {
      statusCode: fetchError.value.statusCode,
      url: `/api/products`,
    },
  });
})


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
