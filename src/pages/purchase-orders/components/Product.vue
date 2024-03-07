<script lang="ts" setup>
import { toRefs } from 'vue';

interface Product {
  name: string;
  sku: string;
  quantity: number;
  price: string;
}

type ProductProps = {
  product: Product;
};

const props = defineProps<ProductProps>();
const { product } = toRefs(props);
</script>

<template>
  <div class="border w-80 flex flex-col gap-y-2 border-gray-600 p-5 rounded-xl">
    <div class="flex items-center gap-x-2 text-gray-600">
      <IconBox class="w-5 h-5" />
      <span>Name:</span>
      <span class="text-white">{{ product.name || '-' }}</span>
    </div>

    <div class="flex items-center gap-x-2 text-gray-600">
      <IconSku class="w-5 h-5" />
      <span>Sku:</span>
      <span class="text-white">{{ product.sku || '-' }}</span>
    </div>

    <div class="flex items-center gap-x-2 text-gray-600">
      <IconQuantity class="w-5 h-5" />
      <span>Quantity:</span
      ><span class="text-white">{{ product.quantity || '-' }}</span>
    </div>

    <div class="flex items-center gap-x-2 text-gray-600">
      <IconTag class="w-5 h-5" />
      <span>Price:</span>
      <span class="text-white">{{ product.price || '-' }}</span>
    </div>
  </div>
</template>
