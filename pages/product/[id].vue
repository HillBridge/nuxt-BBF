<!-- pages/product/[id].vue -->
<template>
  <div class="product-page">
    <!-- <JdErrorBoundaryFallback :error="error">
        <template #custom-actions>
          <JdButton @click="goHome">
            去首页
          </JdButton>
          <JdButton @click="contactCustomerService">
            联系客服
          </JdButton>
        </template>
</JdErrorBoundaryFallback> -->

    <div>
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
const { id } = useRoute().params

const { showMessage } = useMessageBox();

// 定义产品数据类型
interface ProductData {
  available: boolean;
  category?: string;
  code?: number;
  [key: string]: any;
}


// 获取数据
const { data: productData, error: fetchError } = await useApiFetch<ProductData>(`/api/products`, {
  method: 'GET',
  params: {
    id: id
  },
  transform: (data: ProductData) => {
    return data
  }
})

if (fetchError.value) {
  showMessage({
    type: 'error',
    message: fetchError.value.message
  })
}
</script>
