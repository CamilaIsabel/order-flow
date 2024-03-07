<script lang="ts">
import { AppToasterTypes } from './toaster.interface';

const iconTypeClasses: Record<AppToasterTypes, string> = {
  info: 'text-indigo-600',
  success: 'text-lime-600',
  warning: 'text-orange-500',
  error: 'text-red-700',
};
</script>

<script lang="ts" setup>
import { useTimerPausable } from '../../../composables/use.timer-pausable';
import { computed, toRefs } from 'vue';
import IconSuccess from '../../icons/IconSuccess.vue';
import IconWarning from '../../icons/IconWarning.vue';
import IconError from '../../icons/IconError.vue';
import IconClose from '../../icons/IconClose.vue';
import IconInfo from '../../icons/IconInfo.vue';

interface AppToasterProps {
  id: string | number;
  title: string;
  text?: string | null;
  type?: AppToasterTypes;
  duration?: number;
}

const props = defineProps<AppToasterProps>();
const { title, text, type, duration } = toRefs(props);

const emits = defineEmits<{
  (emitName: 'close'): void;
}>();

const { pause, resume } = useTimerPausable(close, duration.value || 4000);

const toasterIcon = computed(() => {
  if (type.value === 'info') {
    return IconInfo;
  }
  if (type.value === 'success') {
    return IconSuccess;
  }
  if (type.value === 'warning') {
    return IconWarning;
  }
  if (type.value === 'error') {
    return IconError;
  }

  return IconInfo;
});

const iconClasses = computed(() => iconTypeClasses[type.value]);

function close(): void {
  emits('close');
}
</script>

<template>
  <div
    class="pointer-events-auto flex flex-col rounded-lg bg-white px-5 py-3 shadow-md shadow-gray-400"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-x-3">
        <component
          :is="toasterIcon"
          class="h-6 w-6 flex-shrink-0"
          :class="iconClasses"
        />

        <span class="w-[350px] break-words text-lg text-gray-600">{{
          title
        }}</span>
      </div>

      <button @click="close">
        <IconClose class="h-5 w-5 flex-shrink-0 text-slate-600" />
      </button>
    </div>

    <p class="pl-10 text-base">
      {{ text }}
    </p>
  </div>
</template>
