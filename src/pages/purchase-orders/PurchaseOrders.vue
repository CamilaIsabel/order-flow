<script setup lang="ts">
import AppTable from '../../components/shared/table/AppTable.vue';
import { AppTableField } from '../../components/shared/table/table.interface';
import { computed, onBeforeMount } from 'vue';
import { usePurchaseOrder } from '../../composables/use.purchase-order';
import { loadersList } from '../../composables/use.loading';
import SpinnerKeys from '../../common/utils.spinner-keys';
import AppLoadingOverlay from '../../components/shared/loading/AppLoadingOverlay.vue';
import OrderDetails from './components/OrderDetails.vue';
import AddProductModal from './components/AddProductModal.vue';
import { formatDate } from '../../common/utils';
import { Status } from './components/types';
import { OrderInfoData } from './components/types';
import OrderCardInfo from './components/OrderCardInfo.vue';

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
    key: 'status',
    label: 'Status',
  },

  {
    key: 'updatedAt',
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

const paidOrders = computed<number>(() => {
  return purchaseOrders.value.orders.filter(
    (order) => order.status.ecartapiId === Status.paid
  ).length;
});

const cancelledOrders = computed<number>(() => {
  return purchaseOrders.value.orders.filter(
    (order) => order.status.ecartapiId === Status.cancelled
  ).length;
});

const totalOrders = computed<number>(() => {
  return purchaseOrders.value.orders?.length;
});

function statusClasses(statusId: Status): string {
  switch (statusId) {
    case Status.cancelled:
      return 'border-red-600 text-red-600';
    case Status.paid:
      return 'border-green-600 text-green-600';
    default:
      return 'border-gray-600 text-gray-600';
  }
}

const ordersInfo: OrderInfoData[] = [
  {
    icon: 'IconPurchaseBag',
    label: 'Total orders',
    value: totalOrders,
    backgroundIconClass: 'bg-gold',
  },
  {
    icon: 'IconMoney',
    label: 'Paid orders',
    value: paidOrders,
    backgroundIconClass: 'bg-green-500',
  },
  {
    icon: 'IconAlert',
    label: 'Cancelled orders',
    value: cancelledOrders,
    backgroundIconClass: 'bg-red-500',
  },
];
</script>

<template>
  <AppLoadingOverlay
    classes="bg-black bg-opacity-30 lg:rounded-l-[64px]"
    :loading="isLoading"
    size="x-large"
  />
  <div class="w-full h-full">
    <transition name="slide-fade">
      <div
        v-if="!showOrderDetails && !isLoading && purchaseOrders.orders?.length"
        class="w-full h-full relative"
      >
        <IconColoredCards
          class="absolute h-60 w-60 left-6 -top-12 z-50 hidden lg:block"
        />

        <div class="absolute inset-0 flex flex-col">
          <div class="w-full h-full flex flex-col">
            <div
              class="min-h-[13rem] flex flex-wrap lg:pl-72 justify-center lg:justify-start w-full pt-5 gap-5"
            >
              <OrderCardInfo
                v-for="(info, index) in ordersInfo"
                :key="index"
                :info="info"
              />
            </div>
            <div class="p-10 w-full overflow-y-auto flex flex-col h-full">
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
                <template #status="{ data }">
                  <span
                    class="px-3 py-[1px] items-center text-sm font-semibold flex w-min rounded-lg border"
                    :class="[statusClasses(data.status.ecartapiId)]"
                    >{{ data.status.financial }}</span
                  >
                </template>
                <template #updatedAt="{ data }">
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
