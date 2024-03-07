<script setup lang="ts">
import {
  computed,
  CSSProperties,
  onBeforeUnmount,
  onMounted,
  ref,
  toRefs,
  watch,
} from 'vue';
import AppLoadingOverlay from '../loading/AppLoadingOverlay.vue';
import { ModalAlignments, ModalJustifys } from './modal.interface';
import { useMobileListeners } from '../../../composables/use.mobile';
import { onClickOutside } from '@vueuse/core';

interface ModalProps {
  title?: string;
  subtitle?: string;
  showCloseButton?: boolean;
  minWidth?: string | number;
  maxWidth?: string | number;
  loading?: boolean;
  footerClasses?: string;
  fullScreen?: boolean;
  alignment?: ModalAlignments;
  justifyContent: ModalJustifys;
  modalClass?: string;
  tryClose: Function;
  fullWidthOnModalView?: boolean;
  forceModalWidth?: boolean;
  disablePadding?: boolean;
}

const props = withDefaults(defineProps<ModalProps>(), {
  title: '',
  subtitle: '',
  showCloseButton: true,
  minWidth: 560,
  maxWidth: 560,
  beforeClose: null,
  loading: false,
  footerClasses: '',
  fullScreen: false,
  alignment: 'center',
  modalClass: null,
  justifyContent: 'end',
  fullWidthOnModalView: true,
  forceModalWidth: false,
  disablePadding: false,
});

const {
  title,
  subtitle,
  showCloseButton,
  minWidth,
  maxWidth,
  loading,
  footerClasses,
  fullScreen,
  alignment,
  justifyContent,
  modalClass,
  tryClose,
  fullWidthOnModalView,
  forceModalWidth,
  disablePadding,
} = toRefs(props);

const modalRef = ref<HTMLElement>(null);
const currentModalRef = ref<HTMLDivElement>(null);

onClickOutside(currentModalRef, (event: PointerEvent) => {
  switch ((event.target as HTMLInputElement).id) {
    default:
      tryClose.value();
  }
});

const modalStyles = ref<CSSProperties>();
const { initMobileListener, removeMobileListener, isMobileScreen } =
  useMobileListeners();

watch(isMobileScreen, (newValue) => {
  handleWindowSizeChange(newValue);
});

const modalClasses = computed(() => {
  return {
    'h-full w-full': fullScreen.value,
    'h-auto': !fullScreen.value,
    'rounded-lg': justifyContent.value === 'center',
  };
});

const modalAlignmentClasses = computed(() => {
  if (alignment.value === 'center') {
    return 'items-center';
  }
  if (alignment.value === 'top') {
    return 'items-start';
  }
  if (alignment.value === 'bottom') {
    return 'items-end mb-10';
  }

  return 'items-center';
});

const modalJustifyClasses = computed(() => {
  if (justifyContent.value === 'center') {
    return 'justify-center';
  }
  if (justifyContent.value === 'start') {
    return 'justify-start';
  }
  if (justifyContent.value === 'end') {
    return 'justify-end mb-10';
  }

  return 'justify-center';
});

onMounted(() => {
  initMobileListener();
  handleWindowSizeChange(isMobileScreen.value);
});

function handleWindowSizeChange(mobileScreen: boolean): void {
  if (mobileScreen && !forceModalWidth.value) {
    // mobile screen
    modalStyles.value = { width: '100%' };

    if (!fullWidthOnModalView.value) {
      modalStyles.value = { width: '100%', margin: '30px' };
    }
  } else {
    // screen is not mobile
    modalStyles.value = {
      ...(minWidth.value && { minWidth: `${minWidth.value}px` }),
      ...(maxWidth.value && { maxWidth: `${maxWidth.value}px` }),
    };
  }
}

onBeforeUnmount(() => {
  removeMobileListener();
});

const defaultSlotPadding = computed<string>(() => {
  if (disablePadding.value) return;
  return 'px-4 lg:px-9';
});

const defaultSlotParentPadding = computed<string>(() => {
  if (disablePadding.value) return;
  return 'pb-6 pt-1';
});

const headerSlotPadding = computed<string>(() => {
  if (disablePadding.value) return;
  return 'px-4 lg:px-9';
});

const containerPadding = computed<string>(() => {
  if (disablePadding.value) return;
  return 'pt-4 lg:pt-9';
});
</script>

<template>
  <div
    ref="modalRef"
    class="absolute inset-0 z-50 flex h-full overflow-y-hidden lg:fixed"
    :class="[modalAlignmentClasses, modalJustifyClasses]"
  >
    <div
      ref="currentModalRef"
      class="relative flex flex-col bg-white shadow-md"
      :style="modalStyles"
      :class="[modalClasses, modalClass, containerPadding]"
    >
      <AppLoadingOverlay size="large" :loading="loading" />

      <div
        v-if="title || $slots.header"
        :class="headerSlotPadding"
        class="mb-5 flex flex-col"
      >
        <div class="flex w-full items-center justify-between">
          <slot name="header">
            <h2 v-if="title" class="text-xl font-bold">
              {{ title }}
            </h2>
          </slot>
          <button
            v-if="showCloseButton"
            class="flex-grow-0"
            @click="tryClose()"
          >
            <slot name="close"><IconClose class="h-6 w-6" /></slot>
          </button>
        </div>
        <p class="mt-1 text-sm font-normal text-gray-400">{{ subtitle }}</p>
      </div>
      <div class="h-full overflow-y-auto" :class="defaultSlotPadding">
        <div class="h-full" :class="defaultSlotParentPadding">
          <slot />
        </div>
      </div>
      <div
        v-if="$slots.footer"
        :class="footerClasses"
        class="border-t border-gray-200 px-4 py-2 lg:px-9"
      >
        <slot name="footer" :close="tryClose" />
      </div>
    </div>
  </div>
</template>

<style>
.sheet {
  background-image: linear-gradient(
    to right top,
    rgba(0, 0, 0, 0.7),
    rgba(20, 5, 13, 0.7),
    rgba(28, 11, 25, 0.7),
    rgba(33, 16, 38, 0.7),
    rgba(32, 22, 53, 0.7),
    rgba(47, 29, 62, 0.7),
    rgba(62, 36, 70, 0.7),
    rgba(77, 44, 78, 0.7),
    rgba(103, 59, 76, 0.7),
    rgba(120, 78, 78, 0.7),
    rgba(130, 101, 87, 0.7),
    rgba(137, 123, 105, 0.7)
  );
}
</style>
