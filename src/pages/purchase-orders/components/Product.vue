<script lang="ts" setup>
import { toRefs } from 'vue';
import { Product } from './types';

type ProductProps = {
  product: Product;
};

const props = defineProps<ProductProps>();
const { product } = toRefs(props);
</script>

<template>
  <div
    class="w-80 h-min flex flex-col gap-y-2 background-div border-gray-800 border-[1px] shadow-xl p-5 rounded-xl"
  >
    <div class="flex items-center gap-x-2 text-gray-500">
      <IconBox class="w-5 h-5" />
      <span>Name:</span>
      <span class="text-white">{{ product.name || '-' }}</span>
    </div>

    <div class="flex items-center gap-x-2 text-gray-500">
      <IconSku class="w-5 h-5" />
      <span>Sku:</span>
      <span class="text-white">{{ product.sku || '-' }}</span>
    </div>

    <div class="flex items-center gap-x-2 text-gray-500">
      <IconQuantity class="w-5 h-5" />
      <span>Quantity:</span
      ><span class="text-white">{{ product.quantity || '-' }}</span>
    </div>

    <div class="flex items-center gap-x-2 text-gray-500">
      <IconTag class="w-5 h-5" />
      <span>Price:</span>
      <span class="text-white">{{ product.price || '-' }}</span>
    </div>
  </div>
</template>

<style>
.background-div {
  background-color: rgba(0, 0, 0, 0.12);
}
</style>
