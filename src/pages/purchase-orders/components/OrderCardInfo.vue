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
    class="bg-dark-background h-full font-normal rounded-xl text-white flex justify-center gap-y-2 flex-col text-center items-center w-28"
  >
    <div class="p-1 shadow-xl rounded-lg" :class="info.backgroundIconClass">
      <component :is="info.icon" class="h-6 w-6" :alt="info.label" />
    </div>
    <span class="whitespace-nowrap text-sm">{{ info.label }}</span>
    <span class="text-gray-400 text-xs font-semibold">{{ info.value }}</span>
  </div>
</template>
