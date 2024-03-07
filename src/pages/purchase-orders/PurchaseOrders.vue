<script setup lang="ts">
import AppTable from '../../components/shared/table/AppTable.vue';
import { AppTableField } from '../../components/shared/table/table.interface';
import { computed, onBeforeMount, onMounted } from 'vue';
import { usePurchaseOrder } from '../../composables/use.purchase-order';
import { loadersList } from '../../composables/use.loading';
import SpinnerKeys from '../../common/utils.spinner-keys';
import AppLoadingOverlay from '../../components/shared/loading/AppLoadingOverlay.vue';
import OrderDetails from './components/OrderDetails.vue';
import AddProductModal from './components/AddProductModal.vue';
import { formatDate } from '../../common/utils';

const {
  refreshPurchaseOrdersData,
  purchaseOrders,
  selectedOrder,
  showOrderDetails,
} = usePurchaseOrder();

onBeforeMount(async () => {
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
    key: 'payment',
    label: 'Status',
  },

  {
    key: 'dates',
    label: 'Updated At',
  },
];

function onRowCliked(order: any): void {
  selectedOrder.value = order;
  showOrderDetails.value = true;
}

const isLoading = computed<boolean>(() => {
  return loadersList.value.includes(SpinnerKeys.PurchaseOrders);
});
</script>

<template>
  <AppLoadingOverlay
    classes="bg-black bg-opacity-30 rounded-l-[64px]"
    :loading="isLoading"
    size="x-large"
  />
  <div class="w-full h-full">
    <transition name="slide-fade">
      <div
        v-if="!showOrderDetails && !isLoading && purchaseOrders.orders?.length"
        class="w-full h-full relative"
      >
        <IconColoredCards class="absolute h-72 w-72 left-0 -top-20 z-50" />

        <div class="absolute inset-0 flex flex-col">
          <div class="w-full h-full flex flex-col">
            <div class="min-h-[13rem] w-full"></div>
            <div class="p-10 w-[70rem] overflow-y-auto flex flex-col h-full">
              <span class="font-semibold text-base mb-5 text-white"
                >Recent Orders</span
              >
              <AppTable
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
                <template #payment="{ data }">
                  <span>{{ data.payment.status }}</span>
                </template>
                <template #dates="{ data }">
                  <span>{{ formatDate(new Date(data.dates.updatedAt)) }}</span>
                </template>
              </AppTable>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="slide-fade">
      <div v-if="showOrderDetails" class="absolute inset-0 flex flex-col">
        <OrderDetails />
      </div>
    </transition>

    <AddProductModal />
  </div>
</template>
