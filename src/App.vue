<script setup lang="ts">
import { onMounted } from 'vue';
import { usePurchaseOrder } from './composables/use.purchase-order';
import LayoutProvider from './layouts/LayoutProvider.vue';

const { refreshPurchaseOrdersData, purchaseOrders } = usePurchaseOrder();

onMounted(async () => {
  await refreshPurchaseOrdersData();
});
</script>

<template>
  <LayoutProvider />
</template>
