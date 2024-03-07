<script lang="ts" setup>
import { ref } from 'vue';
import { usePurchaseOrder } from '../../../composables/use.purchase-order';
import Product from './Product.vue';
import { useToaster } from '../../../components/shared/toaster/use.toasters';

const { selectedOrder, showOrderDetails, openAddProductModal } =
  usePurchaseOrder();
const { toaster } = useToaster();

const paid = ref<boolean>(false);

function payOrder(): void {
  // hardcoded data just to demo
  if (paid.value) return;
  paid.value = true;

  toaster({
    title: 'Order paid successfully',
    type: 'success',
  });
}
</script>
<template>
  <div class="w-full h-full flex flex-col px-10 pt-10 pb-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-x-2">
        <button
          @click="showOrderDetails = false"
          class="flex items-center justify-center bg-[#2E2836] rounded-lg p-1"
        >
          <IconBackArrow class="h-5 w-5" />
        </button>
        <span class="font-bold text-base text-white"
          >Order Number
          <span class="text-gray-400">#{{ selectedOrder.number }}</span></span
        >
      </div>

      <button
        class="flex items-center justify-center px-4 gap-x-2 bg-[#2E2836] rounded-lg p-2 text-white font-bold text-xs"
        @click="openAddProductModal"
      >
        <IconPlus class="h-3 w-3" />
        <span>Add Product</span>
      </button>
    </div>
    <div class="w-full h-full flex flex-wrap mt-10 gap-5 overflow-y-auto">
      <Product
        v-for="(product, index) in selectedOrder.items"
        :key="index"
        :product="product"
      />
    </div>
    <div class="w-full flex justify-end mt-4">
      <div
        @click="payOrder"
        class="flex items-center relative justify-between gap-x-2 bg-[#2E2836] rounded-full text-white font-bold text-xs"
      >
        <div
          :class="
            paid
              ? 'w-full bg-gray-500'
              : 'w-min bg-violet-600 hover:bg-violet-700 cursor-pointer'
          "
          class="py-2 px-4 transition-all duration-500 left-0 font-semibold text-white rounded-full h-full"
        >
          {{ paid ? 'Paid' : 'Pay' }}
        </div>

        <div v-if="!paid" class="px-4">${{ selectedOrder.totals.total }}</div>
      </div>
    </div>
  </div>
</template>
