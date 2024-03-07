<script lang="ts" setup>
import { toRefs } from 'vue';
import { OrderInfoData } from './types';

interface OrderInfoProps {
  info: OrderInfoData;
}

const props = defineProps<OrderInfoProps>();
const { info } = toRefs(props);
</script>

<template>
  <div
    class="bg-dark-background h-full font-medium rounded-xl text-white flex justify-center gap-y-4 flex-col text-center items-center w-40"
  >
    <div class="p-3 shadow-xl rounded-lg" :class="info.backgroundIconClass">
      <component :is="info.icon" class="h-7 w-7" :alt="info.label" />
    </div>
    <span class="text-white whitespace-nowrap">{{ info.label }}</span>
    <span class="text-gray-400 text-xs">{{ info.value }}</span>
  </div>
</template>
