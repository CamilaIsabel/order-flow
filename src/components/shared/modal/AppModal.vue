<script setup lang="ts">
import { computed, toRefs, watchEffect } from 'vue';
import { ModalAlignments, ModalJustifys } from './modal.interface';
import Modal from './Modal.vue';

interface AppModalProps {
  modelValue: boolean;
  title?: string;
  subtitle?: string;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  beforeClose?(handlers: { close(): void; keep(value: unknown): void }): void;
  minWidth?: string | number;
  maxWidth?: string | number;
  loading?: boolean;
  footerClasses?: string;
  fullScreen?: boolean;
  alignment?: ModalAlignments;
  justifyContent?: ModalJustifys;
  transparentBackdrop?: boolean;
  modalClass?: string;
  fullWidthOnModalView?: boolean;
  forceModalWidth?: boolean;
  disablePadding?: boolean;
  enterAction?: Function;
}

interface AppModalEmits {
  (emitName: 'update:modelValue', newValue: boolean): void;
  (event: 'closed'): void;
  (event: 'closed-animation'): void;
}

const props = withDefaults(defineProps<AppModalProps>(), {
  title: '',
  subtitle: '',
  closeOnEsc: true,
  closeOnBackdrop: false,
  showCloseButton: true,
  minWidth: 560,
  maxWidth: 560,
  beforeClose: null,
  loading: false,
  footerClasses: '',
  fullScreen: false,
  fullWidthOnModalView: true,
  alignment: 'center',
  justifyContent: 'end',
  transparentBackdrop: false,
  modalClass: null,
  forceModalWidth: false,
  disablePadding: false,
  enterAction: () => {
    return;
  },
});
const emit = defineEmits<AppModalEmits>();

const {
  modelValue,
  title,
  subtitle,
  closeOnEsc,
  closeOnBackdrop,
  showCloseButton,
  minWidth,
  maxWidth,
  beforeClose,
  loading,
  footerClasses,
  fullScreen,
  alignment,
  justifyContent,
  transparentBackdrop,
  modalClass,
  forceModalWidth,
  disablePadding,
  enterAction,
} = toRefs(props);

const isOpenSync = computed<boolean>({
  set(value) {
    emit('update:modelValue', value);
  },
  get() {
    return modelValue.value;
  },
});

const backdropClasses = computed(() => {
  if (transparentBackdrop.value) {
    return 'transparent';
  }
  return 'bg-black';
});

function tryClose(): void {
  if (beforeClose.value) {
    new Promise((resolve, reject) => {
      beforeClose.value({ close: reject, keep: resolve });
    }).catch(close);

    return;
  }

  close();
}

let timeout: ReturnType<typeof setTimeout> = null;
function close(): void {
  clearTimeout(timeout);

  isOpenSync.value = false;
  emit('closed');
  timeout = setTimeout(() => {
    emit('closed-animation');
  }, 200);
}

function keyUpHandler(event: KeyboardEvent): void {
  event.preventDefault();

  if (!closeOnEsc.value) {
    return;
  }

  switch (event.key) {
    case 'Escape':
      tryClose();

    case 'Enter':
      enterAction.value();
  }
}

defineExpose({ tryClose });

watchEffect(() => {
  isOpenSync.value
    ? document.addEventListener('keyup', keyUpHandler)
    : document.removeEventListener('keyup', keyUpHandler);
});
</script>

<template>
  <div>
    <transition
      enter-active-class="transform transition duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transform duration-100 transition"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpenSync"
        class="pointer-events-auto absolute inset-0 z-50 h-full w-full bg-opacity-50 lg:fixed"
        :class="[backdropClasses]"
        v-on="closeOnBackdrop ? { click: tryClose } : {}"
      />
    </transition>

    <transition
      enter-active-class="transform transition duration-300 ease-in-out"
      leave-active-class="transform transition duration-200 ease-in-out"
      enter-from-class="opacity-0 translate-x-96"
      leave-to-class="opacity-0 translate-x-96"
    >
      <Modal
        v-if="isOpenSync"
        :try-close="tryClose"
        :title="title"
        :subtitle="subtitle"
        :show-close-button="showCloseButton"
        :min-width="minWidth"
        :max-width="maxWidth"
        :loading="loading"
        :footer-classes="footerClasses"
        :full-screen="fullScreen"
        :alignment="alignment"
        :modal-class="modalClass"
        :justify-content="justifyContent"
        :full-width-on-modal-view="fullWidthOnModalView"
        :force-modal-width="forceModalWidth"
        :disable-padding="disablePadding"
      >
        <template #default>
          <slot />
        </template>

        <template v-if="$slots.footer" #footer>
          <slot name="footer" :close="tryClose" />
        </template>

        <template v-if="$slots.header" #header>
          <slot name="header" />
        </template>

        <template #close>
          <slot name="close" />
        </template>
      </Modal>
    </transition>
  </div>
</template>
