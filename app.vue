<template>
  <NuxtErrorBoundary @error="handleError">
    <NuxtPage />
    <template #error="{ error }">
      <div class="error-container">
        <h1>Something went wrong!</h1>
        <pre>{{ error.message }}</pre>
        <button @click="resetError">Retry</button>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>

<script setup>
const handleError = (error) => {
  console.error('Global error:', error)
  // useTrackError(error)
}
</script>
