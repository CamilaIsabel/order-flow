<script setup lang="ts">
import AppTable from '../../components/shared/table/AppTable.vue';
import { AppTableField } from '../../components/shared/table/table.interface';
import { onMounted, computed } from 'vue';
import { usePurchaseOrder } from '../../composables/use.purchase-order';
import { loadersList } from '../../composables/use.loading';
import SpinnerKeys from '../../common/utils.spinner-keys';
import AppLoadingOverlay from '../../components/shared/loading/AppLoadingOverlay.vue';

const { refreshPurchaseOrdersData, purchaseOrders } = usePurchaseOrder();

onMounted(async () => {
  await refreshPurchaseOrdersData();
});

const fields: AppTableField[] = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'currency',
    label: 'Currency',
  },
  {
    key: 'total',
    label: 'Total',
  },
];

function onRowCliked(value: any): void {
  debugger;
}

const isLoading = computed<boolean>(() => {
  return loadersList.value.includes(SpinnerKeys.PurchaseOrders);
});
</script>

<template>
  <AppLoadingOverlay :loading="isLoading" size="x-large" />

  <IconColoredCards
    v-if="!isLoading"
    class="absolute h-72 w-72 left-0 -top-20 z-50"
  />

  <div v-if="!isLoading" class="absolute inset-0 flex flex-col">
    <div class="min-h-[16rem] w-full bg-blue-900"></div>
    <div class="px-10 py-10 w-[50rem] overflow-y-auto h-full">
      <AppTable
        v-if="purchaseOrders.orders?.length"
        :fields="fields"
        :row-height="50"
        :items="purchaseOrders.orders"
        row-clickable
        @row-click="onRowCliked"
      >
        <template #name="{ data }">
          <span>{{ data.name }}</span>
        </template>
        <template #currency="{ data }">
          <span>{{ data.currency }}</span>
        </template>
        <template #total="{ data }">
          <span>{{ data.total }}</span>
        </template>
      </AppTable>
    </div>
  </div>
</template>
