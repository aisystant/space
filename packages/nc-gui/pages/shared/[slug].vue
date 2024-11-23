<script setup lang="ts">
definePageMeta({
  public: true,
  requiresAuth: false,
  hasSidebar: false,
})

const route = useRoute()

useMetas()
</script>

<template>
  <div class="h-full">This is shared page use for redirection purpose only {{ route.params.slug }}</div>
</template>

<style lang="scss" scoped></style>
