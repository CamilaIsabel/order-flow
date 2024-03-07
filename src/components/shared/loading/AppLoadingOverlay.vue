<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import { ComponentColor } from '../types/ComponentColor';
import { ComponentSize } from '../types/ComponentSize';
import AppLoadingSpinner from './AppLoadingSpinner.vue';

interface AppLoadingOverlayProps {
  loading: boolean;
  size?: ComponentSize;
  color?: ComponentColor;
}

const props = withDefaults(defineProps<AppLoadingOverlayProps>(), {
  loading: false,
  size: 'medium',
  color: 'blue',
});

const { size, color, loading } = toRefs(props);

const sizeClasses = computed<string>(() => {
  switch (size.value) {
    case 'small':
      return 'text-base';
    case 'medium':
      return 'text-xl';
    case 'large':
      return 'text-3xl';
    case 'x-large':
      return 'text-6xl';
    default:
      return 'text-xl';
  }
});

const colorClasses = computed<string>(() => {
  switch (color.value) {
    case 'blue':
      return 'text-indigo-600';
    case 'cyan':
      return 'text-teal-500';
    case 'red':
      return 'text-red-700';
    case 'orange':
      return 'text-orange-500';
    case 'green':
      return 'text-lime-600';
    case 'dark':
      return 'text-gray-600';
    default:
      return 'text-indigo-600';
  }
});
</script>

<template>
  <transition
    enter-active-class="transition"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="loading"
      class="absolute inset-0 z-10 flex cursor-wait items-center justify-center bg-background bg-opacity-70"
      :class="[sizeClasses, colorClasses]"
    >
      <AppLoadingSpinner />
    </div>
  </transition>
</template>
