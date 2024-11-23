<script lang="ts" setup>
import type { ViewType } from 'nocodb-sdk'

interface Props {
  view: ViewType & { meta: object & Record<string, any> }
  dashboardUrl: string
}

const emits = defineEmits(['updateSharedView', 'copyCustomUrl'])
</script>

<template>
  <span class="hidden"></span>
</template>

<style lang="scss" scoped></style>
