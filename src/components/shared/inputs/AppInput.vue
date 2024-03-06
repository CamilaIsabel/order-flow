<script lang="ts" setup>
import { ComponentRounded, ComponentSize, ComponentTextSize } from '../types';
import { computed, onMounted, ref, toRefs, watch } from 'vue';
import { InputType } from './inputs.interface';
import { generateUuid } from '../../../common/utils';
import { RuleExpression, useField } from 'vee-validate';

type AppInputProps = {
  rounded?: ComponentRounded;
  size?: ComponentSize;
  textSize?: ComponentTextSize;
  label?: string;
  placeholder?: string;
  id?: string;
  borderless?: boolean;
  clearable?: boolean;
  readonly?: boolean;
  type?: InputType;
  fullWidth?: boolean;
  width?: string;
  disabled?: boolean;
  isError?: boolean;
  errorText?: string;
  modelValue?: string | number;
  name?: string;
  rules?: RuleExpression<string>;
  step?: number;
  formatter?(value: string): string;
  focusOnMount?: boolean;
  selectOnMount?: boolean;
  backgroundColorClass?: string;
};
interface AppInputEvents {
  (eventName: 'update:modelValue', value: string | number): void;
  (eventName: 'input', value: string | number): void;
  (eventName: 'enter', value: string | number): void;
  (eventName: 'appendIconClick'): void;
  (eventName: 'prependIconClick'): void;
  (eventName: 'appendButtonClick'): void;
  (eventName: 'prependButtonClick'): void;
  (eventName: 'focus'): void;
  (eventName: 'blur'): void;
}

const props = withDefaults(defineProps<AppInputProps>(), {
  modelValue: '',
  rounded: 'default',
  size: 'medium',
  textSize: 'medium',
  label: undefined,
  placeholder: '',
  id: undefined,
  borderless: false,
  clearable: false,
  fullWidth: false,
  type: 'text',
  disabled: false,
  readonly: false,
  isError: false,
  errorText: undefined,
  width: undefined,
  name: '',
  rules: undefined,
  step: 1,
  formatter: null,
  focusOnMount: false,
  selectOnMount: false,
  backgroundColorClass: 'bg-white',
});
const emits = defineEmits<AppInputEvents>();

const {
  rounded,
  size,
  textSize,
  label,
  placeholder,
  id,
  borderless,
  clearable,
  modelValue,
  fullWidth,
  type,
  disabled,
  readonly,
  isError,
  errorText,
  width,
  name,
  rules,
  step,
  formatter,
  focusOnMount,
  selectOnMount,
  backgroundColorClass,
} = toRefs(props);

const inputElementRef = ref<HTMLInputElement | null>(null);
const inputId = computed(() => id.value || generateUuid());

const { value: inputValue, meta } = useField(name, rules, {
  initialValue: modelValue.value,
});

defineExpose({ meta });

watch(disabled, (newValue) => {
  if (newValue) inputElementRef.value?.blur();
});

const hasInputError = computed<boolean>(
  () => isError.value || !!errorText.value
);

function onInput(event: InputEvent): void {
  let value = (event.target as HTMLInputElement).value;
  if (formatter.value) {
    value = formatter.value(value);
  }
  inputValue.value = value;
  emits('update:modelValue', value);
  emits('input', value);
}

function onFocus(): void {
  isInputFocused.value = true;
  emits('focus');
}

function onBlur(): void {
  isInputFocused.value = false;
  emits('blur');
}

function onEnterPress(): void {
  emits('enter', modelValue.value);
}

const isInputFocused = ref(false);
const isInputFilled = computed(
  () => modelValue.value !== undefined && modelValue.value !== ''
);
const shouldClearButtonBeVisible = computed(
  () => clearable.value && isInputFilled.value
);
function clearInput(): void {
  if (disabled.value) return;
  if (inputElementRef.value) {
    inputElementRef.value.value = '';
    inputElementRef.value.focus();
  }
  emits('update:modelValue', '');
}

const isPasswordType = computed(() => type.value === 'password');
const localType = ref<InputType>(type.value);
watch(
  isPasswordType,
  (isPasswordType) => {
    if (isPasswordType) {
      localType.value = isPasswordType ? 'password' : 'text';
    }
  },
  { immediate: true }
);
function togglePasswordType(): void {
  if (disabled.value) return;
  localType.value = localType.value === 'password' ? 'text' : 'password';
}

const fullWithContainerClasses = computed<string>(() =>
  fullWidth.value ? 'w-full' : ''
);
const inputBorderlessClasses = computed<string>(() =>
  borderless.value ? 'border-transparent' : 'border-gray-400'
);
const inputRoundedClasses = computed<string>(() => {
  switch (rounded.value) {
    case 'none':
      return 'rounded-none';
    case 'default':
      switch (size.value) {
        case 'small':
          return 'rounded-md';
        case 'medium':
          return 'rounded-lg';
        case 'large':
          return 'rounded-lg';
        default:
          return 'rounded-lg';
      }
    case 'full':
      return 'rounded-full';
    default:
      return 'rounded';
  }
});
const errorTextSizeClasses = computed<string>(() => {
  switch (size.value) {
    case 'small':
      return 'text-xs';
    case 'medium':
      return 'text-sm';
    case 'large':
      return 'text-base';
    default:
      return 'text-sm';
  }
});

const paddingClasses = computed<string>(() => {
  const mediumSizeClass = 'px-4 py-2';
  switch (size.value) {
    case 'small':
      return 'px-2 py-1';
    case 'medium':
      return mediumSizeClass;
    case 'large':
      return 'px-7 py-3';
    default:
      return mediumSizeClass;
  }
});

const textSizeClasses = computed<string>(() => {
  const mediumTextSizeClass = 'text-sm';
  switch (textSize.value) {
    case 'small':
      return 'text-sm';
    case 'medium':
      return mediumTextSizeClass;
    case 'large':
      return 'text-lg';
    default:
      return mediumTextSizeClass;
  }
});

const labelSizeClasses = computed<string>(() => {
  switch (size.value) {
    case 'small':
      return 'text-xs';
    case 'medium':
      return 'text-sm';
    case 'large':
      return 'text-base';
    default:
      return 'text-sm';
  }
});

function emitAppendButtonClick(): void {
  if (disabled.value) return;
  emits('appendButtonClick');
}
function emitPrependButtonClick(): void {
  if (disabled.value) return;
  emits('prependButtonClick');
}

onMounted(() => {
  if (focusOnMount.value) {
    inputElementRef.value?.focus();
  }
  if (selectOnMount.value) {
    inputElementRef.value?.select();
  }
});
</script>

<template>
  <div
    class="inline-flex flex-col gap-y-1"
    :style="{ width }"
    :class="fullWithContainerClasses"
  >
    <div class="flex items-center gap-x-2">
      <!-- LABEL -->
      <label
        v-if="label"
        :aria-disabled="disabled"
        :aria-selected="isInputFocused"
        :aria-errormessage="String(hasInputError)"
        :for="inputId"
        class="text-gray-600 transition-colors aria-disabled:cursor-not-allowed aria-disabled:select-none aria-disabled:opacity-50 aria-selected:text-blue-600 aria-[errormessage=true]:text-red-600"
        :class="labelSizeClasses"
      >
        {{ label }}
      </label>
    </div>
    <!--CONTAINER-->
    <div
      :aria-errormessage="String(hasInputError)"
      :aria-selected="isInputFocused"
      :aria-disabled="disabled"
      class="group peer relative inline-flex items-center justify-start overflow-hidden border transition-all duration-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-selected:border-blue-600 aria-selected:ring-1 aria-selected:ring-blue-600 aria-selected:ring-offset-0 aria-[errormessage=true]:border-red-600 aria-[errormessage=true]:ring-1 aria-[errormessage=true]:ring-red-600 aria-[errormessage=true]:ring-offset-0"
      :class="[
        inputRoundedClasses,
        inputBorderlessClasses,
        backgroundColorClass,
      ]"
    >
      <!--APPEND BUTTON-->
      <div
        v-if="$slots.appendButton"
        class="inline group-aria-disabled:cursor-not-allowed"
        @click="emitAppendButtonClick"
      >
        <slot
          name="appendButton"
          :disabled="disabled"
          :is-input-focused="isInputFocused"
          :has-input-error="hasInputError"
          :size="size"
          :rounded="rounded"
        />
      </div>
      <!--APPEND ICON BUTTON-->
      <button
        v-else-if="$slots.appendIcon"
        class="pr-0 text-gray-400 group-aria-disabled:cursor-not-allowed group-aria-disabled:opacity-50 group-aria-selected:text-blue-600 group-aria-[errormessage=true]:text-red-600"
        :class="[paddingClasses]"
        :disabled="disabled"
        @click="emits('appendIconClick')"
      >
        <slot name="appendIcon" />
      </button>
      <!--INPUT AND LABEL-->
      <div class="relative grow">
        <input
          :id="inputId"
          ref="inputElementRef"
          :type="localType"
          class="peer w-full focus:caret-blue-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 group-aria-[errormessage=true]:caret-red-600"
          :class="[paddingClasses, textSizeClasses, backgroundColorClass]"
          :disabled="disabled"
          :placeholder="placeholder"
          :value="modelValue"
          :readonly="readonly"
          :name="name"
          :step="step"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
          @keydown.enter="onEnterPress"
        />
      </div>
      <!--CLEARABLE BUTTON-->
      <button
        v-if="clearable"
        class="invisible translate-y-1/4 transform pl-0 text-gray-400 opacity-0 transition-all ease-in-out aria-checked:visible aria-checked:translate-y-0 aria-checked:opacity-100 group-aria-disabled:cursor-not-allowed group-aria-disabled:opacity-50 group-aria-selected:text-blue-600 group-aria-[errormessage=true]:text-red-600"
        :class="[paddingClasses]"
        :aria-checked="shouldClearButtonBeVisible"
        :disabled="disabled"
        @click="clearInput"
      >
        <IconClose />
      </button>
      <!--PASSWORD TOGGLE BUTTON-->
      <button
        v-if="isPasswordType"
        class="pl-0 text-gray-400 group-aria-disabled:cursor-not-allowed group-aria-disabled:opacity-50 group-aria-selected:text-blue-600 group-aria-[errormessage=true]:text-red-600"
        :class="[paddingClasses]"
        :disabled="disabled"
        @click.prevent="togglePasswordType"
      >
        <IconEye v-show="localType === 'password'" />
        <IconEyeSlash v-show="localType === 'text'" />
      </button>
      <!--PREPEND BUTTON-->
      <div
        v-if="$slots.prependButton"
        class="inline group-aria-disabled:cursor-not-allowed"
        @click="emitPrependButtonClick"
      >
        <slot
          name="prependButton"
          :disabled="disabled"
          :is-input-focused="isInputFocused"
          :has-input-error="hasInputError"
          :size="size"
          :rounded="rounded"
        />
      </div>
      <!--PREPEND ICON BUTTON-->
      <button
        v-else-if="$slots.prependIcon"
        class="pl-0 text-gray-400 group-aria-disabled:cursor-not-allowed group-aria-disabled:opacity-50 group-aria-selected:text-blue-600 group-aria-[errormessage=true]:text-red-600"
        :class="[paddingClasses]"
        :disabled="disabled"
        @click="emits('prependIconClick')"
      >
        <slot name="prependIcon" />
      </button>
    </div>
    <!--ERROR TEXT-->
    <div
      v-if="errorText"
      class="ml-2 text-sm text-red-500 peer-aria-disabled:cursor-not-allowed peer-aria-disabled:opacity-50"
      :class="[errorTextSizeClasses]"
    >
      {{ errorText }}
    </div>
  </div>
</template>
